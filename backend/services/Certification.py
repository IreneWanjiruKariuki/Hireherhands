from models.Certification import Certification
from extensions import db

class CertificationService:
    @staticmethod
    def submit_certification(worker_id, data):
        cert = Certification(
            worker_id=worker_id,
            certification_name=data.get("certification_name"),
            issued_by=data.get("issued_by"),
            issue_date=data.get("issue_date"),
            expiration_date=data.get("expiration_date"),
            status=CertificationStatus.PENDING
        )
        db.session.add(cert)
        db.session.commit()
        return {"message": "Certification submitted successfully"}, 201
