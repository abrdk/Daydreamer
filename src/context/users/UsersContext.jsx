import React, { createContext } from "react";
import { useRouter } from "next/router";
import { xhr } from "@/helpers/xhr";
import useSWR from "swr";

export const UsersContext = createContext();

export function UsersProvider(props) {
  const router = useRouter();

  const loadUser = async (url) => {
    try {
      const res = await xhr(url, {}, "GET");
      if (res.message == "TokenExpiredError") {
        throw new Error("TokenExpiredError");
      }
      return res;
    } catch (e) {}
  };

  const { data: user, error, mutate: mutateUser } = useSWR("/auth", loadUser, {
    onError(err) {
      if (err.message == "TokenExpiredError") {
        router.push("/signup");
      }
    },
  });

  const signup = async (user) => {
    try {
      return await xhr("/auth/signup", user, "POST");
    } catch (e) {}
  };

  const login = async (user) => {
    try {
      return await xhr("/auth/login", user, "POST");
    } catch (e) {}
  };

  const updateUser = async (user) => {
    try {
      return await xhr("/auth/update", user, "PUT");
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
        _id: user ? user._id : "",
        name: user ? user.name : "",
        password: user ? user.password : "",
        isUserLoaded: !error && user,
        signup,
        login,
        updateUser,
        deleteUser,
        mutateUser,
      }}
    >
      {props.children}
    </UsersContext.Provider>
  );
}
