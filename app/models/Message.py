from app.models import db

messengers = db.Table(
  "messengers",
  db.Column("message_id", db.Integer, db.ForeignKey("messages.id"), primary_key=True),
  db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True)
)


class Message(db.Model):
  __tablename__ = "messages"
  
  id = db.Column(db.Integer, primary_key=True)
  channel_id = db.Column(db.Integer, db.ForeignKey("channels.id"), nullable=True)
  group_id = db.Column(db.Integer, db.ForeignKey("groups.id"), nullable=True)
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
  content = db.Column(db.String(2000), nullable=False)

  # relationships
  channel = db.relationship("Channel", back_populates="messages")
  group = db.relationship("Group", back_populates="messages")
  user = db.relationship("User",secondary="messengers", back_populates="messages")
  files = db.relationship("File", back_populates="message")

  user_reactions = db.relationship("User", secondary="user_reactions", overlaps="reactions,user_reactions", back_populates="message_reactions")
  
  reactions = db.relationship("UserReaction", overlaps="message_reactions,user_reactions", back_populates="message")