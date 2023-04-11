from app.models import db

class File(db.Model):
  __tablename__ = "files"
  
  id = db.Column(db.Integer, primary_key=True)
  message_id = db.Column(db.Integer, db.ForeignKey("messages.id"), nullable=True)
  url = db.Column(db.String(2000), nullable=False)

  
  # relationships
  message = db.relationship("Message", back_populates="files")