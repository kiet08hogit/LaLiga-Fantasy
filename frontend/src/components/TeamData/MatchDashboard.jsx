import React, { useMemo } from 'react';
import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MatchDataTable } from './MatchDataTable';

const chartConfig = {
  goals: {
    label: "Goals",
    color: "#4cc9f0", 
  },
  xg: {
    label: "xG",
    color: "#C4A747", 
  },
};

export function MatchDashboard({ data, teamName }) {
  const stats = useMemo(() => {
    let totalGoalsFor = 0;
    let totalGoalsAgainst = 0;
    let totalXGFor = 0;
    let totalXGAgainst = 0;

    const chartData = [...data]
      .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
      .map((match) => {
        // Evaluate if team is home or away
        const isHome = match.home_team.toLowerCase().includes((teamName || "").toLowerCase());
        
        const goalsFor = isHome ? (match.home_goals ?? match.home_score ?? 0) : (match.away_goals ?? match.away_score ?? 0);
        const goalsAgainst = isHome ? (match.away_goals ?? match.away_score ?? 0) : (match.home_goals ?? match.home_score ?? 0);
        
        const xgFor = isHome ? (match.home_xg ?? 0) : (match.away_xg ?? 0);
        const xgAgainst = isHome ? (match.away_xg ?? 0) : (match.home_xg ?? 0);

        totalGoalsFor += Number(goalsFor);
        totalGoalsAgainst += Number(goalsAgainst);
        totalXGFor += Number(xgFor);
        totalXGAgainst += Number(xgAgainst);

        return {
          date: new Date(match.match_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          goals: Number(goalsFor),
          xg: Number(xgFor).toFixed(2),
          opponent: isHome ? match.away_team : match.home_team,
        };
      });

    return {
      chartData,
      totalMatches: data.length,
      totalGoalsFor,
      totalGoalsAgainst,
      totalXG: totalXGFor.toFixed(2),
    };
  }, [data, teamName]);

  return (
    <div className="flex flex-col gap-6 w-full mt-4">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMatches}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGoalsFor}</div>
            <p className="text-xs text-muted-foreground mt-1 text-white/50">
              Conceded: {stats.totalGoalsAgainst}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total xG</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalXG}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overperformance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.totalGoalsFor) - Number(stats.totalXG)).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-white/50">
              Goals vs xG
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="bg-white/5 border-white/10 text-white shadow-none">
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
          <CardDescription className="text-white/50" >Expected Goals (xG) vs Actual Goals</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              accessibilityLayer
              data={stats.chartData}
              margin={{
                left: -20,
                right: 12,
                top: 20,
                bottom: 10
              }}
            >
              <defs>
                <linearGradient id="fillGoals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-goals)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-goals)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillXg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-xg)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-xg)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
              />
              <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                content={<ChartTooltipContent />}
              />
              <Area
                dataKey="xg"
                type="monotone"
                fill="url(#fillXg)"
                fillOpacity={1}
                stroke="var(--color-xg)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: "var(--color-xg)" }}
                activeDot={{ r: 6 }}
              />
              <Area
                dataKey="goals"
                type="monotone"
                fill="url(#fillGoals)"
                fillOpacity={1}
                stroke="var(--color-goals)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-goals)" }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Data Table Section */}
      <Card className="bg-white/5 border-white/10 text-white shadow-none p-4 mt-2">
        <MatchDataTable data={data} teamName={teamName} />
      </Card>
    </div>
  );
}
