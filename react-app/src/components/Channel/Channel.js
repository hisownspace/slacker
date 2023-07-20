import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

let socket;

function Channel() {
  let { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const user = useSelector((state) => state.session.user);

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

    setMessages([]);
    return () => {
      socket.disconnect();
    };
  }, [channelId]);

  const updateChatInput = (e) => {
    setChatInput(e.target.value);
  };

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat", { channelId, user: user?.username, msg: chatInput });

    setChatInput("");
  };
  return (
    <>
      <h1>Channel</h1>
      <div>
        {messages.map((message, idx) => (
          <div key={idx}>{`${message.user}: ${message.msg}`}</div>
        ))}
      </div>
      <form onSubmit={sendChat}>
        <input value={chatInput} onChange={updateChatInput} />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default Channel;
