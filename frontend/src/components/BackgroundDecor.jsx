// BackgroundDecor.jsx
//
// Soft, softly-blurred decorative blobs sitting fixed behind all page
// content. Purely visual - no interaction, no layout impact (fixed +
// pointer-events: none + negative z-index). Colors pull from the same
// palette as everything else (accent + trust tones at low opacity) so
// it feels like part of the same illustrated world rather than a
// generic gradient background.

export default function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden="true">
      <span className="bg-blob bg-blob-1" />
      <span className="bg-blob bg-blob-2" />
      <span className="bg-blob bg-blob-3" />
      <span className="bg-blob bg-blob-4" />
    </div>
  );
}