import os
from flask_socketio import SocketIO, emit

origins = os.environ.get("ORIGINS")

socketio = SocketIO(cors_allowed_origins=origins)

@socketio.on("chat")
def handle_chat(data):
  emit("chat", data, broadcast=True)
