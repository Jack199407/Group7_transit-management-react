import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // 黑金风格 CSS

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      error: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, password } = this.state;
    const payload = { name, password };

    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.props.navigate("/management"); // 路由跳转
        } else {
          this.setState({ error: data.error });
        }
      })
      .catch(() => {
        this.setState({ error: "server error" });
      });
  };

  // 新增跳转注册页面的方法
  handleSignUp = () => {
    this.props.navigate("/signup");
  };

  render() {
    const { name, password, error } = this.state;

    return (
      <div className="login-container">
        <h2>Welcom to Transit Management!</h2>
        <form onSubmit={this.handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={this.handleChange}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            required
          />
          <button type="submit">Long In</button>
        </form>
        {error && <p className="error">{error}</p>}

        {/* Sign up按钮 */}
        <button onClick={this.handleSignUp} className="signup-button">
          Sign Up
        </button>
      </div>
    );
  }
}

function WithNavigate(props) {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}

export default WithNavigate;
