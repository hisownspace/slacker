from app.models import db

group_members = db.Table(
  "group_members",
  db.Column("member_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
  db.Column("group_id", db.Integer, db.ForeignKey("groups.id"), primary_key=True)
)


class Group(db.Model):
  __tablename__ = "groups"
  
  id = db.Column(db.Integer, primary_key=True)
  workspace_id = db.Column(db.Integer, db.ForeignKey("workspaces.id"))
  
  members = db.relationship("User", secondary="group_members", back_populates="groups")
  messages = db.relationship("Message", back_populates="group")
  workspace = db.relationship("Workspace", back_populates="groups")

  def to_dict(self):
    return {
      "id": self.id,
      "workspace_id": self.workspace_id,
      "members": [member.id for member in self.members],
      "messages": [message.id for message in self.messages]
    }