from sqlalchemy.sql import text
from app.models import db, User, Workspace, production, SCHEMA

def seed_workspaces(**kwargs):
  workspaces = {
  "workspace_1": Workspace(name="App Academy Interal", icon_url = "https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png", owner_id=1),
  "workspace_2" : Workspace(name="App Academy", icon_url="https://d1psgljc389n8q.cloudfront.net/discussions/posts/qHddZMInp", owner_id=1)
  }
  db.session.add(workspaces["workspace_1"])
  db.session.add(workspaces["workspace_2"])
  for user in kwargs["users"].values():
    user.workspaces.append(workspaces["workspace_1"])
    user.workspaces.append(workspaces["workspace_2"])
  db.session.commit()

  return workspaces
  
def undo_workspaces():
  if production:
    db.execute(f"TRUNCATE table {SCHEMA}.workspaces RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM workspaces;"))
    db.session.execute(text("DELETE FROM workspace_members"))
  db.session.commit()
