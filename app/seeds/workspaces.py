from sqlalchemy.sql import text
from app.models import db, User, Workspace, production, SCHEMA


def seed_workspaces(**kwargs):
    workspaces = {
        "workspace_1": Workspace(
            name="App Academy Internal",
            icon_url="https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png",
            owner_id=1,
            open=False,
            public=False,
        ),
        "workspace_2": Workspace(
            name="App Academy",
            icon_url="https://d1psgljc389n8q.cloudfront.net/discussions/posts/qHddZMInp",
            owner_id=1,
            open=False,
            public=True,
        ),
        "workspace_3": Workspace(
            name="Limited Hangout",
            icon_url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Hangouts_icon.svg/512px-Hangouts_icon.svg.png",
            owner_id=1,
            open=True,
            public=True,
        ),
    }
    db.session.add(workspaces["workspace_1"])
    db.session.add(workspaces["workspace_2"])
    for user in kwargs["users"].values():
        user.workspaces.append(workspaces["workspace_1"])
        user.workspaces.append(workspaces["workspace_2"])
    db.session.commit()

    return workspaces


def undo_workspaces():
    if production:
        db.execute(f"TRUNCATE table {SCHEMA}.workspaces RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM workspaces;"))
        db.session.execute(text("DELETE FROM workspace_members"))
    db.session.commit()
