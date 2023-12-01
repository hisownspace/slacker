from flask import Blueprint
from flask_login import login_required, current_user


message_routes = Blueprint("messages", __name__)


@message_routes.route("/new", methods=["POST"])
def new_message(data):
    form = ChatMessage()
    for name, field in data.items():
        form.data[name] = field
    if form.validate_on_submit():
        params = {}
        for name, field in form.data.items():
            params[name] = field

        new_message = Message(**params)
        db.session.add(new_message)
        db.session.commit()
        return new_message.to_dict()
    return form.errors
