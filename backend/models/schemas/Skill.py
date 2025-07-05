# models/schemas/Skill.py
from marshmallow import Schema, fields

class SkillOutputSchema(Schema):
    skill_id = fields.Int()
    skill_name = fields.Str()
