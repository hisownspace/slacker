from sqlalchemy.sql import text
from app.models import db, Reaction, production, SCHEMA


def seed_reactions(**kwargs):
  reactions = []

  with open("/Users/david/Teach/sandbox/slack_clone/app/seeds/emoji-test.txt", encoding="utf-8") as f:
    lines = f.readlines()
    group = None
    subgroup = None
    unicode = None
    description = None
    for line in lines:
      if line.startswith("# group"):
        group = line.split(": ")[-1][:-1]
      if line.startswith("# subgroup"):
        subgroup = line.split(": ")[-1][:-1]
      if not line.startswith("#") and line != "\n" and line != "":
        description = ' '.join(line.split("#")[-1][:-1].split(" ")[3:])
        data_string = ' '.join(line.split("#")[-1][:-1].split(" "))
        if len(data_string) > 1:
          unicode = data_string.split("E")[0]
        if unicode and description and group and subgroup:
          reaction = {
                        "unicode": unicode,
                        "description": description,
                        "group": group,
                        "subgroup": subgroup,
                        "emoji": True
                      }
          reaction_object = Reaction(**reaction)
          db.session.add(reaction_object)
          reactions.append(reaction_object)
    db.session.commit()
    
  return reactions


def undo_reactions():
  if production:
    db.execute(f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM reactions;"))
  
  db.session.commit()
  