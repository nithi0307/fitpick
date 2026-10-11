import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import HeroArt from "../components/HeroArt";
import Icon, { GoogleMark } from "../components/Icon";

/**
 * Login / Sign Up.
 *
 * One form serves both modes so the user never leaves the page. This version
 * has no real authentication yet: submitting takes the user to the dashboard.
 */
export default function Login() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const isSignUp = mode === "signup";

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="auth">
      <div className="auth__panel">
        <div className="brand" style={{ padding: 0 }}>
          <span className="brand__mark">
            <Icon name="sparkle" size={15} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="brand__name">FitPick</span>
        </div>

        <div className="auth__form">
          <h1 className="auth__title">{isSignUp ? "Create your account" : "Welcome back"}</h1>
          <p className="auth__sub">
            {isSignUp ? "Start building your digital wardrobe" : "Sign in to your wardrobe"}
          </p>

          <button className="oauth" type="button">
            <GoogleMark size={17} />
            Continue with Google
          </button>

          <div className="divider">or</div>

          <form className="form-grid" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="field">
                <label className="field__label" htmlFor="name">Full name</label>
                <input id="name" type="text" placeholder="Jamie Anderson" required />
              </div>
            )}

            <div className="field">
              <label className="field__label" htmlFor="email">Email address</label>
              <input id="email" type="email" placeholder="jamie@email.com" required />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="password">
                Password
                {!isSignUp && (
                  <a className="auth__link" href="#forgot" style={{ float: "right", textTransform: "none", letterSpacing: 0 }}>
                    Forgot?
                  </a>
                )}
              </label>
              <input id="password" type="password" placeholder="••••••••••" required />
            </div>

            <Button type="submit" size="lg" block>
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <p style={{ textAlign: "center", marginTop: 18, fontSize: 12.5, color: "var(--muted)" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="auth__link"
              onClick={() => setMode(isSignUp ? "login" : "signup")}
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>

        <p className="auth__foot">© 2025 FitPick · Privacy · Terms</p>
      </div>

      <div className="hero">
        <HeroArt />
        <div className="hero__shade" />
        <div className="hero__text">
          <span className="hero__badge">
            <Icon name="sparkle" size={12} fill="currentColor" strokeWidth={0} />
            Your personal style, curated
          </span>
          <h2 className="hero__title">
            Dress with
            <br />
            intention every day
          </h2>
          <p className="hero__body">
            Organise your wardrobe, plan outfits, and track your style — all in one place.
          </p>
          <div className="hero__facts">
            <span className="hero__fact"><i /> 100+ Brands</span>
            <span className="hero__fact"><i /> Smart Outfits</span>
            <span className="hero__fact"><i /> Style Stats</span>
          </div>
        </div>
      </div>
    </div>
  );
}
