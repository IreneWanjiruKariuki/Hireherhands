from marshmallow import Schema, fields, validate

class SignupSchema(Schema):
    fullname = fields.Str(required=True, validate=validate.Length(min=3))
    email = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Length(min=10))
    password = fields.Str(required=True, validate=validate.Length(min=6))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
