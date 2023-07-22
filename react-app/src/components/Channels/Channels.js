import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  const channels = useSelector((state) => state.channel.allChannels);
  const currWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
  const user = useSelector((state) => state.user);
  const [currChannels, setCurrChannels] = useState([]);
  const userChannels = useSelector((state) => state.channel.userChannels);
  const userWorkspaces = useSelector(
    (state) => state.workspaces.userWorkspaces
  );

  useEffect(() => {
    (async () => {
      const receivedChannels = await dispatch(loadChannels());
      if (!currWorkspace.length) {
        if (localStorage.currentWorkspace) {
          const id = localStorage.currentWorkspace;
          const currentWorkspace = await dispatch(getCurrentWorkspace(id));
        } else {
          const id = userWorkspaces[0]?.id;
          const currentWorkspace = await dispatch(getCurrentWorkspace(id));
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
