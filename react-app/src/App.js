import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { authenticate } from "./store/session";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import Navigation from "./components/Navigation";
import Channel from "./components/Channel";
import Channels from "./components/Channels";
import Workspaces from "./components/Workplaces";
// import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // useEffect(() => {
  //   (async () => {
  //     await dispatch(authenticate());
  //     setIsLoaded(true);
  //   })();
  // }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <div className="content">
          <Switch>
            <Route path="/client">
              <ChatInterface isLoaded={isLoaded} />
            </Route>
            <Route path="/login">
              <LoginFormPage />
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
          </Switch>
        </div>
      )}
    </>
  );
}

export default App;
