import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Markdown } from "~/utils/markdown";
import { SignInButton } from "~/app/_components/sign-in-button";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await api.event.getById({ id: params.id });

  if (!event) {
    notFound();
  }

  const isEventPast = event.eventTime < new Date();
  const attendeeCount = event.attendees.length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      {/* Header with back button */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 transition-colors dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/events"
            className="inline-flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Event Title and Share Button */}
        <div className="mb-8 flex items-start justify-between">
          <h1 className="max-w-4xl text-4xl font-bold text-gray-900 dark:text-white">
            {event.name}
          </h1>
          <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            Share Event
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Event Image and Details */}

          <div className="space-y-8 lg:col-span-2">
            {/* Event Image */}
            {event.imageURL ? (
              <div className="aspect-[16/9] overflow-hidden rounded-lg">
                <img
                  src={event.imageURL}
                  alt={event.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="hidden"></div>
            )}

            {/* Service Letters */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 transition-colors dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Service Letters:
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {event.serviceLetters
                  ? "Service letters are available for this event."
                  : "Service letters are not available for this event."}
              </p>
            </div>

            {/* Rewards */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 transition-colors dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Rewards:
              </h2>
              <div className="space-y-2">
                <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                  <ClockIcon className="mr-2 h-5 w-5" />
                  <span>Total Hours: {event.maxHours}</span>
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <StarIcon className="mr-2 h-5 w-5" />
                  <span>Total Points: {event.maxPoints}</span>
                </div>
              </div>
            </div>

            {/* Event Time */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 transition-colors dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Event Time:
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {event.eventTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {event.eventTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            {/* Location */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 transition-colors dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Location:
              </h2>
              <div className="mb-4 flex items-center text-teal-600 dark:text-teal-400">
                <MapPinIcon className="mr-2 h-5 w-5" />
                <Link
                  className="default"
                  href={encodeURI(
                    `https://www.google.com/maps/dir/?api=1&destination=${event.address}&travelmode=transit`,
                  )}
                  target="_blank"
                >
                  {event.address}
                </Link>
              </div>

              <iframe
                src={encodeURI(
                  `https://maps.google.com/maps?q=${event.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`,
                )}
                className="shadowed h-60 w-full rounded-xl"
              ></iframe>
            </div>
          </div>

          {/* Right Column - Event Details and Attendance */}
          <div className="space-y-6">
            {/* Event Details */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 transition-colors dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Event Details:
              </h2>
              <Markdown content={event.description} />

              {/* Event Steps (if any specific instructions) */}
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  Steps:
                </h3>
                <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>1. Register for the event</li>
                  <li>2. Check event details and location</li>
                  <li>3. Arrive on time at the specified location</li>
                  <li>4. Participate in the community service activity</li>
                  <li>5. Sign out to receive credit for participation</li>
                </ol>
              </div>
            </div>

            {/* Event Attendance */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 transition-colors dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Event Attendance:
              </h2>
              <div className="mb-6 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <UserGroupIcon className="mr-2 h-6 w-6 text-teal-600 dark:text-teal-400" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {attendeeCount}
                  </span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    {event.limit ? `/ ${event.limit}` : ""} registered
                  </span>
                </div>
                <div className="mb-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-teal-600 transition-all dark:bg-teal-500"
                    style={{
                      width: event.limit
                        ? `${(attendeeCount / event.limit) * 100}%`
                        : "100%",
                    }}
                  ></div>
                </div>
              </div>

              {isEventPast ? (
                <div className="text-center">
                  <p className="mb-4 text-gray-500 dark:text-gray-400">
                    This event has ended.
                  </p>
                  <div className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    Event Completed
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    You must be logged in and registered to view and edit event
                    attendance.
                  </p>
                  <SignInButton className="rounded-lg bg-teal-600 px-6 py-2 text-white transition-colors hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600">
                    Sign In
                  </SignInButton>
                </div>
              )}

            </div>

            {/* Event Status */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 transition-colors dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <div
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    isEventPast
                      ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      : event.closed
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {isEventPast
                    ? "Past Event"
                    : event.closed
                      ? "Registration Closed"
                      : "Open for Registration"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
