from datetime import datetime
from app.models import db


class UserReaction(db.Model):
  __tablename__ = "user_reactions"
  
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
  reaction_id = db.Column(db.Integer, db.ForeignKey("reactions.id"),
                          nullable=False, primary_key=True)
  message_id = db.Column(db.Integer, db.ForeignKey("messages.id"),
                         nullable=True, primary_key=True)
  created_at = db.Column(db.DateTime, default=datetime.now)
  

  __tableargs__ = db.UniqueConstraint('user_id', 'reaction_id', 'message_id')
  # group_message_id = db.Column(db.Integer, db. ForeignKey("group_messages.id"), nullable=True)

  # relationships
  message = db.relationship("Message", overlaps="message_reactions,user_reactions", back_populates="reactions")
  user = db.relationship("User", overlaps="message_reactions,user_reactions", back_populates="reactions")
  reaction = db.relationship("Reaction")

  def to_dict(self):
    return {
      "user_id": self.user_id,
      "reaction_id": self.reaction_id,
      "message_id": self.message_id,
      "reaction": self.reaction.unicode,
      "created_at": self.created_at.isoformat()
    }
