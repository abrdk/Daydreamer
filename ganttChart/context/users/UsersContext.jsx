import * as cookie from "cookie";
const jwt = require("jsonwebtoken");

import React, { createContext, useReducer, useEffect } from "react";
import UsersReducer from "./UsersReducer";

export const UsersContext = createContext();

export function UsersProvider(props) {
  const [usersState, dispatch] = useReducer(UsersReducer, {
    id: "",
    name: "",
    password: "",
    token: "",
    isUserLoaded: false,
  });

  const { id, name, password, token, isUserLoaded } = usersState;

  const loadUser = () => {
    let user;

    try {
      const token = cookie.parse(document.cookie).ganttToken;
      user = jwt.verify(token, "jwtSecret");
    } catch (e) {}

    if (user) {
      dispatch({
        type: "SET_USER",
        payload: {
          token,
          id: user.id,
          name: user.name,
          password: user.password,
        },
      });
    }
  };

  const setUser = (user) => {
    dispatch({
      type: "SET_USER",
      payload: user,
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        id,
        name,
        password,
        token,
        setUser,
        isUserLoaded,
      }}
    >
      {props.children}
    </UsersContext.Provider>
  );
}
