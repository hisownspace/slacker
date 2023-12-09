import { socket } from "../socket";
const LOADED_CHANNEL_MESSAGES = "message/LOADED_CHANNEL_MESSAGES";
const CLEARED_CHANNEL_MESSAGES = "message/CLEARED_CHANNEL_MESSAGES";
const DELETED_MESSAGE = "message/DELETED_MESSAGE";

const loadedChannelMessages = (messages) => ({
  type: LOADED_CHANNEL_MESSAGES,
  payload: messages,
});

const clearedChannelMessages = () => {
  return { type: CLEARED_CHANNEL_MESSAGES };
};

const messageDeleted = (messageId) => {
  return {
    type: DELETED_MESSAGE,
    payload: messageId,
  };
};

export const loadChannelMessages = (channelId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}/messages`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadedChannelMessages(data));
    if (data.errors) {
      return data.errors;
    }
    return data;
  }
};

export const clearChannelMessages = () => (dispatch) => {
  dispatch(clearedChannelMessages());
};

export const deleteMessage = (messageId, userId) => (dispatch) => {
  /* Demonstrate emitting socket in redux thunk */
  socket.emit("delete-chat", messageId, userId);
  dispatch(messageDeleted(messageId, userId));
};

const initialState = [];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case LOADED_CHANNEL_MESSAGES:
      return action.payload;
    case CLEARED_CHANNEL_MESSAGES:
      return [];
    case DELETED_MESSAGE:
      newState = [...state];
      console.log(newState);
      const msgIdx = newState.findIndex((el) => el.id === action.payload);
      newState.splice(msgIdx, 1);
      return newState;
    default:
      return state;
  }
}
