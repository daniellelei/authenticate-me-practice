// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import SpotsIndex from './components/SpotsIndex/index'
import SingleSpot from "./components/SingleSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Switch>
          <Route exact path = '/api/spots'>
            <SpotsIndex />
          </Route>
          <Route path = '/api/spots/:spotId'>
            <SingleSpot />
          </Route>
          <Route>
            Page Not Found
          </Route>
      </Switch>
    </>
  );
}

export default App;