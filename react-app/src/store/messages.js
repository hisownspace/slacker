const LOADED_CHANNEL_MESSAGES = "message/LOAD_CHANNEL_MESSAGES";

const loadedChannelMessages = (messages) => ({
  type: LOADED_CHANNEL_MESSAGES,
  payload: messages,
});

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

const initialState = [];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case LOADED_CHANNEL_MESSAGES:
      // console.log(action.payload === state);
      return action.payload;
    default:
      return state;
  }
}
