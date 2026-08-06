import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AboutPage() {
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
        <h1 className="legal-title">About DockOrbit</h1>

        <section className="legal-section">
          <h2>What this is</h2>
          <p>
            YouTube shows you what's popular. DockOrbit shows you what's actually good.
            We analyze channels and playlists on real signal — engagement, upload
            consistency, subscriber authenticity, topic coverage, and student sentiment —
            instead of just ranking by subscriber count.
          </p>
        </section>

        <section className="legal-section">
          <h2>Channel Discovery</h2>
          <p>
            Browse by category or search any topic to find YouTube channels ranked by a
            transparent Trust Score. Every score comes with a full breakdown — engagement,
            consistency, authenticity, and longevity — so you can see exactly why a channel
            was rated the way it was, not just trust a black-box number.
          </p>
        </section>

        <section className="legal-section">
          <h2>Playlist Finder</h2>
          <p>
            Searching for a course on a specific topic — programming, exam prep, a new
            skill? Playlist Finder ranks YouTube playlists by topic coverage, teaching
            engagement, recency, and completeness, and can run an AI analysis to show
            covered vs. missing subtopics and real student sentiment pulled from comments.
          </p>
        </section>

        <section className="legal-section">
          <h2>How scoring works</h2>
          <p>
            Our scores are built from publicly available YouTube data — view counts, like
            ratios, upload frequency, channel age — combined into a weighted, explainable
            formula. Nothing is scored based on payment, sponsorship, or manual curation.
          </p>
        </section>

        <section className="legal-section">
          <h2>Get in touch</h2>
          <p>
            Questions, feedback, or found something off with a score? Email us at{" "}
            <a href="mailto:hello@dockorbit.com">hello@dockorbit.com</a>.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}