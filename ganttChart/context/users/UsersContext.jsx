import React, { createContext, useReducer, useEffect } from "react";
import useSWR from "swr";

import UsersReducer from "./UsersReducer";

export const UsersContext = createContext();

export function UsersProvider(props) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(`/api/auth/`, fetcher);
  useEffect(() => {
    if (!error && data) {
      if (data.message == "ok") {
        dispatch({
          type: "SET_USER",
          payload: data.user,
        });
      }
    }
  }, [data, error]);

  const [usersState, dispatch] = useReducer(UsersReducer, {
    id: "",
    name: "",
    password: "",
    isUserLoaded: false,
  });
  const { id, name, password, isUserLoaded } = usersState;

  const setUser = (user) => {
    dispatch({
      type: "SET_USER",
      payload: user,
    });
  };

  return (
    <UsersContext.Provider
      value={{
        id,
        name,
        password,
        setUser,
        isUserLoaded,
      }}
    >
      {props.children}
    </UsersContext.Provider>
  );
}
