import { api } from "~/trpc/server";
import { Markdown } from "~/utils/markdown";

/**
 * Renders the executive team page, displaying current and alumni executives with their profiles, positions, and contact information.
 *
 * Fetches executive data from the backend, separates current and alumni members based on graduation year, and presents them in styled grids. If no executives are available, shows an empty state message.
 *
 * @returns The JSX markup for the executive team page.
 */
export default async function ExecutivesPage() {
  // Fetch real executives from the database
  const executives = await api.exec.getAll();

  // Current date and academic year calculation
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // Academic year starts in September, so if we're before July, we're still in the previous academic year
  const academicYearCutoff = currentDate.getMonth() < 6 ? currentYear : currentYear + 1;
  
  // Separate current and alumni executives
  const currentExecutives = executives.filter(exec => exec.user.gradYear >= academicYearCutoff);
  const alumniExecutives = executives.filter(exec => exec.user.gradYear < academicYearCutoff);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
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
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 hover:shadow-lg hover:ring-gray-300 dark:hover:ring-gray-600"
            >
              {/* Profile Image */}
              <div className="aspect-[4/3]">
                {exec.selfieURL ? (
                  <img
                    src={exec.selfieURL}
                    alt={exec.user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-teal-400 to-emerald-500 h-full">
                    <div className="flex h-full items-center justify-center text-white">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-20 w-20 mb-4"
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
                          {getDisplayName(exec.user.preferredName, exec.user.name)}
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
                  <p className="text-sm font-semibold text-default dark:text-default-lighter">
                    {getPositionTitle(exec.position)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Class of {exec.user.gradYear} • {exec.user.pronouns}
                  </p>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <Markdown content={exec.description} />
                </div>

                {/* Contact Button */}
                <div className="mt-6">
                  <a
                    href={`mailto:${exec.email}`}
                    className="inline-flex items-center rounded-md bg-default hover:bg-default-darker dark:bg-default-darker dark:hover:bg-default px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
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
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 hover:shadow-lg hover:ring-gray-300 dark:hover:ring-gray-600 opacity-75"
                >
                  {/* Profile Image */}
                  <div className="aspect-[4/3]">
                    {exec.selfieURL ? (
                      <img
                        src={exec.selfieURL}
                        alt={exec.user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-gray-400 to-gray-500 h-full">
                        <div className="flex h-full items-center justify-center text-white">
                          <div className="text-center">
                            <svg
                              className="mx-auto h-20 w-20 mb-4"
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
                              {getDisplayName(exec.user.preferredName, exec.user.name)}
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
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {getPositionTitle(exec.position)} • Alumni
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Class of {exec.user.gradYear} • {exec.user.pronouns}
                      </p>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
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
          <div className="text-center py-12">
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No executives listed</h3>
            <p className="mt-1 text-sm text-gray-500">Executive team information will appear here!</p>
          </div>
        )}

      </div>
    </div>
  );
}
