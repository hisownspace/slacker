from flask import Blueprint
from flask_login import current_user
from ..models import Reaction, ReactionGroup

emoji_routes = Blueprint("api/emojis", __name__)

@emoji_routes.route("/")
def get_all_emojis():
    reactions = {}
    for reaction in Reaction.query.all():
        if reaction.to_dict()["group"] == "People & Body" or reaction.to_dict()["group"] == "Component":
            continue
        else:
            reactions[reaction.id] = reaction.to_dict()
    return reactions

@emoji_routes.route("/favorites")
def get_favorite_reactions():
    my_reactions = [message.to_dict() for message in current_user.reactions]
    # print(my_reactions)
    reactions = {}
    for reaction in my_reactions:
        print(reaction)
        if reaction["reaction_id"] in reactions:
            reactions[reaction["reaction_id"]] += 1
        else:
            reactions[reaction["reaction_id"]] = 1
    print(reactions)
    return sorted(reactions, key=reactions.get, reverse=True)[:3]

@emoji_routes.route("/groups")
def get_all_groups():
    groups = ReactionGroup.query.all()
    groups = [group for group in groups if group.group_name != "Component" and
              group.group_name != "People & Body"]
    return [group.group_name for group in groups]
