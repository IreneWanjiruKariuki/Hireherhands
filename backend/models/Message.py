#polymorphic design since worker can message client and vice versa
#admin can oversee all messages but it not an active participant in the conversation

from extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    message_id = db.Column(db.Integer, primary_key=True)

    sender_id = db.Column(db.Integer, nullable=False)
    sender_type = db.Column(db.String(50), nullable=False)  # 'client' or 'worker'

    receiver_id = db.Column(db.Integer, nullable=False)
    receiver_type = db.Column(db.String(50), nullable=False)  # 'client' or 'worker'

    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), nullable=True)

    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Message {self.message_id}: {self.sender_type}:{self.sender_id} -> {self.receiver_type}:{self.receiver_id}>'