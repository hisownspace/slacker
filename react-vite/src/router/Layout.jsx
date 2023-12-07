import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { ModalProvider, Modal } from "../context/Modal";
import { authenticate } from "../store/session";
import Navigation from "../components/Navigation";

const Layout = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setIsLoaded(true);
    })();
  }, [dispatch]);

  return (
    <ModalProvider>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
      <Modal />
    </ModalProvider>
  );
};

export default Layout;
