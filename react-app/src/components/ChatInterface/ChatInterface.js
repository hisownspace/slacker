import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { Route, Switch } from "react-router-dom";
import Channels from "../Channels";
import Channel from "../Channel";
import "./ChatInterface.css";

const selectTarget = (fromElement, selector) => {
  if (!(fromElement instanceof HTMLElement)) {
    return null;
  } else {
    return fromElement.querySelector(selector);
  }
};

export default function ChatInterface(isLoaded) {
  const [resizeData, setResizeData] = useState({
    tracking: false,
    startWidth: null,
    startCursorScreenX: null,
    handleWidth: 25,
    resizeTarget: null,
    parentElement: null,
  });

  useEffect(() => {
    let handle = document.querySelector(".resize-handle");
    if (!handle) {
      handle = document.querySelector(".resize-handle-selected");
    }
    if (resizeData.atEdge) {
      handle.style.cursor = "e-resize";
      if (resizeData.tracking) {
        document.body.style.cursor = "e-resize";
      }
    } else {
      handle.style.cursor = "col-resize";
      if (resizeData.tracking) {
        document.body.style.cursor = "col-resize";
      }
    }
  }, [resizeData.atEdge, resizeData.tracking]);

  const styleBorder = (e) => {
    const handleElement = e.currentTarget;
    // if (resizeData?.tracking) {
    // handleElement.style.borderRight = "3px solid #44ACFD";
    // handleElement.style.marginRight = "1px";
    handleElement.classList.remove("resize-handle");
    handleElement.classList.add("resize-handle-selected");
    // }
  };

  const unstyleBorder = (e) => {
    const handleElement = e.currentTarget;
    if (!resizeData?.tracking) {
      // handleElement.style.borderRight = "1px solid lightgrey";
      // handleElement.style.marginRight = "3px";
      handleElement.classList.add("resize-handle");
      handleElement.classList.remove("resize-handle-selected");
    }
  };

  const grabBorder = (e) => {
    document.body.classList.add("no-select");
    if (resizeData.atEdge) {
      document.body.style.cursor = "e-resize";
    } else {
      document.body.style.cursor = "col-resize";
    }

    let handleElement = document.querySelector(".resize-handle");
    if (!handleElement) {
      handleElement = document.querySelector(".resize-handle-selected");
    }
    // handleElement.style.borderRight = "3px solid #44ACF";
    handleElement.classList.remove("resize-handle");
    handleElement.classList.add("resize-handle-selected");

    const targetSelector = handleElement.getAttribute("data-target");

    const targetElement = selectTarget(
      handleElement.parentElement,
      targetSelector,
    );

    setResizeData({
      ...resizeData,
      startWidth: targetElement.offsetWidth,
      startCursorScreenX: e.screenX,
      resizeTarget: targetElement,
      parentElement: handleElement.parentElement,
      tracking: true,
      atEdge: false,
    });
  };

  const releaseBorder = () => {
    document.body.style.cursor = "default";
    document.body.classList.remove("no-select");
    let handleElement = document.querySelector(".resize-handle");
    if (!handleElement) {
      handleElement = document.querySelector(".resize-handle-selected");
    }
    if (handleElement) {
      handleElement.classList.add("resize-handle");
      handleElement.classList.remove("resize-handle-selected");
      setResizeData({ ...resizeData, tracking: false });
    }
  };

  const moveBorder = (e) => {
    const tempResizeData = { ...resizeData };
    if (tempResizeData.tracking) {
      const cursorScreenXDelta = e.screenX - tempResizeData.startCursorScreenX;
      const newWidth =
        (tempResizeData.startWidth + (cursorScreenXDelta - 100)) * 2.5 + 45;
      if (newWidth <= 50) {
        tempResizeData.resizeTarget.style.width = "0px";
        tempResizeData.atEdge = true;
      } else {
        tempResizeData.resizeTarget.style.width = `${newWidth}px`;
        tempResizeData.atEdge = false;
      }
    }
    window.addEventListener("mouseup", (e) => {
      releaseBorder(e);
    });
    setResizeData(tempResizeData);
  };
  return (
    <div className="container" onMouseMove={moveBorder}>
      <Channels
        moveBorder={moveBorder}
        grabBorder={grabBorder}
        releaseBorder={releaseBorder}
        resizeData={resizeData}
        isLoaded={isLoaded}
        styleBorder={styleBorder}
        unstyleBorder={unstyleBorder}
      />
      <Switch>
        <Route path="/client/channels/:channelId">
          <Channel />
        </Route>
      </Switch>
    </div>
  );
}
