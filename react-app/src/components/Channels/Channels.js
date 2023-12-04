import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import "./Channels.css";
import Workspaces from "../Workplaces";
import { loadChannels, loadUserChannels } from "../../store/channel.js";
import { getUserWorkspaces, getCurrentWorkspace } from "../../store/workspaces";

function Channels({
  moveBorder,
  grabBorder,
  releaseBorder,
  styleBorder,
  unstyleBorder,
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
    const tempCurrWorkspaces = [];
    for (let i = 0; i < currWorkspace?.channels?.length; i++) {
      tempCurrWorkspaces.push(channels[currWorkspace.channels[i]]);
    }
    setCurrChannels(tempCurrWorkspaces);
  }, [currWorkspace]);

  return (
    <div className="sidebar-container" onMouseMove={moveBorder}>
      <Workspaces />
      <div className="sidebar-main">
        <div className="sidebar-workspace-title">{currWorkspace.name}</div>
        {currChannels?.map((channel) => (
          <ul key={channel.id}>
            <Link to={`/client/channels/${channel?.id}`}>{channel?.name}</Link>
          </ul>
        ))}
      </div>
      <div
        onMouseDown={grabBorder}
        onMouseUp={releaseBorder}
        onMouseOver={styleBorder}
        onMouseLeave={unstyleBorder}
        className="resize-handle"
        data-target=".sidebar-main"
      />
    </div>
  );
}

export default Channels;
