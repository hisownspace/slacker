import { socket } from "../../socket";
import { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  loadChannelMessages,
  clearChannelMessages,
} from "../../store/messages";
import "./Channel.css";
import { setWorkspaceChannel } from "../../store/channel";
import { loadAllEmojis, loadUserFavorites } from "../../store/emojis";

const ReactionContainer = memo(
  ({ emojis, addEmojiToMessage, message }) => {
    return (
      <div className="emoji-container">
        {Object.values(emojis).map((emoji, idx) => (
          <span key={`emoji-${emoji.id}`}>
            {idx === 0 ||
            (idx + 1 < Object.values(emojis).length &&
              Object.values(emojis)[idx].group !==
                Object.values(emojis)[idx - 1].group) ? (
              <>
                <div className="emoji-group">{emoji.group}</div>
                <span
                  onClick={() => addEmojiToMessage(emoji.id, message.id)}
                  id={`emoji-${emoji.id}`}
                  className="message-options"
                >
                  {emoji.unicode}
                </span>
              </>
            ) : (
              <span
                onClick={() => addEmojiToMessage(emoji.id, message.id)}
                id={`emoji-${emoji.id}`}
                className="message-options"
              >
                {emoji.unicode}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  },
  () => true,
);

function Channel() {
  const dispatch = useDispatch();
  let { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [favorites, setFavorites] = useState([1, 2, 3]);
  const user = useSelector((state) => state.session.user);
  const channels = useSelector((state) => state.channel.allChannels);
  const workspace = useSelector((state) => state.workspaces.currentWorkspace);
  const workspaceId = useSelector(
    (state) => state.workspaces.currentWorkspace.id,
  );
  const allMessages = useSelector((state) => state.messages);
  const allFavorites = useSelector((state) => state.emojis.favoriteEmojis);
  const [channel, setChannel] = useState(null);
  const [reactionContainer, setReactionContainer] = useState();
  const emojis = useSelector((state) => state.emojis.allEmojis);

  useEffect(() => {
    (async () => {
      await dispatch(loadAllEmojis());
      await dispatch(loadUserFavorites());
      if (
        workspaceId &&
        channelId &&
        workspace.channels.includes(parseInt(channelId))
      ) {
        dispatch(setWorkspaceChannel(workspaceId, channelId));
      }
    })();
  }, [dispatch, channelId, workspaceId, workspace]);

  useEffect(() => {
    (async () => {
      await dispatch(loadChannelMessages(channelId));
    })();
    return () => {
      dispatch(clearChannelMessages());
    };
  }, [dispatch, channelId]);

  useEffect(() => {
    setMessages(allMessages);
  }, [allMessages]);

  // useEffect(() => {
  //   (async () => {
  //     await dispatch(loadUserFavorites());
  //   })();
  // }, [messages]);

  useEffect(() => {
    setFavorites(allFavorites);
  }, [allFavorites]);

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
    socket.on("react", addEmoji);

    return () => {
      socket.emit("leave", channelId);
      socket.off("chat");
      socket.off("react", addEmoji);
    };
  }, [channelId, channels]);

  // useEffect(() => {
  //   socket.on("react", addEmoji);
  //   return () => {
  //     socket.off("react", addEmoji);
  //   };
  // }, [socket]);
  //
  // useEffect(() => {
  //   return () => {
  //     setMessages([]);
  //     dispatch(clearChannelMessages());
  //   };
  // }, [channelId]);

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

  const addEmoji = (newMessage) => {
    setMessages((messages) => {
      const tempMessages = [...messages];
      const msgIdx = messages.findIndex(
        (message) => message.id === newMessage.id,
      );
      tempMessages[msgIdx] = { ...newMessage };
      return tempMessages;
    });
  };

  const showMessageOptions = (e) => {
    e.currentTarget.children[0].style.display = "inline-block";
  };

  const hideMessageOptions = (e) => {
    e.currentTarget.children[0].style.display = "none";
  };

  const addEmojiToMessage = async (emojiId, messageId) => {
    const tempMessages = [...messages];
    const tempMessageIdx = tempMessages.findIndex(
      (message) => message.id === messageId,
    );
    const tempMessage = tempMessages[tempMessageIdx];

    const messageReaction = tempMessage.reactions[emojiId];
    const userIdx = messageReaction?.user_ids.findIndex(
      (user_id) => user_id === user.id,
    );

    if (messageReaction && messageReaction.user_ids.includes(user.id)) {
      delete messageReaction.user_ids[userIdx];
      messageReaction.quantity -= 1;
      if (messageReaction.quantity === 0) {
        delete tempMessage.reactions[emojiId];
      }
    } else if (messageReaction) {
      messageReaction.user_ids.push(user.id);
      messageReaction.quantity += 1;
    } else {
      tempMessage.reactions[emojiId] = {
        message_id: messageId,
        quantity: 1,
        reaction: emojis[emojiId].unicode,
        rection_id: emojis[emojiId].id,
        user_ids: [user.id],
        created_at: new Date().toISOString(),
      };
    }

    setMessages(tempMessages);
    setReactionContainer(null);
    socket.emit("react", parseInt(emojiId), messageId, channelId, user.id);
  };

  const showEmojis = (e) => {
    e.stopPropagation();
    if (reactionContainer === e.currentTarget.parentNode.parentNode.id) {
      setReactionContainer(null);
    } else {
      setReactionContainer(e.currentTarget.parentNode.parentNode.id);
      document.addEventListener("click", hideEmojis);
    }
  };

  const hideEmojis = () => {
    setReactionContainer(null);
    document.removeEventListener("click", hideEmojis);
  };

  return (
    <div className="channel-chat">
      <h1>{channel?.name}</h1>
      <div className="chat-box">
        <div>
          {messages?.map((message, idx) => (
            <div
              className="channel-message"
              key={idx}
              id={`message-${message.id}`}
              onMouseOver={showMessageOptions}
              onMouseLeave={hideMessageOptions}
            >
              <div className="emoji-box">
                {favorites.map((reaction_id) => (
                  <span
                    onClick={() =>
                      addEmojiToMessage(emojis[reaction_id].id, message.id)
                    }
                    id={`emoji-${emojis[reaction_id]?.id}`}
                    key={`emoji-${emojis[reaction_id]?.id}`}
                    className="message-options"
                  >
                    {emojis[reaction_id]?.unicode}
                  </span>
                ))}
                <span onClick={showEmojis}>+</span>
              </div>
              {reactionContainer === `message-${message.id}` ? (
                <ReactionContainer
                  emojis={emojis}
                  addEmojiToMessage={addEmojiToMessage}
                  message={message}
                />
              ) : null}
              <div>
                <div className="message-container">
                  <div key={idx} className="chat-message">
                    {message.new_day ? (
                      <div className="new-day-container">
                        <span>{message.new_day}</span>
                      </div>
                    ) : null}
                    <div
                      className="message-content"
                      id={`message-content-${message.id}`}
                    >
                      {message.content}
                    </div>
                    <div className="message-user">
                      <span>
                        <span style={{ color: message.user }}>
                          {message.user}
                        </span>
                        <span className="timestamp">{message.timestamp}</span>
                      </span>
                    </div>
                    <ul>
                      {Object.values(message.reactions)
                        .sort((a, b) =>
                          a.created_at > b.created_at
                            ? 1
                            : a.created_at < b.created_at
                            ? -1
                            : 0,
                        )
                        .map((reaction, idx) => (
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
