from app import create_app
from extensions import db, bcrypt
from models import Client, Worker, Skill, Job
from models.Job import JobStatus
from models.Worker import WorkerStatus
from datetime import datetime, timedelta
from sqlalchemy import text
from random import choice

app = create_app()

nairobi_locations = [
    "Westlands", "Kilimani", "Lang'ata", "South B", "Embakasi", "Donholm",
    "Karen", "Kasarani", "Lavington", "Ngong Road", "Roysambu", "Ruaka",
    "Pipeline", "Umoja", "Gikambura", "Parklands", "Mountain View", "Zimmerman"
]

with app.app_context():
    print("Resetting database...")
    db.session.execute(text('DELETE FROM ratings'))
    db.session.execute(text('DELETE FROM messages'))
    db.session.execute(text('DELETE FROM worker_skills'))
    db.session.execute(text('DELETE FROM jobs'))
    db.session.execute(text('DELETE FROM workers'))
    db.session.execute(text('DELETE FROM clients'))
    db.session.execute(text('DELETE FROM skill'))
    db.session.commit()

    password = bcrypt.generate_password_hash("user@1").decode("utf-8")

    # ---------------------------
    # Skills
    # ---------------------------
    skills = [
        Skill(skill_name="Plumbing"),
        Skill(skill_name="Electrical Repairs"),
        Skill(skill_name="Wall Painting"),
        Skill(skill_name="Furniture Assembly"),
        Skill(skill_name="Tile Installation"),
        Skill(skill_name="Wallpaper Application"),
        Skill(skill_name="Mounting"),
        Skill(skill_name="Roof Patching"),
        Skill(skill_name="Grouting"),
        Skill(skill_name="Basic Carpentry")
    ]
    db.session.add_all(skills)
    db.session.commit()

    # ---------------------------
    # Clients
    # ---------------------------

    # Female clients
    amina = Client(
        fullname="Amina Mohamed",
        email="amina@example.com",
        phone="0711000001",
        gender="female",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=50)
    )
    nyokabi = Client(
        fullname="Nyokabi Wanjiku",
        email="nyokabi@example.com",
        phone="0711000002",
        gender="female",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=40)
    )
    shiko = Client(
        fullname="Shiko Mwangi",
        email="shiko@example.com",
        phone="0711000003",
        gender="female",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=35)
    )
    wangari = Client(
        fullname="Wangari Njeri",
        email="wangari@example.com",
        phone="0711000004",
        gender="female",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=20)
    )
    atieno = Client(
        fullname="Atieno Achieng",
        email="atieno@example.com",
        phone="0711000005",
        gender="female",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=10)
    )
    nafula = Client(
        fullname="Nafula Chebet",
        email="nafula@example.com",
        phone="0711000006",
        gender="female",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=12)
    )
    asha = Client(
        fullname="Asha Abdi",
        email="asha@example.com",
        phone="0711000007",
        gender="female",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=5)
    )

    # Male clients (not workers)
    peter = Client(
        fullname="Peter Otieno",
        email="peter@example.com",
        phone="0711000008",
        gender="male",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=18)
    )
    john = Client(
        fullname="John Mwangi",
        email="john@example.com",
        phone="0711000009",
        gender="male",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=8)
    )
    brian = Client(
        fullname="Brian Mboya",
        email="brian@example.com",
        phone="0711000010",
        gender="male",
        hashed_password=password,
        created_at=datetime.utcnow() - timedelta(days=3)
    )

    db.session.add_all([
        amina, nyokabi, shiko, wangari, atieno,
        nafula, asha, peter, john, brian
    ])
    db.session.commit()

    # ---------------------------
    # Approved Workers
    # ---------------------------

    approved_workers = [
        shiko_worker := Worker(
            client_id=shiko.client_id,
            bio="Expert plumber and tile installer.",
            id_number=f"ID-{shiko.client_id}",
            hourly_rate=850.0,
            location=choice(nairobi_locations),
            status=WorkerStatus.AVAILABLE,
            is_approved=True,
            experience_years=5,
            is_verified=True,
            created_at=datetime.utcnow() - timedelta(days=30)
        )
        shiko_worker.skills.extend([skills[0], skills[4]])  # Plumbing, Tile Installation
        #db.session.add(shiko_worker)
        wangari_worker := Worker(
            client_id=wangari.client_id,
            bio="Licensed electrician and furniture assembler.",
            id_number=f"ID-{wangari.client_id}",
            hourly_rate=950.0,
            location=choice(nairobi_locations),
            status=WorkerStatus.BUSY,
            is_approved=True,
            experience_years=7,
            is_verified=True,
            created_at=datetime.utcnow() - timedelta(days=20)
        )
        wangari_worker.skills.extend([skills[1], skills[3]])  # Electrical Repairs, Furniture Assembly
        #db.session.add(wangari_worker)

        atieno_worker := Worker(
            client_id=atieno.client_id,
            bio="Experienced painter and wallpaper pro.",
            id_number=f"ID-{atieno.client_id}",
            hourly_rate=700.0,
            location=choice(nairobi_locations),
            status=WorkerStatus.AVAILABLE,
            is_approved=True,
            experience_years=4,
            is_verified=False,
            created_at=datetime.utcnow() - timedelta(days=10)
        )
        atieno_worker.skills.extend([skills[2], skills[5]]) 
    ] 
        #db.session.add(atieno_worker)
    approved_workers = [shiko_worker, wangari_worker, atieno_worker]
    db.session.add_all(approved_workers)
    db.session.commit()

    # Assign skills
    approved_workers[0].skills.extend([skills[0], skills[4]])  # Plumbing, Tile Installation
    approved_workers[1].skills.extend([skills[1], skills[3]])  # Electrical Repairs, Furniture Assembly
    approved_workers[2].skills.extend([skills[2], skills[5]])  # Wall Painting, Wallpaper Application
    db.session.commit()

    # ---------------------------
    # Jobs
    # ---------------------------

    jobs = [
        Job(
            client_id=amina.client_id,
            skill_id=skills[0].skill_id,
            skill_name=skills[0].skill_name,
            description="Fix leaking toilet and kitchen tap.",
            budget=2500,
            location=choice(nairobi_locations),
            road="Waiyaki Way",
            building_name="Westpoint Plaza",
            house_number="A12",
            scheduled_date=datetime.today().date() + timedelta(days=2),
            scheduled_time=datetime.strptime("10:00", "%H:%M").time(),
            status=JobStatus.OPEN,
            duration="1 hour",
            created_at=datetime.utcnow() - timedelta(days=25)
        ),
        Job(
            client_id=amina.client_id,
            skill_id=skills[1].skill_id,
            skill_name=skills[1].skill_name,
            description="Replace faulty sockets in living room.",
            budget=3000,
            location=choice(nairobi_locations),
            road="Mombasa Road",
            building_name="Capital Center",
            house_number="Suite 204",
            scheduled_date=datetime.today().date() + timedelta(days=3),
            scheduled_time=datetime.strptime("14:00", "%H:%M").time(),
            status=JobStatus.REQUESTED,
            worker_id=approved_workers[1].worker_id,
            assigned_at=datetime.utcnow() - timedelta(days=2),
            duration="2 hours",
            created_at=datetime.utcnow() - timedelta(days=18)
        ),
        Job(
            client_id=nyokabi.client_id,
            skill_id=skills[4].skill_id,
            skill_name=skills[4].skill_name,
            description="Lay tiles in kitchen (small space).",
            budget=5000,
            location=choice(nairobi_locations),
            road="Langata Road",
            building_name=None,
            house_number=None,
            scheduled_date=datetime.today().date() + timedelta(days=1),
            scheduled_time=datetime.strptime("09:00", "%H:%M").time(),
            status=JobStatus.IN_PROGRESS,
            worker_id=approved_workers[0].worker_id,
            assigned_at=datetime.utcnow() - timedelta(days=5),
            duration="3 hours",
            created_at=datetime.utcnow() - timedelta(days=8)
        ),
        Job(
            client_id=nyokabi.client_id,
            skill_id=skills[2].skill_id,
            skill_name=skills[2].skill_name,
            description="Paint bedroom walls light blue.",
            budget=4000,
            location=choice(nairobi_locations),
            road="Outer Ring Road",
            building_name="Donholm Court",
            house_number="Block B2",
            scheduled_date=datetime.today().date() - timedelta(days=1),
            scheduled_time=datetime.strptime("11:00", "%H:%M").time(),
            status=JobStatus.COMPLETED,
            worker_id=approved_workers[2].worker_id,
            assigned_at=datetime.utcnow() - timedelta(days=20),
            completed_at=datetime.utcnow() - timedelta(days=15),
            duration="4 hours",
            created_at=datetime.utcnow() - timedelta(days=30)
        ),
        Job(
            client_id=nafula.client_id,
            skill_id=skills[6].skill_id,
            skill_name=skills[6].skill_name,
            description="Mount a TV and a few shelves.",
            budget=2000,
            location=choice(nairobi_locations),
            road="Ngong Road",
            building_name=None,
            house_number=None,
            scheduled_date=datetime.today().date() + timedelta(days=2),
            scheduled_time=datetime.strptime("16:00", "%H:%M").time(),
            status=JobStatus.OPEN,
            duration="2 hours",
            created_at=datetime.utcnow() - timedelta(days=3)
        ),
        Job(
            client_id=asha.client_id,
            skill_id=skills[3].skill_id,
            skill_name=skills[3].skill_name,
            description="Assemble 2 IKEA wardrobes.",
            budget=4500,
            location=choice(nairobi_locations),
            road="Moi Avenue",
            building_name="Mombasa Trade Center",
            house_number="Floor 5",
            scheduled_date=datetime.today().date() + timedelta(days=1),
            scheduled_time=datetime.strptime("12:00", "%H:%M").time(),
            status=JobStatus.REQUESTED,
            worker_id=approved_workers[1].worker_id,
            assigned_at=datetime.utcnow() - timedelta(days=1),
            duration="3 hours",
            created_at=datetime.utcnow() - timedelta(days=4)
        )
    ]
    db.session.add_all(jobs)
    db.session.commit()

    # ---------------------------
    # Pending Worker Applications
    # ---------------------------

    pending_workers = [
        Worker(
            client_id=amina.client_id,
            bio="Skilled in carpentry and tile replacement.",
            id_number=f"ID-{amina.client_id}",
            hourly_rate=800.0,
            location=choice(nairobi_locations),
            status=WorkerStatus.OFFLINE,
            is_approved=False,
            experience_years=2,
            is_verified=False,
            created_at=datetime.utcnow() - timedelta(days=5)
        ),
        Worker(
            client_id=nyokabi.client_id,
            bio="Painting and roof patching expert.",
            id_number=f"ID-{nyokabi.client_id}",
            hourly_rate=750.0,
            location=choice(nairobi_locations),
            status=WorkerStatus.AVAILABLE,
            is_approved=False,
            experience_years=3,
            is_verified=False,
            created_at=datetime.utcnow() - timedelta(days=3)
        )
    ]
    db.session.add_all(pending_workers)
    db.session.commit()

    print("✅ Seed complete:")
    print(f"- {Client.query.count()} clients (including male clients)")
    print(f"- {Worker.query.count()} workers (approved and pending)")
    print(f"- {Job.query.count()} jobs created")
    print(f"- {Skill.query.count()} skills seeded")
