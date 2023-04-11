from flask.cli import AppGroup
from app.models import db, Message, Reaction, User, SCHEMA, production
from app.seeds.users import seed_users, undo_users
from app.seeds.workspaces import seed_workspaces, undo_workspaces
from app.seeds.channels import seed_channels, undo_channels
from app.seeds.groups import seed_groups, undo_groups
from app.seeds.messages import seed_messages, undo_messages
from app.seeds.reactions import seed_reactions, undo_reactions


seed_commands = AppGroup("seed")

@seed_commands.command("all")
def seed():
  if production:
    undo_groups()
    undo_channels()
    undo_workspaces()
    undo_users()
  users = seed_users()
  workspaces = seed_workspaces(users=users)
  channels = seed_channels(users=users)
  groups = seed_groups(users=users, workspaces=workspaces)
  messages = seed_messages(groups=groups, channels=channels)
  reactions = seed_reactions()
  

@seed_commands.command("undo")
def undo():
  undo_reactions()
  undo_messages()
  undo_groups()
  undo_channels()
  undo_workspaces()
  undo_users()