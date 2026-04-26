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
import { PlayerDataTable } from './PlayerDataTable';

const chartConfig = {
  goals: {
    label: "Goals",
    color: "#C4A747",
  },
  assists: {
    label: "Assists",
    color: "#4cc9f0",
  },
};

export function PlayerDashboard({ data }) {
  const [topN, setTopN] = useState("10");

  const stats = useMemo(() => {
    let totalGoals = 0;
    let totalXG = 0;

    let topScorer = { name: "N/A", goals: -1 };
    let topPlaymaker = { name: "N/A", assists: -1 };

    // Process all players for top line metrics
    data.forEach(player => {
      const goals = Number(player.goals) || 0;
      const xg = Number(player.expected_goals) || 0;
      const assists = Number(player.assists) || 0;

      totalGoals += goals;
      totalXG += xg;

      if (goals > topScorer.goals) {
        topScorer = { name: player.player_name, goals };
      }

      if (assists > topPlaymaker.assists) {
        topPlaymaker = { name: player.player_name, assists };
      }
    });

    // Process chart data: Top N by G+A
    const limit = Number(topN);
    const chartData = [...data]
      .map(player => ({
        name: player.player_name,
        goals: Number(player.goals) || 0,
        assists: Number(player.assists) || 0,
        totalContributions: (Number(player.goals) || 0) + (Number(player.assists) || 0)
      }))
      .filter(p => p.totalContributions > 0)
      .sort((a, b) => b.totalContributions - a.totalContributions)
      .slice(0, limit);

    return {
      totalGoals,
      totalXG: totalXG.toFixed(2),
      topScorer,
      topPlaymaker,
      chartData
    };
  }, [data, topN]);

  return (
    <div className="flex flex-col gap-6 w-full mt-4">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Squad Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGoals}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Squad xG</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalXG}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Scorer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate" title={stats.topScorer.name}>
              {stats.topScorer.name}
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-white/50">
              {stats.topScorer.goals >= 0 ? `${stats.topScorer.goals} goals` : "No data"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Playmaker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate" title={stats.topPlaymaker.name}>
              {stats.topPlaymaker.name}
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-white/50">
              {stats.topPlaymaker.assists >= 0 ? `${stats.topPlaymaker.assists} assists` : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section — Interactive Area Chart */}
      <Card className="bg-white/5 border-white/10 text-white shadow-none pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/10 py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-xl">Top Performers</CardTitle>
            <CardDescription className="text-white/50">
              Goals + Assists contribution by player
            </CardDescription>
          </div>
          <Select value={topN} onValueChange={setTopN}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex bg-white/5 border-white/10 text-white"
              aria-label="Select top N"
            >
              <SelectValue placeholder="Top 10" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-[#0a1628] border-white/10 text-white">
              <SelectItem value="5" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                Top 5
              </SelectItem>
              <SelectItem value="10" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                Top 10
              </SelectItem>
              <SelectItem value="15" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                Top 15
              </SelectItem>
              <SelectItem value="20" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                Top 20
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {stats.chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-white">
              <AreaChart
                accessibilityLayer
                data={stats.chartData}
                margin={{ left: 40, right: 12, top: 20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillGoalsPlayer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-goals)" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="var(--color-goals)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fillAssistsPlayer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-assists)" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="var(--color-assists)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#ffffff', fontSize: 13, fontWeight: 600 }}
                  angle={-40}
                  textAnchor="end"
                  height={100}
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
                      labelFormatter={(value) => value}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="assists"
                  type="natural"
                  fill="url(#fillAssistsPlayer)"
                  stroke="var(--color-assists)"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="goals"
                  type="natural"
                  fill="url(#fillGoalsPlayer)"
                  stroke="var(--color-goals)"
                  strokeWidth={2}
                  stackId="a"
                />
                <ChartLegend verticalAlign="bottom" content={<ChartLegendContent className="text-[15px] font-semibold text-white mt-4" />} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[350px] items-center justify-center text-white/50">
              No attacking data available for this filter.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Table Section */}
      <Card className="bg-white/5 border-white/10 text-white shadow-none p-4 mt-2">
        <PlayerDataTable data={data} />
      </Card>
    </div>
  );
}
