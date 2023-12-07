const EMOJIS_LOADED = "emojis/EMOJIS_LOADED";
const FAVORITES_LOADED = "emojis/FAVORITES_LOADED";
const REACTION_GROUPS_LOADED = "emojis/REACTION_GROUPS_LOADED";

const emojis_loaded = (payload) => ({
  type: EMOJIS_LOADED,
  payload,
});

const userFavoritesLoaded = (payload) => ({
  type: FAVORITES_LOADED,
  payload,
});

const reactionGroupsLoaded = (payload) => ({
  type: REACTION_GROUPS_LOADED,
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

export const loadReactionGroups = () => async (dispatch) => {
  const response = await fetch("/api/emojis/groups");
  if (response.ok) {
    const groups = await response.json();
    console.log(groups);
    dispatch(reactionGroupsLoaded(groups));
  }
};

export const loadUserFavorites = () => async (dispatch) => {
  const response = await fetch("/api/emojis/favorites");
  if (response.ok) {
    const data = await response.json();
    dispatch(userFavoritesLoaded(data));
  }
};

const initialState = { allEmojis: {}, favoriteEmojis: [], groups: [] };

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case EMOJIS_LOADED:
      newState = { ...state, allEmojis: action.payload };
      return newState;
    case FAVORITES_LOADED:
      newState = { ...state, favoriteEmojis: action.payload };
      return newState;
    case REACTION_GROUPS_LOADED:
      newState = { ...state, groups: action.payload };
      console.log();
      console.log("IN REDUX STORE", newState);
      return newState;
    default:
      return state;
  }
}
