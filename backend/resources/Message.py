from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from marshmallow import ValidationError
from services.Message import MessageService
from models.schemas.MessageSchema import MessageCreateSchema

message_schema = MessageCreateSchema()

class MessageListResource(Resource):
    @jwt_required()
    def post(self):
        claims = get_jwt()
        try:
            data = message_schema.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400

        sender_id = claims.get("client_id") or claims.get("worker_id")
        sender_type = claims.get("role")  # should be 'client' or 'worker'

        return MessageService.send_message(sender_id, sender_type, data)

class JobMessagesResource(Resource):
    @jwt_required()
    def get(self, job_id):
        return MessageService.get_messages_for_job(job_id)
