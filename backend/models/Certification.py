from extensions import db
from sqlalchemy_serializer import SerializerMixin
import enum

class CertificationStatus(enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class Certification(db.Model, SerializerMixin):
    __tablename__ = 'certifications'

    certification_id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.worker_id'), nullable=False)

    certification_name = db.Column(db.String(100), nullable=False)
    issued_by = db.Column(db.String(100), nullable=False)
    issue_date = db.Column(db.Date, nullable=False)
    expiration_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.Enum(CertificationStatus), default=CertificationStatus.PENDING)

    verified_by_admin_id = db.Column(db.Integer, db.ForeignKey('admins.admin_id'), nullable=True)
    verified_at = db.Column(db.DateTime)

    #relationships
    worker = db.relationship("Worker", back_populates="certifications")
    admin = db.relationship("Admin", backref="verified_certifications")


    def __repr__(self):
        return f'<Certification {self.certification_name} for Worker {self.worker_id}>'