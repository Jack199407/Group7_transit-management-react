import React, { Component, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Login.css";

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
        if (data.success && data.data) {
          this.props.login(data.data);
          this.props.navigate("/management");
        } else {
          this.setState({ error: data.error || "Login failed" });
        }
      })
      .catch(() => {
        this.setState({ error: "Server error" });
      });
  };

  handleSignUp = () => {
    this.props.navigate("/signup");
  };

  render() {
    const { name, password, error } = this.state;

    return (
      <div className="login-container">
        <h2>Welcome to Transit Management!</h2>
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
          <button type="submit">Log In</button>
        </form>
        {error && <p className="error">{error}</p>}

        <button onClick={this.handleSignUp} className="signup-button">
          Sign Up
        </button>
      </div>
    );
  }
}

function WithNavigate(props) {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  return <Login {...props} navigate={navigate} login={login} />;
}

export default WithNavigate;
