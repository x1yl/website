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

function calcMembers(joins: Date[], leaves: Date[]) {
  const dataPoints: DailyMembers[] = [];
  let i = 0;
  let j = 0;
  let members = 0;
  while (i < joins.length && j < leaves.length) {
    const joinDate = joins[i]!;
    const leaveDate = leaves[j]!;
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
    members++;
    dataPoints.push({ date: joins[i]!, members });
    i++;
  }
  while (j < leaves.length) {
    members--;
    dataPoints.push({ date: leaves[j]!, members });
    j++;
  }

  console.log(dataPoints);

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
    [joins]
  );

  const dataPoints = useMemo(() => calcMembers(joins, leaves), [joins, leaves]);

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyMembers>[] => [
      {
        getValue: (datum) => datum.members,
      },
    ],
    []
  );

  return (
    <div className="w-full h-[50dvh] my-10 z-10" ref={ref}>
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
                    members: dataPoints[dataPoints.length - 1]?.members || 0,
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
                  <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold p-2">
                      {focusedDatum?.originalDatum.date.toLocaleString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour12: true,
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )}
                    </p>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <p className="p-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-default inline-block mr-2" />
                      {focusedDatum?.originalDatum.members} Members
                    </p>
                  </div>
                );
              },
            },
          }}
        />
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No membership data available yet</p>
        </div>
      )}
    </div>
  );
};
