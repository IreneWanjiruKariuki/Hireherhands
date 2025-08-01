from marshmallow import ValidationError
from models.Job import Job, JobStatus
from models.Worker import Worker, WorkerStatus
from models.Skill import Skill
from models.Rating import Rating
from models.schemas.Job import JobCreateSchema, JobOutputSchema
from models.association import worker_skills
from decimal import Decimal
from sqlalchemy.orm import joinedload
from sqlalchemy import func
from extensions import db

job_input_schema = JobCreateSchema()
job_output_schema = JobOutputSchema()
job_output_many = JobOutputSchema(many=True)

class JobService:
    @staticmethod
    def create_job(data, client_id):
        try:
            validated_data = job_input_schema.load(data)
        except ValidationError as err:
            return {'errors': err.messages}, 400
            
        skill = Skill.query.get(validated_data['skill_id'])
        if not skill:
            return {'error': 'Invalid skill_id'}, 400

        job = Job(
            worker_id=None,  # Initially, no worker is assigned
            client_id=client_id,
            skill_id=validated_data.get('skill_id'),
            skill_name=skill.skill_name,
            description=validated_data.get('description'),
            budget=validated_data.get('budget'),
            location=validated_data.get('location'),
            road=validated_data.get('road'), 
            building_name=validated_data.get('building_name'), 
            house_number=validated_data.get('house_number'),  
            scheduled_date=validated_data.get('scheduled_date'),
            scheduled_time=validated_data.get('scheduled_time'),
            status= JobStatus.OPEN,  # Set initial status to 'open'
            duration=validated_data.get("duration")
        )
        db.session.add(job)
        db.session.commit()
        #return {'message': 'Job created successfully', 'job_id': job.job_id}, 201
        return {
            'message': 'Job created successfully',
            'job': job_output_schema.dump(job)
            }, 201


    @staticmethod
    def matching_workers(job_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404

        workers = (
            Worker.query
            .filter(
                Worker.skills.any(Skill.skill_id == job.skill_id),
                Worker.status == WorkerStatus.APPROVED,
                Worker.is_approved == True,
                Worker.is_deleted == False
            )
            .options(joinedload(Worker.skills))
            .all()
        )


        worker_list = []
        for worker in workers:
            skills = [s.skill_name for s in worker.skills]

            avg_rating = db.session.query(func.avg(Rating.stars)) \
                .filter_by(receiver_id=worker.worker_id, receiver_type="worker") \
                .scalar() or 0

            review_count = db.session.query(func.count(Rating.rating_id)) \
                .filter_by(receiver_id=worker.worker_id, receiver_type="worker") \
                .scalar()
            def to_float(value):
                return float(value) if isinstance(value, Decimal) else value
            worker_list.append({
                'worker_id': worker.worker_id,
                'name': worker.client.fullname,
                'bio': worker.bio,
                'location': worker.location,
                'hourly_rate': to_float(worker.hourly_rate),
                'rating': to_float(round(avg_rating, 1)),
                'reviews': review_count,
                'skills': skills
            })

        return {'matched_workers': worker_list}, 200

    @staticmethod
    def request_worker(job_id, worker_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404
        if job.status != JobStatus.OPEN:
            return {'error': 'Job is not open for requests'}, 400

        job.worker_id = worker_id
        job.status = JobStatus.REQUESTED
        db.session.commit()

        return {
            'message': 'Worker requested successfully',
            'job': job_output_schema.dump(job)
        }, 200

    @staticmethod
    def accept_job(job_id, worker_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404
        if job.worker_id != worker_id:
            return {'error': 'This worker is not assigned to the job'}, 400

        job.status = JobStatus.IN_PROGRESS
        db.session.commit()

        return {
            'message': 'Job accepted successfully',
            'job': job_output_schema.dump(job)
        }, 200

    @staticmethod
    def reject_job(job_id, worker_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404
        if job.worker_id != worker_id:
            return {'error': 'This worker is not assigned to the job'}, 400

        #unassign the worker from the job and return the job to open status
        job.worker_id = None
        job.status = JobStatus.OPEN
        db.session.commit()

        #an alternative workers list 
        return {
            'message': 'Worker rejected the job. It is now open again.',
            'job': job_output_schema.dump(job)
        }, 200
    
    @staticmethod
    def worker_mark_done(job_id, worker_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404
        if job.worker_id != worker_id:
            return {'error': 'Unauthorized worker'}, 403
        
        job.status = JobStatus.WORKER_COMPLETED
        job.worker_completion_confirmed = True  
        db.session.commit()
        return {
            'message': 'Worker has marked job as complete, waiting for client confirmation',
            'job': job_output_schema.dump(job)
        }, 200


    @staticmethod
    def client_confirm_completion(job_id, client_id):
       job = Job.query.get(job_id)
       if not job:
        return {'error': 'Job not found'}, 404
       if job.client_id != client_id:
        return {'error': 'Unauthorized client'}, 403
       if not job.worker_completion_confirmed:
        return {'error': 'Worker has not marked job complete yet'}, 400

       job.status = JobStatus.COMPLETED
       job.client_completion_confirmed = True
       db.session.commit()

       return {
           'message': 'Job marked as fully completed',
           'job': job_output_schema.dump(job)
       }, 200

    @staticmethod
    def get_client_job_history(client_id):
        jobs = (
            Job.query
            .options(joinedload(Job.skill))
            .filter_by(client_id=client_id)
            .order_by(Job.created_at.desc())
            .all()
        )
        return {
            "message": f"{len(jobs)} jobs found for client",
            "jobs": job_output_many.dump(jobs)
        }, 200

    @staticmethod
    def get_worker_job_history(worker_id):
        jobs = (
            Job.query
            .options(joinedload(Job.skill), joinedload(Job.client)) 
            .filter_by(worker_id=worker_id)
            .order_by(Job.created_at.desc())
            .all()
        )
        return {
            "message": f"{len(jobs)} jobs found for worker",
            "jobs": job_output_many.dump(jobs)
        }, 200

    @staticmethod
    def get_worker_requested_jobs(worker_id):
        jobs = (
            Job.query
            .options(joinedload(Job.skill))
            .filter_by(worker_id=worker_id, status=JobStatus.REQUESTED)
            .order_by(Job.created_at.desc())
            .all()
        )
        return {
            'message': f'{len(jobs)} requested jobs found for worker',
            "jobs": job_output_many.dump(jobs)
            
        }, 200


