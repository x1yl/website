/**
 * Renders a gallery page with a responsive embedded Canva design framed within a styled container.
 *
 * The page features a centered "Gallery" header and adapts its background for light and dark themes. The embedded Canva content maintains a 16:9 aspect ratio and supports fullscreen viewing.
 */
export default function GalleryPage() {
  return (
    <div className=" bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
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
              willChange: "transform"
            }}
          >
            <iframe 
              loading="lazy" 
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                border: "none",
                padding: 0,
                margin: 0
              }}
              src="https://www.canva.com/design/DAGB-rSHQmc/_kOncHPgLCvEYUx03gZRUg/view?embed" 
              allowFullScreen
              allow="fullscreen"
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
