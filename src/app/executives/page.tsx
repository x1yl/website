import { api } from "~/trpc/server";
import { Markdown } from "~/utils/markdown";
import Image from "next/image";

/**
 * Displays a page listing current and alumni executives, grouped by graduation year, with profile details and contact options.
 *
 * Fetches executive data from the backend, determines the current academic year, and separates executives into current and alumni categories. Renders a responsive grid of executive cards with profile images, names, positions, graduation years, pronouns, and descriptions. Alumni are shown in a distinct section with a faded style. If no executives are available, an empty state message is displayed.
 */
export default async function ExecutivesPage() {
  // Fetch real executives from the database
  const executives = await api.exec.getAll();

  // Current date and academic year calculation
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // Academic year starts in September, so if we're before July, we're still in the previous academic year
  const academicYearCutoff =
    currentDate.getMonth() < 6 ? currentYear : currentYear + 1;

  // Separate current and alumni executives
  const currentExecutives = executives.filter(
    (exec) => exec.user.gradYear >= academicYearCutoff,
  );
  const alumniExecutives = executives.filter(
    (exec) => exec.user.gradYear < academicYearCutoff,
  );

  const getPositionTitle = (position: string) => {
    switch (position) {
      case "PRESIDENT":
        return "President";
      case "VICE_PRESIDENT":
        return "Vice President";
      case "EVENT_COORDINATOR":
        return "Event Coordinator";
      case "SECRETARY":
        return "Secretary";
      case "TREASURER":
        return "Treasurer";
      default:
        return position;
    }
  };

  const getDisplayName = (preferredName: string, actualName: string) => {
    if (preferredName === actualName) {
      return preferredName;
    }
    return `${preferredName} (${actualName})`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 transition-colors dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Meet Our Executive Team
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Dedicated leaders working to create an amazing community experience
          </p>
        </div>

        {/* Current Executives Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {currentExecutives.map((exec) => (
            <div
              key={exec.email}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-lg hover:ring-gray-300 dark:bg-gray-800 dark:ring-gray-700 dark:hover:ring-gray-600"
            >
              {/* Profile Image */}
              <div className="aspect-[4/3]">
                {exec.selfieURL ? (
                  <Image
                    src={exec.selfieURL}
                    alt={exec.user.name}
                    width={300}
                    height={225}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-teal-400 to-emerald-500">
                    <div className="flex h-full items-center justify-center text-white">
                      <div className="text-center">
                        <svg
                          className="mx-auto mb-4 h-20 w-20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <p className="text-sm font-medium opacity-90">
                          {getDisplayName(
                            exec.user.preferredName,
                            exec.user.name,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Executive Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getDisplayName(exec.user.preferredName, exec.user.name)}
                  </h3>
                  <p className="text-default dark:text-default-lighter text-sm font-semibold">
                    {getPositionTitle(exec.position)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Class of {exec.user.gradYear} • {exec.user.pronouns}
                  </p>
                </div>

                <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  <Markdown content={exec.description} />
                </div>

                {/* Contact Button */}
                <div className="mt-6">
                  <a
                    href={`mailto:${exec.email}`}
                    className="bg-default hover:bg-default-darker dark:bg-default-darker dark:hover:bg-default inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200"
                  >
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alumni Executives Section */}
        {alumniExecutives.length > 0 && (
          <>
            <div className="mt-16 mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Alumni Executives
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Former leaders who helped build our community
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {alumniExecutives.map((exec) => (
                <div
                  key={exec.email}
                  className="group relative overflow-hidden rounded-2xl bg-white opacity-75 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-lg hover:ring-gray-300 dark:bg-gray-800 dark:ring-gray-700 dark:hover:ring-gray-600"
                >
                  {/* Profile Image */}
                  <div className="aspect-[4/3]">
                    {exec.selfieURL ? (
                      <Image
                        src={exec.selfieURL}
                        alt={exec.user.name}
                        width={300}
                        height={225}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-gray-400 to-gray-500">
                        <div className="flex h-full items-center justify-center text-white">
                          <div className="text-center">
                            <svg
                              className="mx-auto mb-4 h-20 w-20"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <p className="text-sm font-medium opacity-90">
                              {getDisplayName(
                                exec.user.preferredName,
                                exec.user.name,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Executive Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {getDisplayName(
                          exec.user.preferredName,
                          exec.user.name,
                        )}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {getPositionTitle(exec.position)} • Alumni
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Class of {exec.user.gradYear} • {exec.user.pronouns}
                      </p>
                    </div>

                    <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      <Markdown content={exec.description} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {currentExecutives.length === 0 && alumniExecutives.length === 0 && (
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No executives listed
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Executive team information will appear here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
