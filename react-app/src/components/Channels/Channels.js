import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Channels.css";
import Workspaces from "../Workplaces";
import { loadChannels, loadUserChannels } from "../../store/channel.js";

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

  useEffect(() => {
    (async () => {
      console.log("hello");
      const receivedChannels = await dispatch(loadChannels());
      // const receivedUserChannels = await dispatch(loadUserChannels(user.id));
    })();
  }, [dispatch]);

  useEffect(() => {
    const tempCurrWorkspaces = [];
    console.log(currWorkspace);
    for (let i = 0; i < currWorkspace?.channels?.length; i++) {
      console.log(channels);
      tempCurrWorkspaces.push(channels[currWorkspace.channels[i]]);
    }
    console.log(tempCurrWorkspaces);
    setCurrChannels(tempCurrWorkspaces);
  }, [currWorkspace]);

  return (
    <div className="sidebar-container" onMouseMove={moveBorder}>
      <Workspaces />
      <div className="sidebar-main">
        {currChannels?.map((channel) => (
          <ul>
            <Link key={channel?.id} to={`/client/channels/${channel?.id}`}>
              {channel?.name}
            </Link>
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
