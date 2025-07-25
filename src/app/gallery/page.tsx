/**
 * Renders a responsive gallery page with a styled header and an embedded Canva design.
 *
 * The page adapts to light and dark modes, features a prominent "Gallery" title, and displays the Canva content within a card-like container that maintains a 16:9 aspect ratio. If the embedded content fails to load, an error is logged to the console and fallback text is shown.
 *
 * @returns The React element representing the gallery page.
 */
export default function GalleryPage() {
  return (
    <div className="bg-gray-50 py-12 transition-colors dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Gallery
          </h1>
        </div>

        {/* Canva Embed */}
        <div className="w-full">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 0,
              paddingTop: "56.2500%",
              paddingBottom: 0,
              boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
              marginTop: "1.6em",
              marginBottom: "0.9em",
              overflow: "hidden",
              borderRadius: "8px",
              willChange: "transform",
            }}
          >
            <iframe
              loading="lazy"
              title="Gallery - Canva Design"
              onError={(e) =>
                console.error("Failed to load gallery content:", e)
              }
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                border: "none",
                padding: 0,
                margin: 0,
              }}
              src="https://www.canva.com/design/DAGB-rSHQmc/_kOncHPgLCvEYUx03gZRUg/view?embed"
              allowFullScreen
              allow="fullscreen"
            >
              <p>
                Your browser does not support iframes. Please visit the gallery
                directly.
              </p>
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
