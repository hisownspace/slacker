import os
import time
from flask import request
from flask_socketio import SocketIO, emit, join_room, leave_room
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
    print(current_user)
    print("joining channel", channel_id)
    join_room(channel_id)

@socketio.on("leave")
def handle_leave(channel_id):
    print("leaving channel", channel_id)
    leave_room(channel_id)

@socketio.on("edit-chat")
def handle_edit(data):
    message = Message.query.get(data["messageId"])
    message.content = data["content"]
    db.session.commit()
    print(data)
    emit("edit-chat", message.to_dict(), to=data["channelId"], broadcast=True)


@socketio.on("react")
def handle_reaction(emoji_id, message_id, channel_id, user_id):
    # time.sleep(5)
    message = Message.query.get(message_id)
    user_reaction = UserReaction.query.get({"message_id": message_id,"user_id":user_id,
                                          "reaction_id":emoji_id})
    if user_reaction:
        db.session.delete(user_reaction)
        db.session.commit()
        emit("react", message.to_dict(), broadcast=True)
    else:
        reaction = Reaction.query.get(emoji_id)
        
        user_reaction = UserReaction(reaction_id = int(emoji_id), user_id=user_id)
        user_reaction.message = message
        for reaction in message.reactions:
            if reaction.reaction_id == emoji_id:
                user_reaction.created_at = reaction.created_at

        db.session.add(user_reaction)
        db.session.commit()
        emit("react", message.to_dict(), broadcast=True)


@socketio.on("delete-chat")
def handle_chat_delete(message_id, user_id, channel_id):
    print(message_id)
    print(user_id)
    message = Message.query.get(message_id)
    print(message.to_dict())
    if message.user_id == user_id:
        print("DELETING MESSAGE")
        db.session.delete(message)
        db.session.commit()
        emit("delete-chat", message_id, to=channel_id, broadcast=True)

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
    print("PRINTING ERRRORS!!!")
    print(request.event["message"])
    print(request.event["args"])
    print(e)

