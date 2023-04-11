from flask_wtf import FlaskForm
from wtforms import StringField
from sqlalchemy import or_
from app.models import User
from wtforms.validators import ValidationError, DataRequired

def user_exists(form, field):
  print(form.data)
  email = form.data["email"]
  # username = form.data["username"]
  user = User.query.filter(or_(User.email == email, User.username == email)).first()
  print(user)
  if not user:
    raise ValidationError("User does not exist.")

def password_matches(form, field):
  password = field.data
  email = form.data["email"]
  # username = form.data["username"]
  user = User.query.filter(or_(User.email == email, User.username == email)).first()
  if user and not user.check_password(password):
    raise ValidationError("Password was incorrect.")
  

class LoginForm(FlaskForm):
  email = StringField("Username or email", validators=[DataRequired(), user_exists])
  # username = StringField("username", validators=[DataRequired(), user_exists])
  password = StringField("password", validators=[DataRequired(), password_matches])