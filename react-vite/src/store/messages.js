import { socket } from "../socket";
const LOADED_CHANNEL_MESSAGES = "message/LOADED_CHANNEL_MESSAGES";
const CLEARED_CHANNEL_MESSAGES = "message/CLEARED_CHANNEL_MESSAGES";
const DELETED_MESSAGE = "message/DELETED_MESSAGE";
const ADDED_MESSAGE = "message/ADDED_MESSAGE";

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

const messageAdded = (message) => {
  return { type: ADDED_MESSAGE, payload: message };
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
  console.log("HELLOEOEOEOEOEOEOEOEOEO");
  dispatch(messageDeleted(messageId, userId));
};

export const addMessage = (chat) => (dispatch) => {
  dispatch(messageAdded(chat));
};

const initialState = [];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case LOADED_CHANNEL_MESSAGES:
      return action.payload;
    case CLEARED_CHANNEL_MESSAGES:
      return [];
    case ADDED_MESSAGE:
      newState = [...state, action.payload];
      return newState;
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
