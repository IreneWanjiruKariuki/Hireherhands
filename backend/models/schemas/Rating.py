from marshmallow import Schema, fields, validate

class RatingSchema(Schema):
    receiver_id = fields.Int(required=True)
    receiver_type = fields.Str(required=True, validate=validate.OneOf(["client", "worker"]))
    stars = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    feedback = fields.Str(required=False)
