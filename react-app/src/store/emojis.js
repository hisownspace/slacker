const EMOJIS_LOADED = "emojis/EMOJIS_LOADED";

const emojis_loaded = (payload) => ({
  type: EMOJIS_LOADED,
  payload,
});

export const loadAllEmojis = () => async (dispatch) => {
  const response = await fetch("/api/emojis/");
  if (response.ok) {
    const data = await response.json();
    dispatch(emojis_loaded(data));
  } else {
    return;
  }
};

const initialState = { allEmojis: {} };

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case EMOJIS_LOADED:
      newState = { ...state, allEmojis: action.payload };
      return newState;
    default:
      return state;
  }
}
