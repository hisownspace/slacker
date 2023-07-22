import os
from flask import request
from flask_socketio import SocketIO, emit, join_room, send
from flask_login import current_user

from app.models import db, User, Message
from app.forms import ChatMessage

origins = os.environ.get("ORIGINS")

socketio = SocketIO(
    cors_allowed_origins=origins,
    # async_mode="eventlet",
    # engineio_logger=True,
    # logger=True,
)


@socketio.on("join")
def handle_join(channel_id):
    print("joing channel", channel_id)
    join_room(channel_id)


@socketio.on("chat")
def handle_chat(data):
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
