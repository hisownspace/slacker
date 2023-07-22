import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadChannelMessages } from "../../store/messages";
import "./Channel.css";

let socket;

function Channel() {
  const dispatch = useDispatch();
  let { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const user = useSelector((state) => state.session.user);
  const channels = useSelector((state) => state.channel.allChannels);
  const allMessages = useSelector((state) => state.messages);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    (async () => {
      await dispatch(loadChannelMessages(channelId));
    })();
  }, [dispatch, channelId]);

  useEffect(() => {
    console.log("joining channel", channelId);
    socket = io("localhost:8000");

    socket.emit("join", channelId);

    socket.on("chat", (chat) => {
      setMessages((messages) => [...messages, chat]);
    });
    socket.on("connect", () => {
      const transport = socket.io.engine.transport.name;
      console.log(transport);
    });

    socket.io.engine.on("upgrade", () => {
      const upgradedTransport = socket.io.engine.transport.name;
      console.log(upgradedTransport);
    });

    setChannel(channels[channelId]);

    return () => {
      socket.disconnect();
    };
  }, [channelId, channels]);

  useEffect(() => {
    setMessages(allMessages);
    console.log(allMessages);
  }, [allMessages]);

  const updateChatInput = (e) => {
    setChatInput(e.target.value);
  };

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat", {
      channel_id: channelId,
      user: user.username,
      content: chatInput,
      user_id: user.id,
      group_id: null,
    });

    setChatInput("");
  };
  return (
    <div className="channel-chat">
      <h1>{channel?.name}</h1>
      <div className="chat-box">
        <div>
          {messages.map((message, idx) => (
            <div>
              <div>
                <p>
                  <span className="message-user">{message.user} </span>
                  <span className="time-stamp">{message.timestamp}</span>
                </p>
                <div key={idx}>{message.content}</div>
              </div>
            </div>
          ))}
          <form className="chat-form" onSubmit={sendChat}>
            <input value={chatInput} onChange={updateChatInput} />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Channel;
