from app.models import db

workspace_members = db.Table(
  "workspace_members",
  db.Column("member_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
  db.Column("workspace_id", db.Integer, db.ForeignKey("workspaces.id"), primary_key=True)
)


class Workspace(db.Model):
  __tablename__ = "workspaces"
  
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(255), nullable=False)
  icon_url = db.Column(db.String(2000), nullable=False)
  owner_id = db.Column(db.Integer, db.ForeignKey("users.id"))
  
  # relationships
  channels = db.relationship("Channel", back_populates="workspace")
  groups = db.relationship("Group", back_populates="workspace")
  members = db.relationship("User", secondary="workspace_members", back_populates="workspaces", cascade="all, delete")
  owner = db.relationship("User", back_populates="workspaces_owned")
  