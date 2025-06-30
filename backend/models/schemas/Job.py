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
    category = fields.Str()
    duration = fields.Str()


class JobOutputSchema(Schema):
    job_id = fields.Int()
    client_id = fields.Int()
    worker_id = fields.Int(allow_none=True)
    skill_id = fields.Int()
    skill = fields.Nested(SkillOutputSchema)
    description = fields.Str()
    budget = fields.Float()
    location = fields.Str()
    scheduled_date = fields.Date()
    scheduled_time = fields.Time()
    status = fields.Method("get_status")
    created_at = fields.DateTime()

    def get_status(self, obj):
        # Ensures frontend gets a plain string like "open"
        return obj.status.value if isinstance(obj.status, JobStatus) else str(obj.status)
