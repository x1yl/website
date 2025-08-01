"use client";

import { useTheme } from "next-themes";
import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { type AxisOptions, Chart } from "react-charts";

const PRIMARY_COLOR = "#19b1a0"; // Using our teal primary color

type DailyMembers = {
  date: Date;
  members: number;
};

interface Props {
  leaves: Date[];
  joins: Date[];
}

/**
 * Calculates the membership count over time based on arrays of join and leave dates.
 *
 * Iterates through sorted join and leave date arrays, incrementing the count on each join and decrementing on each leave, to produce a time series of membership counts at each relevant date.
 *
 * @param joins - Array of dates when members joined
 * @param leaves - Array of dates when members left
 * @returns An array of objects, each containing a `date` and the corresponding `members` count at that date
 */
function calcMembers(joins: Date[], leaves: Date[]) {
  const dataPoints: DailyMembers[] = [];
  let i = 0;
  let j = 0;
  let members = 0;
  while (i < joins.length && j < leaves.length) {
    const joinDate = joins[i];
    const leaveDate = leaves[j];
    if (!joinDate || !leaveDate) {
      console.error("Invalid date found in arrays");
      break;
    }
    if (joinDate < leaveDate) {
      members++;
      dataPoints.push({ date: joinDate, members });
      i++;
    } else {
      members--;
      dataPoints.push({ date: leaveDate, members });
      j++;
    }
  }
  while (i < joins.length) {
    const joinDate = joins[i];
    if (!joinDate) {
      console.error("Invalid join date at index", i);
      i++;
      continue;
    }
    members++;
    dataPoints.push({ date: joinDate, members });
    i++;
  }
  while (j < leaves.length) {
    const leaveDate = leaves[j];
    if (!leaveDate) {
      console.error("Invalid leave date at index", j);
      j++;
      continue;
    }
    members--;
    dataPoints.push({ date: leaveDate, members });
    j++;
  }

  return dataPoints;
}

export const MemberChart: FC<Props> = ({ joins, leaves }) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { resolvedTheme } = useTheme();
  const primaryAxis = useMemo(
    (): AxisOptions<DailyMembers> => ({
      getValue: (datum) => datum.date,
      hardMin: joins[0],
      hardMax: new Date(),
    }),
    [joins],
  );

  const dataPoints = useMemo(() => calcMembers(joins, leaves), [joins, leaves]);

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyMembers>[] => [
      {
        getValue: (datum) => datum.members,
      },
    ],
    [],
  );

  return (
    <div className="z-10 my-10 h-[50dvh] w-full" ref={ref}>
      {mounted && dataPoints.length > 0 ? (
        <Chart
          options={{
            data: [
              {
                label: "Members",
                data: [
                  ...dataPoints,
                  {
                    date: new Date(),
                    members: dataPoints[dataPoints.length - 1]?.members ?? 0,
                  },
                ],
              },
            ],

            primaryAxis,
            primaryCursor: {
              showLabel: false,
            },
            secondaryCursor: {
              showLabel: false,
            },

            secondaryAxes,
            dark: resolvedTheme === "dark",
            showDebugAxes: false,
            defaultColors: [PRIMARY_COLOR],

            tooltip: {
              align: "auto",
              render: ({ focusedDatum }) => {
                return (
                  <div className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <p className="p-2 font-semibold">
                      {focusedDatum?.originalDatum.date.toLocaleString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour12: true,
                          hour: "numeric",
                          minute: "numeric",
                        },
                      )}
                    </p>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <p className="p-2">
                      <span className="bg-default mr-2 inline-block h-3.5 w-3.5 rounded-full" />
                      {focusedDatum?.originalDatum.members} Members
                    </p>
                  </div>
                );
              },
            },
          }}
        />
      ) : (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <p>No membership data available yet</p>
        </div>
      )}
    </div>
  );
};
