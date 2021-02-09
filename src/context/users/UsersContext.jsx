import React, { createContext, useReducer, useEffect, useContext } from "react";
import useSWR from "swr";
import Router from "next/router";
import { xhr } from "@/helpers/xhr";

import UsersReducer from "@/src/context/users/UsersReducer";

export const UsersContext = createContext();

export function UsersProvider(props) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(`/api/auth/`, fetcher);
  useEffect(async () => {
    if (!error && data) {
      if (data.message == "ok") {
        dispatch({
          type: "SET_USER",
          payload: data.user,
        });
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

  const signup = async (user) => {
    try {
      const res = await xhr("/auth/signup", user, "POST");
      return res;
    } catch (e) {}
  };

  const login = async (user) => {
    try {
      const res = await xhr("/auth/login", user, "POST");
      return res;
    } catch (e) {}
  };

  const updateUser = async (user) => {
    try {
      const res = await xhr("/auth/update", user, "PUT");
      return res;
    } catch (e) {}
  };

  const deleteUser = async () => {
    try {
      await xhr("/auth/delete", {}, "DELETE");
    } catch (e) {}
  };

  return (
    <UsersContext.Provider
      value={{
        _id,
        name,
        password,
        isUserLoaded,
        setUser,
        signup,
        login,
        updateUser,
        deleteUser,
      }}
    >
      {props.children}
    </UsersContext.Provider>
  );
}
