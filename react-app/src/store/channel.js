const LOADED_ALL_CHANNELS = "channel/LOADED_ALL_CHANNELS";
const LOADED_USER_CHANNELS = "channel/LOADED_USER_CHANNELS";
const LOADED_OWNED_CHANNELS = "channel/LOADED_ALL_CHANNELS";

const getChannels = (channels) => ({
  type: LOADED_ALL_CHANNELS,
  payload: channels,
});

export const loadChannels = () => async (dispatch) => {
  const response = await fetch("/api/channels");
  if (response.ok) {
    const data = await response.json();
    dispatch(getChannels(data));
    if (data.errors) {
      return data.errors;
    }
    return data;
  }
};

const initialState = {
  userChannels: null,
  allChannels: null,
  ownedChannels: null,
};

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case LOADED_USER_CHANNELS:
      newState = { ...state, userChannels: action.payload };
      return newState;
    case LOADED_ALL_CHANNELS:
      newState = { ...state, allChannels: action.payload };
      return newState;
    case LOADED_OWNED_CHANNELS:
      newState = { ...state, ownedChannels: action.payload };
      return newState;
    default:
      return state;
  }
}
