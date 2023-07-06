import os
from flask_socketio import SocketIO, emit, join_room, send
from flask_login import current_user

origins = os.environ.get("ORIGINS")

socketio = SocketIO(cors_allowed_origins="*")


@socketio.on("join")
def handle_join(channel_id):
    print("joing channel", channel_id)
    join_room(channel_id)


@socketio.on("chat")
def handle_chat(data):
    channel_id = data["channelId"]
    print("sending message to channel", channel_id)
    emit("chat", data, to=channel_id, broadcast=True)
