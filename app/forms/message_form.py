from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import InputRequired, Length


class ChatMessage(FlaskForm):
    user_id = IntegerField("user_id", [InputRequired()])
    channel_id = IntegerField("channel_id", [InputRequired()])
    group_id = IntegerField("group_id")
    content = StringField("content", [InputRequired(), Length(min=3, max=2000)])

    def validate_group_id(form, field):
        print(dir(form))
        print(form)
        print(field)
