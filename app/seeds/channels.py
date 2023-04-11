from sqlalchemy.sql import text
from app.models import db, Channel, production, SCHEMA

def seed_channels(**kwargs):
  channels = {
    "channel_1": Channel(name="general", owner_id=1, workspace_id=1, description="A Welcome the general channel!", protected=False),
    "channel_2": Channel(name="random", owner_id=1, workspace_id=1, description="This is the random channel", protected=False),
    "channel_3": Channel(name="Badmouth Management", workspace_id=1, owner_id=1, description="This is where you can talk shit about management." ,protected=True),
    "channel_4": Channel(name="general", owner_id=1, workspace_id=2, description="A Welcome the general channel!", protected=False),
    "channel_5": Channel(name="random", owner_id=1, workspace_id=2, description="This is the random channel", protected=False),
    "channel_6": Channel(name="Badmouth Management", workspace_id=2, owner_id=1, description="This is where you can talk shit about management." ,protected=True),
  }
  
  for channel in channels.values():
    db.session.add(channel)
    for user in kwargs["users"].values():
      user.channels.append(channel)
      
  db.session.commit()
  return channels
  
def undo_channels():
  if production:
    db.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM channels;"))
    db.session.execute(text("DELETE FROM channel_members;"))
  
  db.session.commit()