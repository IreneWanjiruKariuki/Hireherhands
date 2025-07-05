from marshmallow import Schema, fields, validate

class WorkerRegisterSchema(Schema):
    bio = fields.Str(required=True, validate=validate.Length(min=10))
    id_number = fields.Str(required=True, validate=validate.Length(min=5))
    location = fields.Str(required=True)
    hourly_rate = fields.Float(required=True)
    #skills = fields.List(fields.Int(strict=True), required=True)
    skills = fields.List(fields.String())


class WorkerUpdateSchema(Schema):
    bio = fields.Str()
    location = fields.Str()
    hourly_rate = fields.Float()

class WorkerSkillSchema(Schema):
    skills = fields.List(fields.Int(), required=True)
