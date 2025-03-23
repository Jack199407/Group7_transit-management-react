import React from "react";
import { Navigate } from "react-router-dom";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
    };
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({ logout: true });
  };

  render() {
    if (this.state.logout) {
      return <Navigate to="/" />;
    }

    return (
      <div>
        <h2>后台管理页面</h2>
        <button onClick={this.handleLogout}>退出登录</button>
      </div>
    );
  }
}

export default Dashboard;
