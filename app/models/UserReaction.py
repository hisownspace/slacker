from app.models import db


class UserReaction(db.Model):
  __tablename__ = "user_reactions"
  
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
  reaction_id = db.Column(db.String(255), db.ForeignKey("reactions.id"), nullable=False)
  message_id = db.Column(db.Integer, db.ForeignKey("messages.id"), nullable=True)
  # group_message_id = db.Column(db.Integer, db. ForeignKey("group_messages.id"), nullable=True)

  # relationships
  message = db.relationship("Message", overlaps="message_reactions,user_reactions", back_populates="reactions")
  user = db.relationship("User", overlaps="message_reactions,user_reactions", back_populates="reactions")
  reaction = db.relationship("Reaction")

  def to_dict(self):
    return {
      "id": self.id,
      "user_id": self.user_id,
      "reaction_id": self.reaction_id,
      "message_id": self.message_id,
    }