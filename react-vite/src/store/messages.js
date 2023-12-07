const LOADED_CHANNEL_MESSAGES = "message/LOADED_CHANNEL_MESSAGES";
const CLEARED_CHANNEL_MESSAGES = "message/CLEARED_CHANNEL_MESSAGES";

const loadedChannelMessages = (messages) => ({
  type: LOADED_CHANNEL_MESSAGES,
  payload: messages,
});

const clearedChannelMessages = () => {
  return { type: CLEARED_CHANNEL_MESSAGES };
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
  console.log("MESSAGES CLEARED!!!");
  dispatch(clearedChannelMessages());
};

const initialState = [];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case LOADED_CHANNEL_MESSAGES:
      return action.payload;
    case CLEARED_CHANNEL_MESSAGES:
      return [];
    default:
      return state;
  }
}
