from marshmallow import Schema, fields, validate
from models.Job import JobStatus
from models.schemas.Skill import SkillOutputSchema
from datetime import date, time

class JobCreateSchema(Schema):
    skill_id = fields.Int(required=True)
    description = fields.Str(required=True, validate=validate.Length(min=10))
    budget = fields.Float(required=True)
    location = fields.Str(required=True)
    scheduled_date = fields.Date(required=True)
    scheduled_time = fields.Time(required=True)
    duration = fields.Str(required=False)

class JobOutputSchema(Schema):
    job_id = fields.Int()
    client_id = fields.Int()
    worker_id = fields.Int(allow_none=True)
    worker_name = fields.Method("get_worker_name")
    skill_id = fields.Int()
    skill = fields.Nested(SkillOutputSchema)
    description = fields.Str()
    budget = fields.Float()
    duration = fields.Str()
    location = fields.Str()
    scheduled_date = fields.Date()
    scheduled_time = fields.Time()
    status = fields.Method("get_status", deserialize="load_status")
    created_at = fields.DateTime()
    worker_completion_confirmed = fields.Boolean()
    client_completion_confirmed = fields.Boolean()

    def get_worker_name(self, obj):
        return obj.worker.client.fullname if obj.worker and obj.worker.client else None

    def get_status(self, obj):
        # Ensures frontend gets a plain string like "open"
        return obj.status.value if isinstance(obj.status, JobStatus) else str(obj.status)
    def load_status(self, value):
        try:
            return JobStatus(value.lower())
        except ValueError:
            raise ValidationError(f"Invalid status: {value}")
    def format_scheduled_time(self, obj):
        if obj.scheduled_time:
            return obj.scheduled_time.strftime('%H:%M')
        return None

    def get_worker_info(self, obj):
        if obj.worker:
            return {
                "worker_id": obj.worker.worker_id,
                "name": obj.worker.client.fullname if obj.worker.client else None
            }
        return None

