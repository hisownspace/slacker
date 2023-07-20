import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getUserWorkspaces, getCurrentWorkspace } from "../../store/workspaces";
import "./Workspaces.css";

const Workspaces = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.session.user);
  const workspaces = useSelector((store) => store.workspaces.userWorkspaces);

  useEffect(() => {
    (async () => {
      const workspaceData = await dispatch(getUserWorkspaces());
    })();
  }, [dispatch]);

  const changeWorkspace = async (id) => {
    const currentWorkspace = await dispatch(getCurrentWorkspace(id));
  };

  return (
    <div className="workspaces">
      {workspaces?.map((workspace) => (
        <div key={workspace.id}>
          <div
            className="workspace-button"
            onClick={() => changeWorkspace(workspace.id)}
          >
            <img className="workspace-icon" src={workspace.icon_url} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Workspaces;
