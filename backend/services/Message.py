from models.Message import Message
from extensions import db

class MessageService:
    @staticmethod
    def send_message(sender_id, sender_type, data):
        message = Message(
            sender_id=sender_id,
            sender_type=sender_type,
            receiver_id=data["receiver_id"],
            receiver_type=data["receiver_type"],
            job_id=data.get("job_id"),
            content=data["content"]
        )
        db.session.add(message)
        db.session.commit()
        return {"message": "Message sent successfully"}, 201

    @staticmethod
    def get_messages_for_job(job_id):
        messages = Message.query.filter_by(job_id=job_id).order_by(Message.timestamp.asc()).all()
        return {
            "job_id": job_id,
            "messages": [
                {
                    "sender_id": m.sender_id,
                    "sender_type": m.sender_type,
                    "receiver_id": m.receiver_id,
                    "receiver_type": m.receiver_type,
                    "content": m.content,
                    "timestamp": m.timestamp.isoformat()
                } for m in messages
            ]
        }, 200
