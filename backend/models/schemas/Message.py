from marshmallow import Schema, fields, validate

class MessageCreateSchema(Schema):
    receiver_id = fields.Int(required=True)
    receiver_type = fields.Str(required=True, validate=validate.OneOf(["client", "worker"]))
    job_id = fields.Int(required=False)
    content = fields.Str(required=True, validate=validate.Length(min=1))
