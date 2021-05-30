/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  console.log("user", user);
  const logoutHandler = () => {
    axios
      .post(`${USER_SERVER}/logout`, {}, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          props.history.push("/login");
        } else {
          alert("Log Out Failed");
        }
      });
  };

  if (!user.userData) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          <a href="/video/upload">
            <img
              src="https://github.com/jaewonhimnae/react-youtube-clone/blob/master/client/src/assets/images/upload.png?raw=true"
              alt="upload"
            />
          </a>
        </Menu.Item>
        <Menu.Item key="subscription">
          <a href="/subscription">Subscription</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
