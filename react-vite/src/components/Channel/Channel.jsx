import { socket } from "../../socket";
import { useState, useEffect, memo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import addReaction from "../../assets/add_reaction.png";
import {
  loadChannelMessages,
  clearChannelMessages,
  deleteMessage,
  addMessage,
} from "../../store/messages";
import { setWorkspaceChannel } from "../../store/channel";
import {
  loadAllEmojis,
  loadUserFavorites,
  loadReactionGroups,
} from "../../store/emojis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

const groupEmojis = [
  "😀️",
  // "🧍️",
  // "🏿",
  "🦜️",
  "🥕️",
  "✈️",
  "♟️",
  "👒",
  "💬️",
  "🚩",
];

const MessageSettings = ({ messageId, userId, channelId }) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    socket.emit("delete-chat", messageId, userId, channelId);
  };

  return (
    <div className="message-settings">
      <div className="message-setting">Copy link</div>
      <div className="horizontal-separator" />
      <div className="message-setting">Pin to this conversation</div>
      <div className="horizontal-separator" />
      <div className="message-setting">Remind me about this</div>
      <div className="horizontal-separator" />
      <div>
        <div className="message-setting" id="edit-message">
          Edit message
        </div>
        <div
          onClick={handleDelete}
          className="message-setting red"
          id="delete-message"
        >
          Delete message...
        </div>
      </div>
    </div>
  );
};

