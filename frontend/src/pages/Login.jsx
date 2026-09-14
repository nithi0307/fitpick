import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

// Login / Sign Up screen. A single form toggles between the two modes
// so the user never leaves the page.
export default function Login() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="auth">
      <Card className="auth__card">
        <div className="auth__brand">
          <h1>FitPick</h1>
          <p>Digital Wardrobe &amp; Outfit Planner</p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" type="text" placeholder="Your name" required />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" required />
          </div>

          <Button type="submit" block>
            {mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>

        <p className="auth__switch">
          {mode === "login" ? "New to FitPick?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </Card>
    </div>
  );
}
