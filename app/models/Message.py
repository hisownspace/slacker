from datetime import datetime
from app.models import db

to_ordinal = {
    "1": "st",
    "2": "nd",
    "3": "rd",
    "4": "th",
    "5": "th",
    "6": "th",
    "7": "th",
    "8": "th",
    "9": "th",
    "10": "th",
    "11": "th",
    "12": "th",
    "13": "th",
    "14": "th",
    "15": "th",
    "16": "th",
    "17": "th",
    "18": "th",
    "19": "th",
    "20": "th",
    "21": "st",
    "22": "nd",
    "23": "rd",
    "24": "th",
    "25": "th",
    "26": "th",
    "27": "th",
    "28": "th",
    "29": "th",
    "30": "th",
    "31": "st",
}

messengers = db.Table(
    "messengers",
    db.Column("message_id", db.Integer, db.ForeignKey("messages.id"), primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
)


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channels.id"), nullable=True)
    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    content = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    # relationships
    channel = db.relationship("Channel", back_populates="messages")
    group = db.relationship("Group", back_populates="messages")
    user = db.relationship("User", back_populates="messages")
    files = db.relationship("File", back_populates="message")

    user_reactions = db.relationship(
        "User",
        secondary="user_reactions",
        overlaps="reactions,user_reactions",
        back_populates="message_reactions",
        cascade="all, delete-orphan",
        viewonly=True
    )

    reactions = db.relationship(
        "UserReaction",
        overlaps="message_reactions,user_reactions",
        back_populates="message",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        reactions = {}
        for reaction in self.reactions:
            if reaction.reaction_id in reactions:
                reactions[reaction.reaction_id]["quantity"] += 1
                reactions[reaction.reaction_id]["user_ids"].append(reaction.user_id)
            else:
                reactions[reaction.reaction_id] = reaction.to_dict()
                reactions[reaction.reaction_id]["quantity"] = 1
                reactions[reaction.reaction_id]["user_ids"] = [reaction.user_id]
                del reactions[reaction.reaction_id]["user_id"]

        return {
            "id": self.id,
            "channel_id": self.channel_id,
            "group_id": self.group_id,
            "user_id": self.user_id,
            "content": self.content,
            "files": [file.id for file in self.files],
            "reactions": reactions,
            "user": self.user.username,
            "created_at": self.created_at.isoformat(),
            "date": self.created_at.strftime("%A, %B %-d")
            + to_ordinal[self.created_at.strftime("%-d")],
            "time": self.created_at.strftime("%I:%M %p")
        }
