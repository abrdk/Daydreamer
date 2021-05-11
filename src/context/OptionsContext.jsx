import React, { createContext, useState } from "react";

export const OptionsContext = createContext();

export function OptionsProvider(props) {
  const [view, setView] = useState("Day");
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [isCalendarScrollLock, setIsCalendarScrollLock] = useState(false);

  return (
    <OptionsContext.Provider
      value={{
        view,
        isMenuOpened,
        setView,
        setIsMenuOpened,
        isCalendarScrollLock,
        setIsCalendarScrollLock,
      }}
    >
      {props.children}
    </OptionsContext.Provider>
  );
}
