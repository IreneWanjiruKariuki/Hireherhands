from marshmallow import Schema, fields, validate

class ClientUpdateSchema(Schema):
    fullname = fields.Str(required=True, validate=validate.Length(min=3))
    email = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Length(min=10))
