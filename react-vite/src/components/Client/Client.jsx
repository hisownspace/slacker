import { useState, useEffect, useRef } from "react";
// import { debounce } from "lodash";
import { Route, Routes } from "react-router-dom";
import MemoizedChannels from "../Channels";
import { Outlet } from "react-router-dom";
import Channel from "../Channel";

export default function Client() {
  const handle = useRef(null);
  const sidebarMain = useRef(null);
  const sidebarContainer = useRef(null);

  // const [tracking, setTracking] = useState(false);
  const tracking = useRef(false);
  const [resizeData, setResizeData] = useState({
    startWidth: null,
    startCursorScreenX: null,
    handleWidth: 25,
    resizeTarget: null,
    parentElement: null,
  });

  useEffect(() => {
    if (resizeData.atEdge) {
      handle.current.style.cursor = "e-resize";
      if (tracking.current) {
        document.body.style.cursor = "e-resize";
      }
    } else {
      handle.current.style.cursor = "col-resize";
      if (tracking.current) {
        document.body.style.cursor = "col-resize";
      }
    }
  }, [resizeData.atEdge, tracking.current]);

  const styleBorder = (e) => {
    if (handle) {
      handle.current.classList.remove("resize-handle");
      handle.current.classList.add("resize-handle-selected");
    }
  };

  const unstyleBorder = (e) => {
    if (!tracking.current) {
      handle.current.classList.add("resize-handle");
      handle.current.classList.remove("resize-handle-selected");
    }
  };

  const grabBorder = (e) => {
    document.body.classList.add("no-select");
    if (resizeData.atEdge) {
      document.body.style.cursor = "e-resize";
    } else {
      document.body.style.cursor = "col-resize";
    }
    handle.current.classList.remove("resize-handle");
    handle.current.classList.add("resize-handle-selected");

    setResizeData({
      ...resizeData,
      startWidth: sidebarMain.current.offsetWidth,
      startCursorScreenX: e.clientX,
      resizeTarget: sidebarMain.current,
      parentElement: sidebarContainer.current,
      atEdge: false,
    });
    tracking.current = true;
  };

  const releaseBorder = () => {
    document.body.style.cursor = "default";
    document.body.classList.remove("no-select");
    if (handle && tracking.current) {
      handle.current.classList.add("resize-handle");
      handle.current.classList.remove("resize-handle-selected");
      const tempData = { ...resizeData };
      setResizeData(tempData);
    }
    unstyleBorder();
    tracking.current = false;
  };

  const listenForMouseUp = (e) => {
    document.removeEventListener("mouseup", listenForMouseUp);
    if (tracking.current) {
      tracking.current = false;
      releaseBorder(e);
    }
  };

  const moveBorder = (e) => {
    const tempResizeData = { ...resizeData };
    if (tracking.current) {
      const cursorScreenXDelta = e.clientX - tempResizeData.startCursorScreenX;
      const newWidth = tempResizeData.startWidth + cursorScreenXDelta + 75;
      console.log("cursor start", tempResizeData.startCursorScreenX);
      console.log("cursor change", cursorScreenXDelta);
      console.log("new width", newWidth);
      if (newWidth <= 100) {
        tempResizeData.resizeTarget.parentNode.style.width = "67px";
        tempResizeData.atEdge = true;
      } else {
        tempResizeData.resizeTarget.parentNode.style.width = `${newWidth}px`;
        tempResizeData.atEdge = false;
      }
      document.addEventListener("mouseup", listenForMouseUp);
      setResizeData(tempResizeData);
    }
  };

  return (
    <div className="container" onMouseMove={moveBorder}>
      <MemoizedChannels
        grabBorder={grabBorder}
        releaseBorder={releaseBorder}
        resizeData={resizeData}
        styleBorder={styleBorder}
        unstyleBorder={unstyleBorder}
        handle={handle}
        sidebarMain={sidebarMain}
        sidebarContainer={sidebarContainer}
      />
      <Outlet />
    </div>
  );
}
