import { useState } from "react";
import { debounce, throttle } from "lodash";
import "./Channels.css";

const selectTarget = (fromElement, selector) => {
  if (!(fromElement instanceof HTMLElement)) {
    return null;
  } else {
    return fromElement.querySelector(selector);
  }
};

function Channels() {
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
    debounce((e) => {
      if (resizeData.tracking) {
        const cursorScreenXDelta = e.screenX - resizeData.startCursorScreenX;
        const newWidth = Math.min(
          resizeData.startWidth + cursorScreenXDelta,
          resizeData.maxWidth
        );
        resizeData.resizeTarget.style.width = `${newWidth}px`;
      }
      window.addEventListener("mouseup", (e) => {
        releaseBorder(e);
      });
    })(e);
  };

  const grabBorder = (e) => {
    document.body.style.cursor = "col-resize";

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

  const releaseBorder = () => {
    if (resizeData?.tracking) {
      document.body.style.cursor = "default";
      setResizeData({ ...resizeData, tracking: false });
    }
  };

  return (
    <div
      className="sidebar-container"
      // onMouseLeave={releaseBorder}
      onMouseMove={moveBorder}
    >
      <div className="sidebar-main">
        <h1>Channels</h1>
        <p>
          Hello and welcome to this world, and be cool to those that love you
        </p>
      </div>
      <div
        onMouseDown={grabBorder}
        // onMouseUp={releaseBorder}
        className="resize-handle"
        data-target=".sidebar-main"
      />
    </div>
  );
}

export default Channels;
