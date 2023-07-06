import { useState } from "react";
import { debounce, throttle } from "lodash";
import "./Sidebar.css";

const selectTarget = (fromElement, selector) => {
  if (!(fromElement instanceof HTMLElement)) {
    return null;
  } else {
    return fromElement.querySelector(selector);
  }
};

function Sidebar() {
  const [resizeData, setResizeData] = useState({
    tracking: false,
    startWidth: null,
    startCursorScreenX: null,
    handleWidth: 10,
    resizeTarget: null,
    parentElement: null,
    maxWidth: null,
  });

  const moveBorder = (e) => {
    // debounce((e) => {
    if (resizeData.tracking) {
      const cursorScreenXDelta = e.screenX - resizeData.startCursorScreenX;
      const newWidth = Math.min(
        resizeData.startWidth + cursorScreenXDelta,
        resizeData.maxWidth
      );
      resizeData.resizeTarget.style.width = `${newWidth}px`;
    }
    // });
  };

  const grabBorder = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const handleElement = e.currentTarget;

    const targetSelector = handleElement.getAttribute("data-target");

    const targetElement = selectTarget(
      handleElement.parentElement,
      targetSelector
    );

    setResizeData({
      ...resizeData,
      startWidth: targetElement.offsetWidth,
      startCursorScreenX: e.screenX,
      resizeTarget: targetElement,
      parentElement: handleElement.parentElement,
      maxWidth: handleElement.parentElement.offsetWidth,
      tracking: true,
    });
  };

  const releaseBorder = (e) => {
    if (resizeData?.tracking) {
      setResizeData({ ...resizeData, tracking: false });
    }
  };

  return (
    <div
      className="sidebar-container"
      onMouseLeave={releaseBorder}
      onMouseMove={moveBorder}
    >
      <div className="sidebar-main">
        <h1>Workspaces/Channels</h1>
      </div>
      <div
        onMouseDown={grabBorder}
        onMouseUp={releaseBorder}
        className="resize-handle"
        data-target=".sidebar-main"
      />
    </div>
  );
}

export default Sidebar;
