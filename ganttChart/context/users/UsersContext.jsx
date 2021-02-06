import React, { createContext, useReducer, useEffect } from "react";
import useSWR from "swr";
import Router from "next/router";

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
        if (Router.pathname != "/gantt/[id]") {
          Router.push("/gantt/new");
        }
      } else {
        dispatch({
          type: "SET_USER",
          payload: { _id: "", name: "", password: "" },
        });
        if (Router.pathname != "/signup" && Router.pathname != "/login") {
          Router.push("/signup");
        }
      }
    }
  }, [data, error]);

  const [usersState, dispatch] = useReducer(UsersReducer, {
    _id: "",
    name: "",
    password: "",
    isUserLoaded: false,
  });
  const { _id, name, password, isUserLoaded } = usersState;

  const setUser = (user) => {
    dispatch({
      type: "SET_USER",
      payload: user,
    });
  };

  return (
    <UsersContext.Provider
      value={{
        _id,
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