const ReactionContainer = memo(
  ({ emojis, addEmojiToMessage, message, emojiBoxAbove }) => {
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.emojis.groups);
    const groupLinks = useRef({});

    useEffect(() => {
      dispatch(loadReactionGroups());
    }, []);

    const test = (groupName) => {
      groupLinks.current[groupName].parentNode.parentNode.scrollTop =
        groupLinks.current[groupName].offsetTop;
    };
    return (
      <div
        className={emojiBoxAbove ? "emoji-container above" : "emoji-container"}
      >
        <div className="emoji-group-icons">
          {groups.map((groupName, idx) => (
            <span key={groupName} onClick={() => test(groupName)}>
              {groupEmojis[idx]}
            </span>
          ))}
        </div>
        {Object.values(emojis).map((emoji, idx) => (
          <span key={`emoji-${emoji.id}`}>
            {idx === 0 ||
            (idx < Object.values(emojis).length &&
              Object.values(emojis)[idx].group !==
                Object.values(emojis)[idx - 1].group) ? (
              <>
                <div
                  id={emoji.group.split(" ").join("-")}
                  className="emoji-group"
                  ref={(el) => (groupLinks.current[emoji.group] = el)}
                >
                  {emoji.group}
                </div>
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

  const user = useSelector((state) => state.session.user);
  const channels = useSelector((state) => state.channel.allChannels);
  const workspace = useSelector((state) => state.workspaces.currentWorkspace);
  const workspaceId = useSelector(
    (state) => state.workspaces.currentWorkspace.id,
  );
  const emojis = useSelector((state) => state.emojis.allEmojis);
  const allMessages = useSelector((state) => state.messages);
  const allFavorites = useSelector((state) => state.emojis.favoriteEmojis);

  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [favorites, setFavorites] = useState([1, 2, 3]);
  const [reactionContainer, setReactionContainer] = useState();
  const [messageSettings, setMessageSettings] = useState();
  const [emojiBoxAbove, setEmojiBoxAbove] = useState(false);

  const anchorRef = useRef(null);

  useEffect(() => {
    socket.on("delete-chat", (messageId) => {
      console.log("HELLEO");
      dispatch(deleteMessage(messageId, user.id, channelId));
    });
    return () => socket.off("delete-chat");
  }, []);

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

  useEffect(() => {
    if (allFavorites.length >= 3) {
      setFavorites(allFavorites);
    } else if (allFavorites) {
      setFavorites((x) => {
        for (let i = 0; i < allFavorites.length; i++) {
          x[i] = allFavorites[i];
        }
        return x;
      });
    }
  }, [allFavorites, emojis]);

  useEffect(() => {
    console.log("joining channel", channelId);

    socket.on("chat", (chat) => {
      dispatch(addMessage(chat));
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
    if (!reactionContainer && !messageSettings) {
      e.currentTarget.children[0].style.display = "inline-block";
      e.currentTarget.style.backgroundColor = "#333333";
    }
  };

  const hideMessageOptions = (e) => {
    if (!reactionContainer && !messageSettings) {
      e.currentTarget.children[0].style.display = "none";
      e.currentTarget.style.backgroundColor = "#1f1f1f";
    }
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

  const showSettings = (e) => {
    e.stopPropagation();
    if (messageSettings === e.currentTarget.parentNode.parentNode.id) {
      setMessageSettings(null);
    } else {
      setMessageSettings(e.currentTarget.parentNode.parentNode.id);
      if (e.clientY < 300) {
        // setEmojiBoxAbove(false);
      } else {
        // setEmojiBoxAbove(true);
      }
      document.addEventListener("click", hideEmojis);
    }
  };

  const showEmojis = (e) => {
    e.stopPropagation();
    if (reactionContainer === e.currentTarget.parentNode.parentNode.id) {
      setReactionContainer(null);
    } else {
      setReactionContainer(e.currentTarget.parentNode.parentNode.id);
      if (e.clientY < 300) {
        setEmojiBoxAbove(false);
      } else {
        setEmojiBoxAbove(true);
      }
      document.addEventListener("click", hideEmojis);
    }
  };

  const hideEmojis = (e) => {
    if (!groupEmojis.includes(e.target.innerText)) {
      const channelMessages = document.querySelectorAll(".channel-message");
      const emojiBoxes = document.querySelectorAll(".emoji-box");
      for (let i = 0; i < channelMessages.length; i++) {
        const box = emojiBoxes[i];
        const message = channelMessages[i];
        message.style.backgroundColor = "#1f1f1f";
        box.style.display = "none";
      }
      setReactionContainer(null);
      setMessageSettings(null);
      document.removeEventListener("click", hideEmojis);
    }
  };

  return (
    <div className="channel-chat">
      <h2>{channel ? channel.name : null}</h2>
      <div className="chat-box">
        {messages
          .sort((a, b) =>
            a.created_at > b.created_at
              ? 1
              : a.created_at < b.created_at
              ? -1
              : 0,
          )
          .reverse()
          .map((message, idx) => (
            <div
              className="channel-message"
              key={idx}
              id={`message-${message.id}`}
              onMouseOver={showMessageOptions}
              onMouseLeave={hideMessageOptions}
            >
              <div className="emoji-box">
                {favorites.map((reaction_id) =>
                  reaction_id && emojis[reaction_id] ? (
                    <span
                      onClick={() =>
                        addEmojiToMessage(emojis[reaction_id].id, message.id)
                      }
                      id={`emoji-${emojis[reaction_id].id}`}
                      key={`emoji-${emojis[reaction_id].id}`}
                      className="message-options"
                    >
                      {emojis[reaction_id].unicode}
                    </span>
                  ) : null,
                )}
                <span
                  className="add-reaction-image message-options"
                  onClick={showEmojis}
                >
                  <img src={addReaction} />
                </span>
                <span className="message-options space" onClick={showSettings}>
                  <FontAwesomeIcon icon={icon({ name: "ellipsis-vertical" })} />
                </span>
              </div>
              {messageSettings === `message-${message.id}` ? (
                <MessageSettings
                  userId={user.id}
                  messageId={message.id}
                  channelId={channelId}
                />
              ) : null}
              {reactionContainer === `message-${message.id}` ? (
                <ReactionContainer
                  emojis={emojis}
                  addEmojiToMessage={addEmojiToMessage}
                  className="message-options"
                  message={message}
                  emojiBoxAbove={emojiBoxAbove}
                />
              ) : null}
              <div>
                <div className="message-container">
                  <div className="message-user">
                    <span>
                      <span className="message-user-name">{message.user}</span>
                      <span className="timestamp">{message.time}</span>
                    </span>
                  </div>
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
                    <ul className="message-emojis">
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
              <div ref={anchorRef} id="anchor"></div>
            </div>
          ))}
        <div ref={anchorRef} id="anchor"></div>
      </div>
      <div className="chat-form-container">
        <form className="chat-form" onSubmit={sendChat}>
          <input value={chatInput} onChange={updateChatInput} />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Channel;
