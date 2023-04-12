from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, BooleanField
from wtforms.validators import DataRequired


class ChannelForm(FlaskForm):
  workspace_id = IntegerField("workspace_id", [DataRequired()])
  name = StringField("name", [DataRequired()])
  description = StringField("description")
  protected = BooleanField("protected", [DataRequired()])