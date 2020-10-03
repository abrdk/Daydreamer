import React from "react";
import { GridBody } from "./grid-body";

export const Grid = props => {
  return (
    <g className="grid">
      <GridBody {...props} />
    </g>
  );
};
