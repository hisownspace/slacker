from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Workspace, User, db
from app.forms import WorkspaceForm, WorkspaceIconForm, WorkspaceNameForm
from app.s3_helpers import (
    upload_image_file_to_s3,
    get_unique_filename,
    image_file,
    remove_file_from_s3,
)

workspace_routes = Blueprint("workspaces", __name__)


@workspace_routes.route("")
@login_required
def get_workspaces():
    workspaces = Workspace.query.all()
    return [workspace.to_dict() for workspace in workspaces], 200


@workspace_routes.route("/<int:id>")
@login_required
def get_workspace(id):
    workspace = Workspace.query.get(id)
    return workspace.to_dict(), 200


@workspace_routes.route("/user_spaces")
@login_required
def get_my_workspaces():
    id = current_user.id
    my_workspaces = [workspace for workspace in User.query.get(id).workspaces]
    return {"my_workspaces": [workspace.id for workspace in my_workspaces]}, 200


@workspace_routes.route("", methods=["POST"])
@login_required
def create_workspace():
    form = WorkspaceForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        image = form.image_file.data

        if not image_file(image.filename):
            return {"errors": "file extension not permitted for submitted image."}, 400

        image.filename = get_unique_filename(image.filename)
        image_upload = upload_image_file_to_s3(image)
        if "url" not in image_upload:
            return image_upload, 400
        image_url = image_upload["url"]
        params = {"name": form.data["name"], "icon_url": image_url}

        workspace = Workspace(**params)
        workspace.owner = current_user
        workspace.members.append(current_user)

        db.session.add(workspace)
        db.session.commit()

        return {"workspace": workspace.to_dict()}, 200
    return {"errors": form.errors}, 400


@workspace_routes.route("/<int:id>/icon", methods=["PUT"])
@login_required
def edit_workspace_icon(id):
    form = WorkspaceIconForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        image = form.image_file.data

        if not image_file(image.filename):
            return {"errors": "file extension not permitted for submitted image."}

        image.filename = get_unique_filename(image.filename)
        image_upload = upload_image_file_to_s3(image)
        if "url" not in image_upload:
            return image_upload, 400
        icon_url = image_upload["url"]

        workspace = Workspace.query.get(id)
        old_icon_url = workspace.icon_url
        remove_errors = remove_file_from_s3(old_icon_url)
        if remove_errors:
            return remove_errors, 400
        workspace.icon_url = icon_url
        db.session.commit()

        return {"workspace": workspace.to_dict()}, 200
    return {"errors": form.errors}, 400


@workspace_routes.route("/<int:id>/name", methods=["PUT"])
def edit_workspace_name(id):
    form = WorkspaceNameForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        workspace = Workspace.query.get(id)
        workspace.name = form.data["name"]
        db.session.commit()
        return {"workspace": workspace.to_dict()}

    return {"errors": form.errors}, 400


@workspace_routes.route("/<int:id>", methods={"DELETE"})
@login_required
def delete_workspace(id):
    workspace = Workspace.query.get(id)
    print(workspace.owner)
    print(current_user)
    if not workspace:
        return {"errors": "Resource not found!"}, 404
    if workspace.owner.id != current_user.id:
        return {"errors": "Unauthorized!"}, 401
    icon_url = workspace.icon_url
    try:
        remove_file_from_s3(icon_url)
        db.session.delete(workspace)
        db.session.commit()
    except Exception as e:
        return {"errors": "Unknown error! Please try again!"}
    return {"message": "Workspace successfully deleted!"}
