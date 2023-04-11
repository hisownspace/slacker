from sqlalchemy.sql import text
from app.models import db, User, production, SCHEMA

def seed_users(**kwargs):
    users = {
    "admin": User(
      username="admin",
      email="dnash@appacademy.io",
      password="admin123"),
    "demo": User(
        username='Demo', email='demo@aa.io', password='password'),
    "marnie": User(
        username='marnie', email='marnie@aa.io', password='password'),
    "bobbie": User(
        username='bobbie', email='bobbie@aa.io', password='password')
    }

    for user in users.values():
      db.session.add(user)

    db.session.commit()

    return users

def undo_users():
  if production:
    db.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM users;"))
  
  db.session.commit()