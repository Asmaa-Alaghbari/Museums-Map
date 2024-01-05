// Register.js

import "../css/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../security/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authContext = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }
    const result = await authContext.register(username, password);

    if (result === true) {
      navigate("/login");
    } else {
      alert("Error during registration");
    }
  }

  return (
    <div className="gradient-custom" style={{ height: "920px", width: "100%" }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center mt-5">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">
                <form onSubmit={handleSubmit} className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Museum Map - Sign Up</h2>
                  <p className="text-white-50 mb-5">Please enter your username and password to sign up!</p>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      id="typeEmailX"
                      className="form-control form-control-lg"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      id="typePasswordX"
                      className="form-control form-control-lg"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                  </div>

                  <button className="btn btn-outline-light btn-lg px-5" type="submit">
                    Sign Up
                  </button>
                </form>

                <div>
                  <p className="mb-0">Already have an account?</p>
                  <a href="#!" className="text-white-50 fw-bold" onClick={() => navigate("/login")}>
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
