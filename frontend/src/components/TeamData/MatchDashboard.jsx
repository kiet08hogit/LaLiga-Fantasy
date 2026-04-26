import React, { useMemo, useState } from 'react';
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MatchDataTable } from './MatchDataTable';

const chartConfig = {
  goals: {
    label: "Goals",
    color: "#C4A747",
  },
  shotsOnTarget: {
    label: "Shots on Tgt",
    color: "#4cc9f0",
  },
};

export function MatchDashboard({ data, teamName }) {
  const [timeRange, setTimeRange] = useState("all");

  const stats = useMemo(() => {
    let totalGoalsFor = 0;
    let totalGoalsAgainst = 0;
    let totalShotsFor = 0;
    let totalShotsAgainst = 0;

    const allChartData = [...data]
      .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
      .map((match) => {
        // Evaluate if team is home or away
        const isHome = match.home_team.toLowerCase().includes((teamName || "").toLowerCase());

        const goalsFor = isHome ? (match.home_goals ?? match.home_score ?? 0) : (match.away_goals ?? match.away_score ?? 0);
        const goalsAgainst = isHome ? (match.away_goals ?? match.away_score ?? 0) : (match.home_goals ?? match.home_score ?? 0);

        const shotsFor = isHome ? (match.home_shots_target ?? 0) : (match.away_shots_target ?? 0);
        const shotsAgainst = isHome ? (match.away_shots_target ?? 0) : (match.home_shots_target ?? 0);

        totalGoalsFor += Number(goalsFor);
        totalGoalsAgainst += Number(goalsAgainst);
        totalShotsFor += Number(shotsFor);
        totalShotsAgainst += Number(shotsAgainst);

        return {
          date: new Date(match.match_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          goals: Number(goalsFor),
          shotsOnTarget: Number(shotsFor),
          opponent: isHome ? match.away_team : match.home_team,
        };
      });

    // Filter by time range
    let chartData = allChartData;
    if (timeRange === "10") {
      chartData = allChartData.slice(-10);
    } else if (timeRange === "20") {
      chartData = allChartData.slice(-20);
    } else if (timeRange === "5") {
      chartData = allChartData.slice(-5);
    }

    return {
      chartData,
      totalMatches: data.length,
      totalGoalsFor,
      totalGoalsAgainst,
      totalShots: totalShotsFor,
    };
  }, [data, teamName, timeRange]);

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
            <CardTitle className="text-sm font-medium">Shots on Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShots}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalShots > 0 ? ((stats.totalGoalsFor / stats.totalShots) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-white/50">
              Goals per Shot on Target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section — Interactive Area Chart */}
      <Card className="bg-white/5 border-white/10 text-white shadow-none pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/10 py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-xl">Performance Trend</CardTitle>
            <CardDescription className="text-white/50">
              Shots on Target vs Actual Goals per match
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex bg-white/5 border-white/10 text-white"
              aria-label="Select match range"
            >
              <SelectValue placeholder="All Matches" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-[#0a1628] border-white/10 text-white">
              <SelectItem value="all" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                All Matches
              </SelectItem>
              <SelectItem value="20" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                Last 20
              </SelectItem>
              <SelectItem value="10" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                Last 10
              </SelectItem>
              <SelectItem value="5" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                Last 5
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-white">
            <AreaChart
              accessibilityLayer
              data={stats.chartData}
              margin={{ left: 0, right: 12, top: 20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillGoalsMatch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-goals)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--color-goals)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fillShotsOnTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-shotsOnTarget)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--color-shotsOnTarget)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: '#ffffff', fontSize: 13, fontWeight: 500 }}
                height={60}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'rgba(255,255,255,0.4)' }}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.15)' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      const opponent = payload?.[0]?.payload?.opponent;
                      return opponent ? `${value} vs ${opponent}` : value;
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="shotsOnTarget"
                type="natural"
                fill="url(#fillShotsOnTarget)"
                stroke="var(--color-shotsOnTarget)"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <Area
                dataKey="goals"
                type="natural"
                fill="url(#fillGoalsMatch)"
                stroke="var(--color-goals)"
                strokeWidth={2}
              />
              <ChartLegend verticalAlign="bottom" content={<ChartLegendContent className="text-[15px] font-semibold text-white mt-2" />} />
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
