from app.models import db


class ReactionGroup(db.Model):
    __tablename__ = "reaction_groups"

    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(255), nullable=False)


class ReactionSubgroup(db.Model):
    __tablename__ = "reaction_subgroups"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("reaction_groups.id"))
    subgroup_name = db.Column(db.String(255), nullable=False)

    group = db.relationship("ReactionGroup", backref="subgroups")


class Reaction(db.Model):
  __tablename__ = "reactions"
  
  id = db.Column(db.Integer, primary_key=True)
  reaction_url = db.Column(db.String(2000))
  unicode = db.Column(db.String(70))
  emoji = db.Column(db.Boolean, nullable=False)
  description = db.Column(db.String(255), nullable=True)
  subgroup_id = db.Column(db.Integer, db.ForeignKey("reaction_subgroups.id"))
  # group_id = db.Column(db.Integer, db.ForeignKey("groups.id"))

  subgroup = db.relationship("ReactionSubgroup", backref="reactions")

  def to_dict(self):
    return {
      "id": self.id,
      "reaction_url": self.reaction_url,
      "unicode": self.unicode,
      "emoji": self.emoji,
      "description": self.description,
      "group": self.subgroup.group.group_name,
      "subgroup": self.subgroup.subgroup_name
    }

