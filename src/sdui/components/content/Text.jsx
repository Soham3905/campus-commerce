import React from "react";

export const Text = ({ data = {}, style }) => (
  <span style={style}>{data?.text}</span>
);
