import os
from flask_sqlalchemy import SQLAlchemy

production = os.environ.get("FLASK_DEBUG") == False
SCHEMA = os.environ.get("SCHEMA")

db = SQLAlchemy()