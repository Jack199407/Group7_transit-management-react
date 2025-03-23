import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"; // 黑金风格 CSS

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      role: "0", // 默认 Manager -> 0
      error: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, role } = this.state;
    const payload = { name, email, password, role: parseInt(role) };

    fetch("http://localhost:8080/signup", {
      // 用 signup 接口
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.props.navigate("/login"); // 注册成功跳转登录
        } else {
          this.setState({ error: "server error" });
        }
      })
      .catch(() => {
        this.setState({ error: "server error" });
      });
  };

  render() {
    const { name, email, password, role, error } = this.state;

    return (
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={this.handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={this.handleChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            required
          />
          <label>Role</label>
          <select name="role" value={role} onChange={this.handleChange}>
            <option value="0">Manager</option>
            <option value="1">Operator</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }
}

function WithNavigate(props) {
  const navigate = useNavigate();
  return <SignUp {...props} navigate={navigate} />;
}

export default WithNavigate;
