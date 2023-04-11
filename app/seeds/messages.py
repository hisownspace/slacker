from random import choice
from sqlalchemy.sql import text
from app.models import db, Message, production, SCHEMA

def seed_messages(**kwargs):
  messages = {
    "message_1": Message(content="Yo yo"),
    "message_2": Message(content="what up"),
    "message_3": Message(content="Yo"),
    "message_4": Message(content="Howzit"),
    "message_5": Message(content="wassup"),
    "message_6": Message(content="Hi"),
    "message_7": Message(content="Hello"),
    "message_8": Message(content="what's crackin"),
    "message_9": Message(content="sup"),
    "message_10": Message(content="hey"),
    "message_11": Message(content="sup foo"),
    "message_12": Message(content="Howdy"),
    "message_13": Message(content="hola"),
    "message_14": Message(content="what the deal"),
  }
  
  groups = list(kwargs["groups"].values())
  # users = kwargs["users"]
  
  for message in messages.values():
    group = choice(groups)
    message.group = group
    members = group.members
    message.user = choice(members)
    db.session.add(message)
    
  db.session.commit()

  return messages
  
def undo_messages():
  if production:
    db.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM messages;"))
    # db.session.execute(text("DELETE FROM user_reactions;"))
  
  db.session.commit()
  