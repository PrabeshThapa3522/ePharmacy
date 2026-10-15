from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


users = [
    {
        "full_name": "Anjan Khadka",
        "email": "anjan@gmail.com",
        "password": "Anjan@7835",
        "phone": "9800000001",
        "role": "customer",
    },
    {
        "full_name": "Prabesh Thapa",
        "email": "prabesh@gmail.com",
        "password": "Prabesh@7835",
        "phone": "9800000002",
        "role": "staff",
    },
    {
        "full_name": "Bishwas Pandit",
        "email": "bishwas@gmail.com",
        "password": "Bishwas@7835",
        "phone": "9800000003",
        "role": "pharmacist",
    },
]


def seed_users():
    db = SessionLocal()

    try:
        for user_data in users:
            existing_user = (
                db.query(User)
                .filter(User.email == user_data["email"])
                .first()
            )

            if existing_user:
                print(
                    f"User already exists: {user_data['email']}"
                )
                continue

            new_user = User(
                full_name=user_data["full_name"],
                email=user_data["email"],
                hashed_password=hash_password(
                    user_data["password"]
                ),
                phone=user_data["phone"],
                role=user_data["role"],
            )

            db.add(new_user)

        db.commit()

        print("Users seeded successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_users()