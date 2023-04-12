from flask import Blueprint
from flask_login import current_user
from app.models import Channel, db
from app.forms import ChannelForm

channel_routes = Blueprint("channel_workspaces", __name__)

@channel_routes.route("/<int:id>")
def get_channel(id):
  channel = Channel.query.get(id)
  return { "channel": channel.to_dict() }

@channel_routes.route("", methods=["POST"])
def create_channel():
  form = ChannelForm()
  
  if form.validate_on_submit():
    id = current_user.id
    params = {
      "owner_id": id,
      "workspace_id": form.data["workspace_id"],
      "name": form.data["name"],
      "description": form.data["description"],
      "protected": form.data["protected"]
    }
    
    channel = Channel(**params)
    db.session.add(channel)
    db.session.commit()
  return { "errors": form.errors }
    
    