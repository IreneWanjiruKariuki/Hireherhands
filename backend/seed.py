from app import create_app
from extensions import db, bcrypt
from models import Client, Worker, Skill, Job
from models.Job import JobStatus
from models.Worker import WorkerStatus
from datetime import datetime, timedelta
from sqlalchemy import text

app = create_app()

with app.app_context():
    # 🔥 Clear everything in proper order
    db.session.execute(text('DELETE FROM worker_skills'))
    db.session.execute(text('DELETE FROM jobs'))
    db.session.execute(text('DELETE FROM workers'))
    db.session.execute(text('DELETE FROM clients'))
    db.session.execute(text('DELETE FROM skill'))
    db.session.commit()

    # ✅ Shared password
    password = bcrypt.generate_password_hash("123456").decode("utf-8")

    # ✅ Skills
    skills = [
        Skill(skill_name="Plumbing"),
        Skill(skill_name="Electrical"),
        Skill(skill_name="Tailoring"),
        Skill(skill_name="Hairdressing"),
        Skill(skill_name="Housekeeping")
    ]
    db.session.add_all(skills)
    db.session.commit()

    # ✅ Clients
    amina = Client(fullname="Amina Mohamed", email="amina@example.com", phone="0711000001", hashed_password=password)
    nyokabi = Client(fullname="Nyokabi Wanjiku", email="nyokabi@example.com", phone="0711000002", hashed_password=password)
    shiko = Client(fullname="Shiko Mwangi", email="shiko@example.com", phone="0711000003", hashed_password=password)
    wangari = Client(fullname="Wangari Njeri", email="wangari@example.com", phone="0711000004", hashed_password=password)
    atieno = Client(fullname="Atieno Achieng", email="atieno@example.com", phone="0711000005", hashed_password=password)

    clients = [amina, nyokabi, shiko, wangari, atieno]
    db.session.add_all(clients)
    db.session.commit()

    # ✅ Workers
    shiko_worker = Worker(
        client_id=shiko.client_id,
        bio="Expert plumber with 5 years experience.",
        hourly_rate=850.0,
        location="Nairobi",
        status=WorkerStatus.AVAILABLE,
        is_approved=True
    )

    wangari_worker = Worker(
        client_id=wangari.client_id,
        bio="Certified electrician and repair expert.",
        hourly_rate=950.0,
        location="Thika",
        status=WorkerStatus.AVAILABLE,
        is_approved=True
    )

    atieno_worker = Worker(
        client_id=atieno.client_id,
        bio="Experienced tailor and fabric designer.",
        hourly_rate=700.0,
        location="Kisumu",
        status=WorkerStatus.AVAILABLE,
        is_approved=True
    )

    db.session.add_all([shiko_worker, wangari_worker, atieno_worker])
    db.session.commit()

    # ✅ Assign skills after commit (use WorkerSkill for many-to-many)
    
    shiko_worker.skills.append(skills[0])   # Plumbing
    wangari_worker.skills.append(skills[1]) # Electrical
    atieno_worker.skills.append(skills[2])  # Tailoring
    db.session.commit()


    # ✅ Jobs
    job1 = Job(
        client_id=amina.client_id,
        skill_id=skills[0].skill_id,
        description="Fix kitchen sink leak and replace old pipes.",
        budget=3000.0,
        location="Westlands",
        scheduled_date=datetime.today().date() + timedelta(days=2),
        scheduled_time=datetime.strptime("10:00", "%H:%M").time(),
        status=JobStatus.OPEN
    )

    job2 = Job(
        client_id=nyokabi.client_id,
        skill_id=skills[1].skill_id,
        description="Rewire two rooms and install sockets.",
        budget=5000.0,
        location="Kiambu",
        scheduled_date=datetime.today().date() + timedelta(days=3),
        scheduled_time=datetime.strptime("13:00", "%H:%M").time(),
        status=JobStatus.OPEN
    )

    job3 = Job(
        client_id=shiko.client_id,
        skill_id=skills[2].skill_id,
        description="Custom dress stitching for wedding.",
        budget=4000.0,
        location="Nairobi CBD",
        scheduled_date=datetime.today().date() + timedelta(days=5),
        scheduled_time=datetime.strptime("11:30", "%H:%M").time(),
        status=JobStatus.OPEN
    )

    db.session.add_all([job1, job2, job3])
    db.session.commit()

    print("✅ Seed data loaded: 5 clients, 3 workers, 3 jobs, 5 skills")

