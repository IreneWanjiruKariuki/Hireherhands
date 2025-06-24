from marshmallow import Schema, fields, validate

class CertificationCreateSchema(Schema):
    certification_name = fields.Str(required=True, validate=validate.Length(min=3))
    issued_by = fields.Str(required=True)
    issue_date = fields.Date(required=True)
    expiration_date = fields.Date(required=False)
