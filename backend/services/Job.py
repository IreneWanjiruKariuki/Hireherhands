from models.Job import Job
from models.Worker import Worker
from models.WorkerSkills import WorkerSkill
from models.Skill import Skill
from extensions import db


class JobService:
    @staticmethod
    def create_job(data, client_id):
        skill_id = data.get('skill_id')
        description = data.get('description')
        budget = data.get('budget')
        location = data.get('location')
        scheduled_date = data.get('scheduled_date')
        scheduled_time = data.get('scheduled_time')

        if not all([skill_id, description, budget, location,scheduled_date, scheduled_time]):
            return {'error': 'All fields are required to create a job.'}, 400


        job = Job(
            worker_id=None,  # Initially, no worker is assigned
            client_id=client_id,
            skill_id=skill_id,
            description=description,
            budget=budget,
            location=location,
            scheduled_date=scheduled_date,
            scheduled_time=scheduled_time,
            status='open'
        )
        db.session.add(job)
        db.session.commit()
        return {'message': 'Job created successfully', 'job_id': job.job_id}, 201

    @staticmethod
    def matching_workers(job_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404
        
        #finding the workers with the skill
        matches = Worker.query.join(WorkerSkill).filter(
            WorkerSkill.skill_id == job.skill_id,
            Worker.status == 'available',
            Worker.is_approved == True 
        ).all()

        worker_list= [
            {
                'worker_id': worker.worker_id,
                'bio': worker.bio,
                'location': worker.location,
                'hourly_rate': worker.hourly_rate,
                'rating': worker.rating
            } for worker in matches
        ]
        return {'workers': worker_list}, 200

    @staticmethod
    def request_worker(job_id, worker_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404
        if job.status != 'open':
            return {'error': 'Job is not open for requests'}, 400

        job.worker_id = worker_id
        job.status = 'requested'
        db.session.commit()

        return {'message': 'Worker requested successfully', 'job_id': job.job_id}, 200

    @staticmethod
    def accept_job(job_id, worker_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404
        if job.worker_id != worker_id:
            return {'error': 'This worker is not assigned to the job'}, 400

        job.status = 'in_progress'
        db.session.commit()

        return {'message': 'Job accepted successfully', 'job_id': job.job_id}, 200

    @staticmethod
    def reject_job(job_id, worker_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404
        if job.worker_id != worker_id:
            return {'error': 'This worker is not assigned to the job'}, 400

        #unassign the worker from the job and return the job to open status
        job.worker_id = None
        job.status = 'open'
        db.session.commit()

        #an alternative workers list 
        return JobService.matching_workers(job_id)
    
    @staticmethod
    def worker_mark_done(job_id, worker_id):
        job = Job.query.get(job_id)
        if not job:
            return {'error': 'Job not found'}, 404
        if job.worker_id != worker_id:
            return {'error': 'Unauthorized worker'}, 403

        job.worker_completion_confirmed = True
        db.session.commit()

        return {'message': 'Worker has marked job as complete, waiting for client confirmation'}, 200

    @staticmethod
    def client_confirm_completion(job_id, client_id):
       job = Job.query.get(job_id)
       if not job:
        return {'error': 'Job not found'}, 404
       if job.client_id != client_id:
        return {'error': 'Unauthorized client'}, 403
       if not job.worker_completion_confirmed:
        return {'error': 'Worker has not marked job complete yet'}, 400

       job.client_completion_confirmed = True
       job.status = 'completed'
       db.session.commit()

       return {'message': 'Job marked as fully completed'}, 200


