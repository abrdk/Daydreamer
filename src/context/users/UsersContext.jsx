import React, { createContext, useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import { xhr } from "@/helpers/xhr";

import UsersReducer from "@/src/context/users/UsersReducer";

export const UsersContext = createContext();

export function UsersProvider(props) {
  const router = useRouter();
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

  const loadUser = async () => {
    try {
      const res = await xhr("/auth", {}, "GET");
      if (res.message == "ok") {
        setUser(res.user);
      } else {
        setUser({ _id: "", name: "", password: "" });
        if (res.message == "TokenExpiredError") {
          router.push("/signup");
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadUser();
  }, []);

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
