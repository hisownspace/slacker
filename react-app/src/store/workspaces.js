const LOADED_USER_WORKSPACES = "workspaces/LOADED_USER_WORKSPACES";
const LOADED_CURRENT_WORKSPACE = "workspaces/LOADED_CURRENT_WORKSPACE";

const loadUserWorkspaces = (workspaces) => ({
  type: LOADED_USER_WORKSPACES,
  payload: workspaces,
});

const loadCurrentWorkspace = (workspaces) => ({
  type: LOADED_CURRENT_WORKSPACE,
  payload: workspaces,
});

export const getUserWorkspaces = () => async (dispatch) => {
  const response = await fetch("/api/workspaces/user_spaces");
  if (response.ok) {
    const data = await response.json();
    dispatch(loadUserWorkspaces(data));
    if (data.errors) {
      return data.errors;
    }
  }
};

export const getCurrentWorkspace = (id) => async (dispatch) => {
  const response = await fetch(`/api/workspaces/${id}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadCurrentWorkspace(data));
    // dispatch(loadCurrentChannels(data.channels));
    if (data.errors) {
      return data.errors;
    }
  }
};

const initialState = {
  userWorkspaces: [],
  allWorkspaces: [],
  currentWorkspace: [],
};

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case LOADED_USER_WORKSPACES:
      newState = { ...state, userWorkspaces: action.payload };
      return newState;
    case LOADED_CURRENT_WORKSPACE:
      newState = { ...state, currentWorkspace: action.payload };
      return newState;
    default:
      return state;
  }
}
