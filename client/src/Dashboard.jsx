import { logout } from "./services/authService";
import {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";
import "./App.css";
import MetricsChart from "./components/MetricsChart";
import ChatBot from "./components/ChatBot";

function Dashboard() {
  const [metrics,
    setMetrics] =
    useState(null);

  const [chartData,
    setChartData] =
    useState([]);

  const [showProfile,
    setShowProfile] =
    useState(false);

  const [darkMode,
    setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "theme"
        ) !== "light"
      );
    });

  const profileRef =
    useRef(null);

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  /* ==========================
     CLOSE PROFILE OUTSIDE CLICK
  ========================== */

  useEffect(() => {
    const handleClickOutside =
      (event) => {
        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target
          )
        ) {
          setShowProfile(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ==========================
     THEME
  ========================== */

  useEffect(() => {
    if (
      darkMode
    ) {
      document.body.classList.add(
        "dark-mode"
      );

      document.body.classList.remove(
        "light-mode"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.body.classList.add(
        "light-mode"
      );

      document.body.classList.remove(
        "dark-mode"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  /* ==========================
     FETCH METRICS
  ========================== */

  const fetchMetrics =
    async () => {
      try {
        const res =
          await axios.get(
            "https://pulse-ai-monitoring.onrender.com/api/metrics"
          );

        setMetrics(
          res.data
        );

        setChartData(
          (prev) => [
            ...prev.slice(
              -9
            ),
            {
              time:
                new Date().toLocaleTimeString(),
              cpu:
                parseFloat(
                  res.data
                    .cpuValue
                ) || 0,
            },
          ]
        );
      } catch (
        error
      ) {
        console.error(
          "Metrics Error:",
          error
        );
      }
    };

  useEffect(() => {
    fetchMetrics();

    const interval =
      setInterval(
        fetchMetrics,
        3000
      );

    return () =>
      clearInterval(
        interval
      );
  }, []);

  return (
    <div className="app">

      {/* HEADER */}
      <div className="dashboard-header">

        <h1 className="title">
          PulseAI Monitoring
        </h1>

        <div className="header-buttons">

          {/* THEME SWITCH */}
          <div
            className="theme-toggle"
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
          >
            <div
              className={`toggle-switch ${
                darkMode
                  ? "light"
                  : "dark"
              }`}
            >
              <div className="toggle-circle">
                {darkMode
                  ? "🌙"
                  : "☀️"}
              </div>
            </div>
          </div>

          {/* PROFILE */}
          <div
            className="profile-wrapper"
            ref={
              profileRef
            }
          >
            <button
              className="profile-btn"
              onClick={() =>
                setShowProfile(
                  !showProfile
                )
              }
            >
              👤
            </button>

            {showProfile && (
              <div className="profile-dropdown">

                <h3>
                  My Profile
                </h3>

                <div className="profile-row">
                  <strong>
                    Name
                  </strong>

                  <span>
                    {user?.name}
                  </span>
                </div>

                <div className="profile-row">
                  <strong>
                    Email
                  </strong>

                  <span>
                    {user?.email
                      ? user.email.replace(
                          /(.{3}).+(@.+)/,
                          "$1****$2"
                        )
                      : ""}
                  </span>
                </div>

                <div className="profile-row">
                  <strong>
                    Phone
                  </strong>

                  <span>
                    {user?.phone
                      ? `******${user.phone.slice(
                          -4
                        )}`
                      : "Not Added"}
                  </span>
                </div>

              </div>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              logout();

              window.location.href =
                "/login";
            }}
            className="logout-btn"
          >
            Logout
          </button>

        </div>
      </div>

      {/* CARDS */}
      <div className="card-grid">

        <div className="card">
          <h3>
            CPU Usage
          </h3>
          <p>
            {
              metrics?.cpuUsage
            }
          </p>
        </div>

        <div className="card">
          <h3>
            Total Memory
          </h3>
          <p>
            {
              metrics?.totalMemory
            }
          </p>
        </div>

        <div className="card">
          <h3>
            Used Memory
          </h3>
          <p>
            {
              metrics?.usedMemory
            }
          </p>
        </div>

        <div className="card">
          <h3>
            Free Memory
          </h3>
          <p>
            {
              metrics?.freeMemory
            }
          </p>
        </div>

        <div className="card">
          <h3>
            Uptime
          </h3>
          <p>
            {
              metrics?.uptime
            }
          </p>
        </div>

        <div className="card">
          <h3>
            Platform
          </h3>
          <p>
            {
              metrics?.platform
            }
          </p>
        </div>

        <div className="card">
          <h3>
            AI Status
          </h3>
          <p>
            {metrics
              ?.aiPrediction
              ?.status ||
              "healthy"}
          </p>
        </div>

        <div className="card">
          <h3>
            AI Confidence
          </h3>
          <p>
            {metrics
              ?.aiPrediction
              ?.confidence || 0}
            %
          </p>
        </div>

      </div>

      {/* DASHBOARD */}
      <div className="dashboard-container">

        <div className="left-section">

          <div className="prediction-card">
            <h2>
              🤖 AI Prediction
            </h2>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {metrics
                ?.aiPrediction
                ?.status ||
                "healthy"}
            </p>

            <p>
              <strong>
                Reason:
              </strong>{" "}
              {metrics
                ?.aiPrediction
                ?.reason ||
                "No anomaly pattern detected"}
            </p>
          </div>

          <div className="graph-card">
            <h2>
              📈 CPU Monitoring
            </h2>

            <p>
              Live system CPU
              usage
            </p>

            <div className="graph-wrapper">
              <MetricsChart
                data={
                  chartData
                }
              />
            </div>
          </div>
        </div>

        <div className="chat-section">
          <ChatBot
            metrics={
              metrics
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
