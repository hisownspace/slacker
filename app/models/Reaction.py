from app.models import db

class Reaction(db.Model):
  __tablename__ = "reactions"
  
  id = db.Column(db.Integer, primary_key=True)
  reaction_url = db.Column(db.String(2000))
  unicode = db.Column(db.String(70))
  emoji = db.Column(db.Boolean, nullable=False)
  description = db.Column(db.String(255), nullable=True)
  group = db.Column(db.String(255))
  subgroup = db.Column(db.String(255))

  def to_dict(self):
    return {
      "id": self.id,
      "reaction_url": self.reaction_url,
      "unicode": self.unicode,
      "emoji": self.emoji,
      "description": self.description,
      "group": self.group,
      "subgroup": self.subgroup
    }

