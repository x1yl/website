import Image from "next/image";
import { api } from "~/trpc/server";
import { MemberChart } from "~/app/_components/member-chart";

export const revalidate = 600;

export default async function Home() {
  // Fetch real stats from the database like in the example
  const [events, executives, allUsers, eventAttendances, deletedUsers] = await Promise.all([
    api.event.getAll(),
    api.exec.getAll(),
    api.user.getAll(),
    api.user.getAllAttendances(),
    api.user.getDeletedUsers(),
  ]);

  // Calculate stats exactly like the example
  const credits = allUsers.reduce((sum, user) => sum + user.givenCredits, 0);
  const joins = allUsers.map((user) => user.registeredAt);
  const eventsCount = events.length;
  const serviceHours = eventAttendances.reduce((sum, attendance) => sum + attendance.earnedHours, 0);
  const leaves = deletedUsers.map((user) => user.leftAt);

  // Calculate active members (unique attendees)
  const activeMembers = new Set(events.flatMap(event => event.attendees.map(attendee => attendee.userEmail))).size;

  // Helper function to round down to nearest multiple of 10
  const roundDownToZero = (num: number) => Math.floor(num / 10) * 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative px-6 pt-16 pb-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-8xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-25">
            {/* Text Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
                <span className="block">Welcome to</span>
                <span className="text-default dark:text-default-lighter whitespace-nowrap">BTHS Action</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
                Join us in creating meaningful connections, organizing impactful events, 
                and building a stronger community together. Discover opportunities to 
                grow, learn, and make lasting friendships through community service and engagement.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="/events"
                  className="rounded-md bg-default hover:bg-default-darker dark:bg-default-darker dark:hover:bg-default px-6 py-3 text-base font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default transition-colors duration-200"
                >
                  View Events
                </a>
                <a
                  href="/executives"
                  className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-default dark:hover:text-default-lighter transition-colors duration-200"
                >
                  Meet Our Team <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div>
              <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xl lg:h-[500px]">
                { <Image
                  src="/banner.jpg"
                  alt="BTHS Action Hero"
                  fill
                  className="object-cover"
                /> }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-white dark:bg-gray-800 py-16 transition-colors">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-default dark:text-default-lighter">{roundDownToZero(activeMembers)}+</div>
              <div className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-default dark:text-default-lighter">{roundDownToZero(eventsCount)}+</div>
              <div className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Events Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-default dark:text-default-lighter">{roundDownToZero(serviceHours)}+</div>
              <div className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Service Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-default dark:text-default-lighter">{roundDownToZero(credits)}+</div>
              <div className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Club Credits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Chart Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Membership Growth
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Track our community's growth over time
            </p>
          </div>
          
          <MemberChart 
            joins={[
              ...joins,
              ...deletedUsers.map(({ registeredAt }) => registeredAt),
            ].sort((a, b) => a.getTime() - b.getTime())}
            leaves={leaves}
          />
        </div>
      </div>
    </div>
  );
}
