import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  registerUser,
} from "../services/authService";

function Register() {
  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

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
        await registerUser(
          formData
        );

        navigate("/");
      } catch (
        error
      ) {
        alert(
          error.response
            ?.data
            ?.message ||
            "Register failed"
        );
      }
    };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>
          🤖 PulseAI Register
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
            required
          />

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
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={
              formData.phone
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

          <button
            type="submit"
          >
            Register
          </button>
        </form>

        <p>
          Already have
          an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;