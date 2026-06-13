import axios from "axios";

const API =
  "http://localhost:5000/api/auth";

export const registerUser =
  async (userData) => {
    const response =
      await axios.post(
        `${API}/register`,
        userData
      );

    if (response.data.token) {
      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data
        )
      );
    }

    return response.data;
  };

export const loginUser =
  async (userData) => {
    const response =
      await axios.post(
        `${API}/login`,
        userData
      );

    if (response.data.token) {
      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data
        )
      );
    }

    return response.data;
  };

export const logout = () => {
  localStorage.removeItem(
    "user"
  );
};