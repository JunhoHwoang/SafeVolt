import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "./ui/FadeInComp";

interface GraphStatsProps {
  cardData: {
    id: number;
    data: string;
    time: string;
    overview: string;
    description: string;
    solution: string;
    severityScore: number;
  }[];
}

export function GraphStats({ cardData }: GraphStatsProps) {
  const stats = useMemo(() => {
    const scores = cardData?.map((card) => card.severityScore) || [];
    const sum = scores?.reduce((acc, score) => acc + score, 0);
    const mean = scores?.length ? sum / scores?.length : 0;

    // Sort scores and calculate the median safely
    const sortedScores = [...scores].sort((a, b) => a - b);
    const median = scores?.length
      ? scores?.length % 2 === 0
        ? (sortedScores[scores?.length / 2 - 1] +
            sortedScores[scores?.length / 2]) /
          2
        : sortedScores[Math.floor(scores?.length / 2)]
      : 0;

    const variance =
      scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) /
      (scores?.length || 1);
    const stdDev = Math.sqrt(variance);

    const highSeverityCount = scores?.filter((score) => score > 7)?.length;

    // Calculate 7-day moving average safely
    const movingAverage =
      cardData?.map((card, index) => {
        const last7Days = cardData?.slice(Math.max(0, index - 6), index + 1);
        const avg =
          last7Days?.reduce((sum, c) => sum + c.severityScore, 0) /
          last7Days?.length;
          last7Days?.reduce((sum, c) => sum + c.severityScore, 0) /
          last7Days?.length;
        return { date: new Date(card.date), average: avg };
      }) || [];

    return {
      mean: mean.toFixed(2),
      max: scores?.length ? Math.max(...scores) : 0,
      min: scores?.length ? Math.min(...scores) : 0,
      median: median.toFixed(2),
      stdDev: stdDev.toFixed(2),
      highSeverityCount,
      movingAverage,
    };
  }, [cardData]);

  return (
    <div className="flex flex-col gap-4">
      <FadeIn>
        <Card className="w-full min-h-fit">
          <CardHeader>
            <CardTitle>Safety Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Mean Severity</h3>
                <p>{stats.mean}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Max Severity</h3>
                <p>{stats.max}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Min Severity</h3>
                <p>{stats.min}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Median Severity</h3>
                <p>{stats.median}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Standard Deviation</h3>
                <p>{stats.stdDev}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  High-Severity Incidents
                </h3>
                <p>{stats.highSeverityCount}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">
                7-Day Moving Average Trend
              </h3>
              <p>
                Last value:{" "}
                {stats.movingAverage?.length > 0
                  ? stats.movingAverage[
                      stats.movingAverage.length - 1
                    ]?.average.toFixed(2)
                  : "No data available"}
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
      <FadeIn>
        <Card className="w-full min-h-fit">
          <CardHeader>
            <CardTitle>Safety Statistics Summary</CardTitle>
          </CardHeader>
          <CardContent>TODO AI insights</CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
