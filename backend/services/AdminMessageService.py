from models.Message import Message
from extensions import db

class AdminMessageService:
    @staticmethod
    def get_all_messages():
        messages = Message.query.order_by(Message.timestamp.desc()).all()
        return {"messages": [m.to_dict() for m in messages]}, 200

    @staticmethod
    def delete_message(message_id):
        message = Message.query.get(message_id)
        if not message:
            return {"error": "Message not found"}, 404
        db.session.delete(message)
        db.session.commit()
        return {"message": "Message deleted"}, 200
