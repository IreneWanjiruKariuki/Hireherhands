from models.Certification import Certification
from extensions import db

class CertificationService:
    @staticmethod
    def submit_certification(worker_id, data):
        cert = Certification(
            worker_id=worker_id,
            name=data.get("name"),
            description=data.get("description"),
            status="pending"
        )
        db.session.add(cert)
        db.session.commit()
        return {"message": "Certification submitted successfully"}, 201
