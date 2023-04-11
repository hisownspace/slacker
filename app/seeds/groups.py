from sqlalchemy.sql import text
from app.models import db, User, Group, production, SCHEMA

def seed_groups(**kwargs):
  groups = {
    "group_1": Group(),
    "group_2": Group(),
    "group_3": Group(),
    "group_4": Group(),
    "group_5": Group(),
    "group_6": Group(),
  }
  
  groups["group_1"].members.extend([kwargs["users"]["admin"], kwargs["users"]["demo"]])
  groups["group_2"].members.extend([kwargs["users"]["admin"], kwargs["users"]["demo"], kwargs["users"]["marnie"]])
  groups["group_3"].members.extend([kwargs["users"]["demo"], kwargs["users"]["marnie"]])
  groups["group_4"].members.extend([kwargs["users"]["bobbie"], kwargs["users"]["marnie"]])
  groups["group_5"].members.extend([kwargs["users"]["bobbie"], kwargs["users"]["demo"]])
  groups["group_6"].members.extend([user for user in kwargs["users"].values()])

  for idx, group in enumerate(groups.values()):
    group.workspace = kwargs["workspaces"][f"workspace_{(idx % 2) + 1}"]
    db.session.add(group)
  db.session.commit()
  
  return groups
  

def undo_groups():
  if production:
    db.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM groups;"))
    db.session.execute(text("DELETE FROM group_members;"))
  
  db.session.commit()
