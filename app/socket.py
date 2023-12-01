import os
from flask import request
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_login import current_user

from app.models import db, User, Message, Reaction, UserReaction
from app.forms import ChatMessage

origins = os.environ.get("ORIGINS")
print(origins)

socketio = SocketIO(
    cors_allowed_origins=origins,
    # async_mode="eventlet",
    # engineio_logger=True,
    # logger=True,
)


@socketio.on("join")
def handle_join(channel_id):
    print("joining channel", channel_id)
    join_room(channel_id)

@socketio.on("leave")
def handle_leave(channel_id):
    print("leaving channel", channel_id)
    leave_room(channel_id)


@socketio.on("react")
def handle_reaction(emoji_id, message_id, channel_id, user_id):
    message = Message.query.get(message_id)
    userReaction = UserReaction.query.get({"message_id": message_id,"user_id":user_id,
                                          "reaction_id":emoji_id})
    if userReaction:
        db.session.delete(userReaction)
        db.session.commit()
        emit("react", message.to_dict(), broadcast=True)
    else:
        reaction = Reaction.query.get(emoji_id)
        
        userReaction = UserReaction(reaction_id = int(emoji_id), user_id=user_id)
        userReaction.message = message
        db.session.add(userReaction)
        db.session.commit()
        emit("react", message.to_dict(), broadcast=True)

@socketio.on("chat")
def handle_chat(data):
    print("\U0001F636")
    channel_id = data["channel_id"]
    content = data["content"]
    user_id = data["user_id"]
    group_id = data["group_id"]
    if 0 < len(content) < 2000:
        message = Message(
            channel_id=channel_id,
            content=content,
            user_id=user_id,
            group_id=group_id,
        )
        db.session.add(message)
        db.session.commit()
        print("sending message to channel", channel_id)
        emit("chat", message.to_dict(), to=channel_id, broadcast=True)


@socketio.on_error()
def error_handler(e):
    print(request.event["message"])
    print(request.event["args"])
    print(e)
