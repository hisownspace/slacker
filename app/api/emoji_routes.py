from flask import Blueprint
from flask_login import current_user
from ..models import Reaction

emoji_routes = Blueprint("api/emojis", __name__)

@emoji_routes.route("/")
def get_all_emojis():
    reactions = {}
    for reaction in Reaction.query.all():
        if reaction.to_dict()["group"] == "People & Body":
            continue
        else:
            reactions[reaction.id] = reaction.to_dict()
    return reactions

@emoji_routes.route("/favorites")
def get_favorite_reactions():
    my_messages = [message.to_dict() for message in current_user.messages]
    reactions = {}
    for message in my_messages:
        for reaction_id in message["reactions"].keys():
            if reaction_id in reactions:
                reactions[reaction_id] += 1
            else:
                reactions[reaction_id] = 1
    return sorted(reactions, key=reactions.get, reverse=True)[:3]
