import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function TermsPage() {
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
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="legal-section">
          <h2>Using this site</h2>
          <p>
            DockOrbit helps you discover YouTube channels and playlists using publicly
            available data and automated scoring. Trust scores, coverage percentages, and
            AI-generated summaries are estimates meant to help your decision-making — they
            are not guarantees of quality, accuracy, or a channel's trustworthiness in any
            legal sense.
          </p>
        </section>

        <section className="legal-section">
          <h2>Accounts</h2>
          <p>
            You're responsible for keeping your login credentials secure. You must provide
            accurate information when creating an account, and you may not use the service
            to abuse, scrape at scale, or attempt to circumvent rate limits or quotas.
          </p>
        </section>

        <section className="legal-section">
          <h2>Third-party content</h2>
          <p>
            All channel names, thumbnails, video titles, and playlist content displayed on
            this site belong to their original creators and YouTube/Google. We do not host,
            own, or claim rights to this content — we only link to it and analyze publicly
            available metadata.
          </p>
        </section>

        <section className="legal-section">
          <h2>No warranty</h2>
          <p>
            This service is provided "as is," without warranties of any kind. We do not
            guarantee uninterrupted availability, and scores/recommendations may change as
            underlying data or algorithms are updated.
          </p>
        </section>

        <section className="legal-section">
          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the site after
            changes means you accept the updated terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Questions? Email <a href="mailto:hello@dockorbit.com">hello@dockorbit.com</a>.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}