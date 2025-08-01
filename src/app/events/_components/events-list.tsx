"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

type Event = RouterOutputs["event"]["getAll"]["items"][0];

interface EventsListProps {
  initialEvents: Event[];
  initialNextCursor?: string;
}

export default function EventsList({
  initialEvents,
  initialNextCursor,
}: EventsListProps) {
  const [events, setEvents] = useState(initialEvents);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const utils = api.useUtils();

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const data = await utils.event.getAll.fetch({
        limit: 20,
        cursor: nextCursor,
      });

      setEvents((prev) => [...prev, ...data.items]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Failed to load more events:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <>
      {/* Events Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const isEventPast = event.eventTime < new Date();
          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className={`block overflow-hidden rounded-xl bg-white shadow-sm ring-1 transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-800 ${
                isEventPast
                  ? "opacity-90 ring-gray-200 dark:ring-gray-600"
                  : "ring-blue-200 dark:ring-blue-700"
              }`}
            >
              <div>
                {/* Event Status Badge */}
                <div className="relative">
                  {isEventPast ? (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-5.5 py-0.5 text-xs font-medium text-gray-800">
                        Past Event
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-5.5 py-0.5 text-xs font-medium text-gray-800">
                        Upcoming Event
                      </span>
                    </div>
                  )}
                  {/* Event Image */}
                  <div className="aspect-[16/9]">
                    {event.imageURL ? (
                      <Image
                        src={event.imageURL}
                        alt={event.name}
                        width={400}
                        height={225}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-teal-400 to-emerald-500">
                        <div className="flex h-full items-center justify-center text-white">
                          <svg
                            className="h-12 w-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                      {event.name}
                    </h4>
                    {/*<p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {event.description.replace(/[#*]/g, '').slice(0, 150)}...
                </p>*/}
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {event.eventTime.toLocaleDateString()} at{" "}
                      {event.eventTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.address}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {event.maxHours} hours
                      </div>
                    </div>

                    {/* Points Badge */}
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      {event.maxPoints} points available
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <div
                      className={`w-full rounded-md px-4 py-2 text-center text-sm font-semibold shadow-sm transition-colors duration-200 ${
                        event.closed
                          ? "bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                          : "bg-default hover:bg-default-darker text-white"
                      }`}
                    >
                      {event.closed ? "Event Closed" : "View Event Details"}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Show More Button */}
      {nextCursor && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-default hover:bg-default-darker focus-visible:outline-default dark:bg-default-darker dark:hover:bg-default inline-flex items-center rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Show More Events
              </>
            )}
          </button>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No events scheduled
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Check back soon for upcoming events!
          </p>
        </div>
      )}
    </>
  );
}
