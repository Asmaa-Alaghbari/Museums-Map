import "../css/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../security/AuthContext";

function Register() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const authContext = useAuth();

  function handleUsernameOrEmailChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await authContext.register(username, password);

    if (result === true) {
      navigate("/login");
    }
  }

  return (
    <div
      className="gradient-custom "
      style={{ height: "920px", width: "100%" }}
    >
      <div className="container py-5 ">
        <div className="row d-flex justify-content-center align-items-center mt-5 ">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Museum Map - sign up</h2>
                  <p className="text-white-50 mb-5">
                    Please enter your username and password to sign up!
                  </p>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="email"
                      id="typeEmailX"
                      className="form-control form-control-lg"
                      value={username}
                      onChange={handleUsernameOrEmailChange}
                      placeholder="Username"
                    />
                    {/* <label className="form-label" for="typeEmailX">
                      Username
                    </label> */}
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      id="typePasswordX"
                      className="form-control form-control-lg"
                      onChange={handlePasswordChange}
                      placeholder="Password"
                    />
                    {/* <label className="form-label" for="typePasswordX">
                      Password
                    </label> */}
                  </div>

                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Sign up
                  </button>
                </div>
                <div>
                  <p className="mb-0">
                    Already have an account?
                  </p>
                  <a
                    href="#!"
                    className="text-white-50 fw-bold"
                    onClick={() => navigate("/login")}
                  >
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

export default Register;
