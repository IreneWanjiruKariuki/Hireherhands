from models.Certification import Certification
from extensions import db

class AdminCertificationService:
    @staticmethod
    def get_all_certifications():
        certifications = Certification.query.order_by(Certification.created_at.desc()).all()
        return {"certifications": [c.to_dict() for c in certifications]}, 200

    @staticmethod
    def approve_certification(certification_id):
        cert = Certification.query.get(certification_id)
        if not cert:
            return {"error": "Certification not found"}, 404

        cert.status = "approved"
        db.session.commit()
        return {"message": "Certification approved"}, 200

    @staticmethod
    def reject_certification(certification_id):
        cert = Certification.query.get(certification_id)
        if not cert:
            return {"error": "Certification not found"}, 404

        cert.status = "rejected"
        db.session.commit()
        return {"message": "Certification rejected"}, 200
