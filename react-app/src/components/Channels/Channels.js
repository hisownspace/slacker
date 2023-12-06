import { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import "./Channels.css";
import Workspaces from "../Workplaces";
import { loadChannels, loadUserChannels } from "../../store/channel.js";
import { getUserWorkspaces, getCurrentWorkspace } from "../../store/workspaces";

function Channels({
  grabBorder,
  releaseBorder,
  styleBorder,
  unstyleBorder,
  handle,
  sidebarMain,
  sidebarContainer,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const channels = useSelector((state) => state.channel.allChannels);
  const currWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace,
  );
  const prevChannels = useSelector((state) => state.channel.userChannels);
  // const user = useSelector((state) => state.user);
  const [currChannels, setCurrChannels] = useState([]);
  // const userChannels = useSelector((state) => state.channel.userChannels);
  const userWorkspaces = useSelector(
    (state) => state.workspaces.userWorkspaces,
  );
  const workspaceId = useSelector(
    (state) => state.workspaces.currentWorkspace.id,
  );

  useEffect(() => {
    /* Navigate to last channel user visited in the workspace
     when user switches workspaces; if the user hasn't
     visited any channels in this session, defaults to
     the first channel in the workspace */

    const prevChannelId = prevChannels[workspaceId];
    if (prevChannelId) {
      history.push(`/client/channels/${prevChannelId}`);
    } else if (currWorkspace?.channels) {
      history.push(`/client/channels/${currWorkspace.channels[0]}`);
    }
  }, [workspaceId, currWorkspace]);

  useEffect(() => {
    (async () => {
      const receivedChannels = await dispatch(loadChannels());
      if (!currWorkspace.length) {
        if (localStorage.currentWorkspace) {
          const id = localStorage.currentWorkspace;
          const currentWorkspace = await dispatch(getCurrentWorkspace(id));
        } else {
          const id = userWorkspaces[0]?.id;
          if (id) {
            const currentWorkspace = await dispatch(getCurrentWorkspace(id));
          }
        }
      }
    })();
  }, [dispatch, userWorkspaces]);

  useEffect(() => {
    /* Gets the information about channels in current workspace whenever
       whenever the workspace changes for display in sidebar */
    const tempCurrWorkspaces = [];
    for (let i = 0; i < currWorkspace?.channels?.length; i++) {
      tempCurrWorkspaces.push(channels[currWorkspace.channels[i]]);
    }
    setCurrChannels(tempCurrWorkspaces);
  }, [currWorkspace]);

  return (
    <div ref={sidebarContainer} className="sidebar-container">
      <Workspaces />
      <div ref={sidebarMain} className="sidebar-main">
        <div className="sidebar-workspace-title">{currWorkspace.name}</div>
        {currChannels?.map((channel) => (
          <ul key={channel.id}>
            <Link to={`/client/channels/${channel?.id}`}>{channel?.name}</Link>
          </ul>
        ))}
      </div>
      <div
        ref={handle}
        onMouseDown={grabBorder}
        onMouseUp={releaseBorder}
        onMouseOver={styleBorder}
        onMouseLeave={unstyleBorder}
        onDoubleClick={(e) => (e.target.parentNode.style.width = "fit-content")}
        className="resize-handle"
        data-target=".sidebar-main"
      />
    </div>
  );
}

const MemoizedChannels = memo(Channels);
export default MemoizedChannels;
