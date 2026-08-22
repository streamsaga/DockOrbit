import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "yt-discovery:token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid session");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // remember=true (default, same as previous behavior) persists the
  // session across browser restarts via localStorage. remember=false
  // uses sessionStorage instead, so the session clears when the tab
  // closes - this is what the "Remember me" checkbox controls.
  function applySession(data, remember = true) {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }

  // Signup no longer logs the user in directly - it creates an
  // unverified account and emails a code. Returns the parsed response
  // so the modal can move to the "enter code" step.
  // Accepts the full 3-step wizard payload: name, username, email,
  // password, avatarDataUrl (a resized profile photo as a base64 data
  // URL, or null), and favoriteCategory (or null).
  async function signup({ name, username, email, password, avatarDataUrl, favoriteCategory }) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password, avatarDataUrl, favoriteCategory }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    return data; // { requiresVerification: true, email }
  }

  async function checkUsernameAvailable(username) {
    const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    return data.available === true;
  }

  // Confirms the OTP sent after signup and logs the user in.
  async function verifySignupOtp(email, code) {
    const res = await fetch("/api/auth/verify-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Verification failed");
    applySession(data);
    return data;
  }

  async function resendOtp(email, purpose) {
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not resend code");
    return data;
  }

  async function login(email, password, remember = true) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      // Surface the "needs verification" case distinctly so the modal
      // can offer to resend the code / jump to the verify step.
      if (data.requiresVerification) {
        const err = new Error(data.error || "Please verify your email");
        err.requiresVerification = true;
        err.email = data.email;
        throw err;
      }
      throw new Error(data.error || "Login failed");
    }

    applySession(data, remember);
  }

  async function forgotPassword(email) {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not send reset code");
    return data;
  }

  async function resetPassword(email, code, newPassword) {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Password reset failed");
    return data;
  }

  async function loginWithGoogle(credential) {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Google sign-in failed");

    // New account (or an old unverified one) created via Google - no
    // token yet, needs the same OTP verification step as a normal
    // signup. Return this to the caller instead of logging in.
    if (data.requiresVerification) {
      return data; // { requiresVerification: true, email }
    }

    applySession(data);
    return data;
  }

  async function updateInterests(interests) {
    if (!token) return;
    const res = await fetch("/api/auth/interests", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ interests }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update interests");
    setUser((prev) => ({ ...prev, interests: data.user?.interests || interests }));
    return data;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        checkUsernameAvailable,
        verifySignupOtp,
        resendOtp,
        login,
        forgotPassword,
        resetPassword,
        loginWithGoogle,
        updateInterests,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}