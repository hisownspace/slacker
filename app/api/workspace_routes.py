from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Workspace, User, db
from app.forms import WorkspaceForm
from app.s3_helpers import upload_image_file_to_s3, get_unique_filename

workspace_routes = Blueprint("workspaces", __name__)

@workspace_routes.route("")
@login_required
def get_workspaces():
  workspaces = Workspace.query.all()
  return { "workspaces": workspace.to_dict() for workspace in workspaces }

@workspace_routes.route("/<int:id>")
@login_required
def get_workspace(id):
  workspace = Workspace.query.get(id)
  return { "workspace": workspace.to_dict() }

@workspace_routes.route("/user_spaces")
@login_required
def get_my_workspaces():
  id = current_user.id
  my_workspaces = [workspace for workspace in User.query.get(id).workspaces]
  return { "my_workspaces": [workspace.id for workspace in my_workspaces] }

@workspace_routes.route("", methods =["POST"])
@login_required
def create_workspace():
  form = WorkspaceForm()
  form["csrf_token"].data = request.cookies["csrf_token"]
  
  if form.validate_on_submit():
    image = form.image_file.data
    image.filename = get_unique_filename(image.filename)
    image_upload = upload_image_file_to_s3(image)
    if "url" not in image_upload:
      return image_upload, 400
    image_url = image_upload["url"]
    params = {
      "name": form.data["name"],
      "icon_url": image_url
    }
    
    workspace = Workspace(**params)
    workspace.owner = current_user
    
    db.session.add(workspace)
    db.session.commit()
    
    return { "workspace": workspace.to_dict()}
  return { "errors": form.errors }