import { socket } from "../../socket";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadChannelMessages } from "../../store/messages";
import "./Channel.css";
import { setWorkspaceChannel } from "../../store/channel";
import { loadAllEmojis } from "../../store/emojis";

function Channel() {
  const dispatch = useDispatch();
  let { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const user = useSelector((state) => state.session.user);
  const channels = useSelector((state) => state.channel.allChannels);
  const workspace = useSelector((state) => state.workspaces.currentWorkspace);
  const workspaceId = useSelector(
    (state) => state.workspaces.currentWorkspace.id,
  );
  const allMessages = useSelector((state) => state.messages);
  const [channel, setChannel] = useState(null);
  const emojis = useSelector((state) => state.emojis.allEmojis);

  useEffect(() => {
    (async () => {
      await dispatch(loadAllEmojis());
      await dispatch(loadChannelMessages(channelId));
      if (
        workspaceId &&
        channelId &&
        workspace.channels.includes(parseInt(channelId))
      ) {
        dispatch(setWorkspaceChannel(workspaceId, channelId));
      }
    })();
  }, [dispatch, channelId, workspaceId]);

  useEffect(() => {
    console.log("joining channel", channelId);

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
    socket.emit("join", channelId);

    return () => {
      socket.emit("leave", channelId);
      socket.off("chat");
    };
  }, [channelId, channels]);

  useEffect(() => {
    setMessages(allMessages);
  }, [allMessages]);

  useEffect(() => {
    let addEmoji = (newMessage) => {
      const tempMessages = [...messages];
      const msgIdx = tempMessages.findIndex(
        (message) => message.id == newMessage.id,
      );
      tempMessages[msgIdx] = { ...newMessage };
      setMessages(tempMessages);
    };
    addEmoji = (newMessage) => {
      console.log(newMessage);
      setMessages((messages) => {
        const tempMessages = [...messages];
        const msgIdx = messages.findIndex(
          (message) => message.id == newMessage.id,
        );
        tempMessages[msgIdx] = { ...newMessage };
        return tempMessages;
      });
    };
    socket.on("react", addEmoji);
    return () => {
      socket.off("react", addEmoji);
    };
  }, [socket]);

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

  const showMessageOptions = (e) => {
    e.currentTarget.style.backgroundColor = "#5A5A5A";
    e.currentTarget.children[0].style.display = "inline-block";
  };

  const hideMessageOptions = (e) => {
    e.currentTarget.style.backgroundColor = "white";
    e.currentTarget.children[0].style.display = "none";
  };

  const addEmojiToMessage = (emojiId, messageId) => {
    const tempMessages = [...messages];
    const tempMessageIdx = tempMessages.findIndex(
      (message) => message.id === messageId,
    );
    const tempMessage = messages[tempMessageIdx];
    console.log(tempMessage);

    const messageReaction = tempMessage.reactions[emojiId];
    const userIdx = messageReaction?.user_ids.findIndex(
      (user_id) => user_id === user.id,
    );

    if (messageReaction?.user_ids[userIdx]) {
      delete messageReaction?.user_ids[userIdx];
    } else {
      messageReaction?.user_ids.push(user.id);
    }

    setMessages(tempMessages);

    socket.emit("react", parseInt(emojiId), messageId, channelId, user.id);
  };

  return (
    <div className="channel-chat">
      <h1>{channel?.name}</h1>
      <div className="chat-box">
        <div>
          {messages.map((message, idx) => (
            <div
              className="channel-message"
              key={idx}
              id={`message-${message.id}`}
              onMouseOver={showMessageOptions}
              onMouseLeave={hideMessageOptions}
            >
              <div className="emoji-box">
                <span
                  onClick={() => addEmojiToMessage(emojis[49].id, message.id)}
                  id={`emoji-${emojis[49].id}`}
                  className="message-options"
                >
                  {emojis[49].unicode}
                </span>
                <span
                  onClick={() => addEmojiToMessage(emojis[44].id, message.id)}
                  id={`emoji-${emojis[44].id}`}
                  className="message-options"
                >
                  {emojis[44].unicode}
                </span>
              </div>
              <div>
                <p>
                  <span className="message-user">{message.user} </span>
                  <span className="time-stamp">{message.timestamp}</span>
                </p>
                <div key={idx}>{message.content}</div>
                <ul>
                  {Object.values(message.reactions).map((reaction, idx) => (
                    <li
                      key={`message-${reaction.message_id}-${reaction.id}-${idx}`}
                      onClick={() =>
                        addEmojiToMessage(
                          reaction.reaction_id,
                          reaction.message_id,
                        )
                      }
                      className={
                        user && reaction.user_ids.includes(user.id)
                          ? "reaction-highlight reaction"
                          : "reaction-no-highlight reaction"
                      }
                    >
                      {reaction.reaction}
                      {reaction.quantity}
                    </li>
                  ))}
                </ul>
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
