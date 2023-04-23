import React, { createContext, useReducer } from "react";

const getLoginFromLocal = () => {
  const details = localStorage.getItem("main-auth");
  return details && details !== "undefined"
    ? JSON.parse(details)
    : { is_authenticated: false };
  // return {
  //   is_authenticated: true,
  //   username: "Deva",
  //   companyFormattedName: "Sephora",
  //   companyUrl: process.env.REACT_APP_SEPHORA_API_ENDPOINT,
  // };
};

const initialState = {
  login: getLoginFromLocal(),
  allProducts: [],
  allusers: [],
};

export const ProjectContext = createContext(initialState);

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "updateLogin":
      state = { ...state, login: { ...payload, is_authenticated: true } };
      localStorage.setItem("main-auth", JSON.stringify(state.login));
      break;
    case "updateLogout":
      state = { ...state, login: { is_authenticated: false } };
      localStorage.clear();
      break;

    case "updateAllProducts":
      state = { ...state, allProducts: payload };
      break;
    case "updateAllUsers":
      state = { ...state, allUsers: payload };
      break;

    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
  return state;
};

const Context = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ProjectContext.Provider value={[state, dispatch]}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export default Context;
