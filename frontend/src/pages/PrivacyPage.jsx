import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function PrivacyPage() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <Navbar
        onSearch={() => {}}
        onClear={() => {}}
        user={user}
        onLoginClick={() => {}}
        onLogout={logout}
      />

      <div className="page-content legal-page">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="legal-section">
          <h2>What we collect</h2>
          <p>
            When you create an account, we store your name, username, email address, and a
            securely hashed version of your password (or, if you sign in with Google, your
            Google account ID and the name/email Google provides — we never see or store your
            Google password). If you upload a profile photo, a resized copy is stored against
            your account. If you save channels, we store the channel data you bookmark.
          </p>
        </section>

        <section className="legal-section">
          <h2>How we use it</h2>
          <p>
            Your account information is used solely to let you log in, keep your saved
            channels persistent across devices, and send you account-related emails
            (verification codes, password resets, and a one-time welcome message). We do
            not sell or share your personal data with third parties for advertising.
          </p>
        </section>

        <section className="legal-section">
          <h2>Third-party services</h2>
          <p>
            This site uses the YouTube Data API to fetch channel and playlist information,
            Google Sign-In for optional authentication, and an AI provider to generate
            playlist coverage/sentiment analysis when you request it. None of your account
            credentials are shared with these services beyond what's necessary for them to
            function (e.g., search queries you submit).
          </p>
        </section>

        <section className="legal-section">
          <h2>Your data, your control</h2>
          <p>
            You can remove any saved channel at any time from within the app. To request
            full account deletion, contact us at the email below.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Questions about this policy? Email <a href="mailto:hello@dockorbit.com">hello@dockorbit.com</a>.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}