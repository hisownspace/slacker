from flask import Blueprint
from ..models import Reaction

emoji_routes = Blueprint("api/emojis", __name__)

@emoji_routes.route("/")
def get_all_emojis():
    reactions = {emoji.id: emoji.to_dict() for emoji in Reaction.query.all() }
    return reactions
