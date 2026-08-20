import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChannelDiscoveryPage from "./pages/ChannelDiscoveryPage.jsx";
import PlaylistFinderPage from "./pages/PlaylistFinderPage.jsx";
import LinkCheckerPage from "./pages/LinkCheckerPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import BackgroundDecor from "./components/BackgroundDecor.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useBookmarks } from "./hooks/useBookmarks.js";

export default function App() {
  const { bookmarks } = useBookmarks();

  return (
    <BrowserRouter>
      <BackgroundDecor />
      <Routes>
        <Route path="/" element={<ChannelDiscoveryPage />} />
        <Route path="/playlists" element={<PlaylistFinderPage />} />
        <Route path="/check" element={<LinkCheckerPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
      <BottomNav savedCount={bookmarks.length} />
    </BrowserRouter>
  );
}