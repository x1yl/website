import { api } from "~/trpc/server";
import EventsList from "./_components/events-list";

/**
 * Asynchronously renders a responsive page displaying a grid of events fetched from the backend.
 *
 * Each event card shows event details, status (past or upcoming), and links to the event's detail page. If no events are available, an empty state message is displayed.
 */
export default async function EventsPage() {
  // Fetch real events from the database
  const { items: events, nextCursor } = await api.event.getAll({
    limit: 20, // Default limit as defined in the procedure
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 transition-colors dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Events
          </h1>
        </div>

        <EventsList initialEvents={events} initialNextCursor={nextCursor} />
      </div>
    </div>
  );
}
