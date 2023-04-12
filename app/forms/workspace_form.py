from urllib.request import urlopen
from wtforms import StringField
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired
from wtforms.validators import DataRequired, ValidationError


class WorkspaceForm(FlaskForm):
  name = StringField("name", [DataRequired()])
  image_file = FileField("image_file", [FileRequired()])

  def validate_image_file(form, field):
    content_type = field.data.content_type
    if "image" not in content_type:
      raise ValidationError("This is not a valid image!")

class WorkspaceIconForm(WorkspaceForm):
  name = StringField("name")

  def validate_image_file(form, field):
    pass

class WorkspaceNameForm(WorkspaceForm):
  image_file = FileField("image_file")