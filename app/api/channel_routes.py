from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Channel, Workspace, db
from app.forms import (
    ChannelForm,
    ChannelNameForm,
    ChannelDescriptionForm,
    ChannelProtectedForm,
)

channel_routes = Blueprint("channel_workspaces", __name__)


@channel_routes.route("")
def get_all_channels():
    channels = Channel.query.all()
    return {channel.id: channel.to_dict() for channel in channels}


@channel_routes.route("/<int:id>")
@login_required
def get_channel(id):
    channel = Channel.query.get(id)
    return channel.to_dict()


@channel_routes.route("", methods=["POST"])
# @login_required
def create_channel():
    print(request.get_json())
    form = ChannelForm()

    # form["csrf_token"].data = request.cookies["csrf_token"]

    if True:
        id = current_user.id
        workspace_id = form.data["workspace_id"]
        name = form.data["name"]

        workspace = Workspace.query.get(workspace_id)

        for channel in workspace.channels:
            if channel.name == name:
                return {"errors": {"name": ["Channel name is already in use."]}}

        params = {
            "owner_id": id,
            "workspace_id": workspace_id,
            "name": name,
            "description": form.data["description"],
            "protected": form.data["protected"],
        }

        channel = Channel(**params)
        db.session.add(channel)
        db.session.commit()
        return channel.to_dict()
    return {"errors": form.errors}


@channel_routes.route("/<int:id>/name", methods=["PUT"])
def edit_channel_name(id):
    form = ChannelNameForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        channel = Channel.query.get(id)

        channel.name = form.data["name"]

        db.session.commit()
        return channel.to_dict()
    return {"errors": form.errors}


@channel_routes.route("/<int:id>/description")
@login_required
def edit_channel_description(id):
    form = ChannelDescriptionForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        channel = Channel.query.get(id)
        channel.description = form.data["description"]
        db.session.commit()
        return channel.to_dict()

    return {"errors": form.errors}


@channel_routes.route("/<int:id>/protected", methods=["PUT"])
@login_required
def edit_channel_protected(id):
    form = ChannelProtectedForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        channel = Channel.query.get(id)
        channel.protected = not channel.protected

        db.session.commit()
        return channel.to_dict()
    return {"errors": form.errors}


@channel_routes.route("/<int:id>/messages")
@login_required
def get_channel_messages(id):
    channel = Channel.query.get(id)
    messages = channel.messages

    return channel.to_dict()
