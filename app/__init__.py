import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf

from app.models import db, User
from app.config import Config
from app.seeds import seed_commands

from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.workspace_routes import workspace_routes

app = Flask(__name__, static_folder='../react-app/build', static_url_path='/')

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth.unauthorized"

@login_manager.user_loader
def load_user(user_id):
  return User.query.get(int(user_id))

app.config.from_object(Config)

app.cli.add_command(seed_commands)

app.register_blueprint(user_routes, url_prefix="/api/users")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(workspace_routes, url_prefix="/api/workspaces")


db.init_app(app)
Migrate(app, db)


CORS(app)


# ! I don't know if this code is necessary :
# def https_redirect():
#     if os.environ.get('FLASK_ENV') == 'production':
#         if request.headers.get('X-Forwarded-Proto') == 'http':
#             url = request.url.replace('http://', 'https://', 1)
#             code = 301
#             return redirect(url, code=code)

@app.after_request
def inject_csrf_token(res):
  res.set_cookie(
    'csrf_token',
    generate_csrf(),
    secure=False if os.environ.get("FLASK_DEBUG") else True,
    samesite=None if os.environ.get("FLASK_DEBUG") else "Strict",
    httponly=True
  )
  return res

@app.route("/api/help")
def help():
  """This route provides information about all the backend routes!"""
  func_list = {}
  for rule in app.url_map.iter_rules():
    if rule.endpoint != 'static':
      for method in rule.methods:
        if method != "OPTIONS" and method != "HEAD":
          endpoint_method = method
      key = endpoint_method + " " + rule.rule
      func_list[key] = app.view_functions[rule.endpoint].__doc__
  return jsonify(func_list)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')