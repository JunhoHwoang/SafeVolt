"use client";

import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Toggle } from "@/components/ui/toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeIn } from "./ui/FadeInComp";

interface GraphsProps {
  cardData: {
    id: number;
    date: string;
    time: string;
    overview: string;
    description: string;
    content: string;
    severityScore: number;
  }[];
}

export function Graphs({ cardData }: GraphsProps) {
  const [activeView, setActiveView] = React.useState<"date" | "time">("date");

  const processedData = React.useMemo(() => {
    return cardData?.map(({ date, time, severityScore }) => {
      const dateObj = new Date(date + " " + time);
      console.log(dateObj);

      return {
        x:
          activeView === "date"
            ? dateObj.getTime()
            : dateObj.getHours() + dateObj.getMinutes() / 60, // Time as fraction of 24 hours
        y: severityScore,
        date: dateObj.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
    });
  }, [cardData, activeView]);

  const total = React.useMemo(
    () => cardData?.reduce((acc, curr) => acc + curr.severityScore, 0),
    [cardData]
  );

  return (
    <div>
      <div className="flex flex-row items-center space-x-4 mb-4">
        <Toggle
          variant="outline"
          aria-label="View by date"
          pressed={activeView === "date"}
          onPressedChange={() => setActiveView("date")}
        >
          View by date
        </Toggle>
        <Toggle
          variant="outline"
          aria-label="View by time"
          pressed={activeView === "time"}
          onPressedChange={() => setActiveView("time")}
        >
          View by time
        </Toggle>
      </div>
      <FadeIn>
        <Card>
          <CardHeader className="flex flex-col items-stretch space-y-4 border-b p-4">
            <div className="flex flex-1 flex-col justify-center gap-1">
              <CardTitle>Severe Scores</CardTitle>
              <CardDescription>
                Distribution of scores over time
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={activeView === "date" ? "date" : "time"}
                  domain={
                    activeView === "date" ? ["auto", "auto"] : [0, 24] // 0 to 24 hours for time view
                  }
                  tickFormatter={
                    (value) =>
                      activeView === "date"
                        ? new Date(value).toLocaleDateString()
                        : `${String(Math.floor(value)).padStart(2, "0")}:00` // Format hour:minute
                  }
                  ticks={activeView === "time" ? [0, 6, 12, 18, 24] : undefined}
                />
                <YAxis type="number" dataKey="y" name="score" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background p-2 border rounded shadow">
                          <p>
                            {activeView === "date"
                              ? `Date: ${data.date}`
                              : `Time: ${data.time}`}
                          </p>
                          <p>Score: {data.y}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Scores" data={processedData} fill="red" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
