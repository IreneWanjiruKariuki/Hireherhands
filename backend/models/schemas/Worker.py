from marshmallow import Schema, fields, validate

class WorkerRegisterSchema(Schema):
    bio = fields.Str(required=True, validate=validate.Length(min=10))
    location = fields.Str(required=True)
    hourly_rate = fields.Float(required=True)

class WorkerUpdateSchema(Schema):
    bio = fields.Str()
    location = fields.Str()
    hourly_rate = fields.Float()

class WorkerSkillSchema(Schema):
    skills = fields.List(fields.Int(), required=True)
