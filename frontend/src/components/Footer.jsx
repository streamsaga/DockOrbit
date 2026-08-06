import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand-col">
          <Link to="/" className="footer-brand">DockOrbit</Link>
          <p className="footer-tagline">
            Find channels and playlists actually worth your time — ranked by real signal,
            not just subscriber count.
          </p>
        </div>

        <div className="footer-col">
          <span className="footer-col-heading">Explore</span>
          <Link to="/" className="footer-link">
            Channel Discovery
          </Link>
          <Link to="/playlists" className="footer-link">
            Playlist Finder
          </Link>
        </div>

        <div className="footer-col">
          <span className="footer-col-heading">Company</span>
          <Link to="/about" className="footer-link">
            About
          </Link>
          <Link to="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          <Link to="/terms" className="footer-link">
            Terms of Service
          </Link>
          <a href="mailto:hello@dockorbit.com" className="footer-link">
            Contact
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} DockOrbit. All rights reserved.</span>
        <span className="footer-attribution">
          Channel and playlist data provided by the YouTube Data API. Not affiliated with
          YouTube or Google.
        </span>
      </div>
    </footer>
  );
}