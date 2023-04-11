from app.models import db

channel_members = db.Table(
  "channel_members",
  db.Column("member_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
  db.Column("channel_id", db.Integer, db.ForeignKey("channels.id"), primary_key=True)
)

channel_mods = db.Table(
  "channel_mods",
  db.Column("mod_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
  db.Column("channel_id", db.Integer, db.ForeignKey("channels.id"), primary_key=True)
)

class Channel(db.Model):
  __tablename__ = "channels"
  
  id = db.Column(db.Integer, primary_key=True)
  owner_id = db.Column(db.Integer, db.ForeignKey("users.id"))
  workspace_id = db.Column(db.Integer, db.ForeignKey("workspaces.id"))
  name = db.Column(db.String(255), nullable=False)
  description = db.Column(db.String(2000), nullable=True)
  protected = db.Column(db.Boolean)
  
  # relationships
  owner = db.relationship("User", back_populates="owned_channels")
  members = db.relationship("User", secondary=channel_members, back_populates="channels", cascade="all, delete")
  moderators = db.relationship("User", secondary="channel_mods", back_populates="moderated_channels")
  messages = db.relationship("Message", back_populates="channel")
  workspace = db.relationship("Workspace", back_populates="channels")