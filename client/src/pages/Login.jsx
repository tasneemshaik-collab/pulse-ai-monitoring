import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  loginUser,
} from "../services/authService";

function Login() {
  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] = useState({
    email: "",
    password: "",
    phone: "",
  });

  const [
    askPhone,
    setAskPhone,
  ] = useState(false);

  const handleChange = (
    e
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const user =
          await loginUser(
            formData
          );

        // Missing phone
        if (
          !user.phone
        ) {
          setAskPhone(
            true
          );
          return;
        }

        navigate("/");
      } catch (
        error
      ) {
        alert(
          error.response
            ?.data
            ?.message ||
            "Login failed"
        );
      }
    };

  return (
    <div className="auth-page">
      <div className="auth-box">

        <h1>
          🤖 PulseAI Login
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            required
          />

          {askPhone && (
            <input
              type="text"
              name="phone"
              placeholder="Enter Phone Number"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              required
            />
          )}

          <button
            type="submit"
          >
            {askPhone
              ? "Save Phone"
              : "Login"}
          </button>

        </form>

        <p>
          Don't have
          an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;