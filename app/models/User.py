from app.models import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(db.Model, UserMixin):
  __tablename__ = "users"
  
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(255), nullable=False)
  email = db.Column(db.String(50), nullable=False)
  hashed_password = db.Column(db.String(255), nullable=False)

  @property
  def password(self):
      return self.hashed_password

  @password.setter
  def password(self, password):
      self.hashed_password = generate_password_hash(password)

  def check_password(self, password):
      return check_password_hash(self.password, password)
  
  channels = db.relationship("Channel", secondary="channel_members", back_populates="members", cascade="all, delete")
  message_reactions = db.relationship("Message", secondary="user_reactions", back_populates="user_reactions")
  reactions = db.relationship("UserReaction", overlaps="message_reactions", back_populates="user")
  messages = db.relationship("Message", secondary="messengers", back_populates="user")
  owned_channels = db.relationship("Channel", back_populates="owner")
  groups = db.relationship("Group", secondary="group_members", back_populates="members")
  workspaces = db.relationship("Workspace", secondary="workspace_members",back_populates="members")
  moderated_channels = db.relationship("Channel", secondary="channel_mods", back_populates="moderators")
  workspaces_owned = db.relationship("Workspace", back_populates="owner")
  
  def to_dict(self):
      return {
          "id": self.id,
          "username": self.username,
          "email": self.email,
          "workspaces": [workspace.id for workspace in self.workspaces],
          "channels": [channel.id for channel in self.channels],
          "groups": [group.id for group in self.groups]
      }