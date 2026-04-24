import React, { useMemo } from 'react';
import { CartesianGrid, Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from "recharts";
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
import { PlayerDataTable } from './PlayerDataTable';

const chartConfig = {
  goals: {
    label: "Goals",
    color: "#4cc9f0", 
  },
  assists: {
    label: "Assists",
    color: "#c77dff", 
  },
};

export function PlayerDashboard({ data }) {
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

    // Process chart data: Top 10 by G+A
    const chartData = [...data]
      .map(player => ({
        name: player.player_name,
        goals: Number(player.goals) || 0,
        assists: Number(player.assists) || 0,
        totalContributions: (Number(player.goals) || 0) + (Number(player.assists) || 0)
      }))
      .filter(p => p.totalContributions > 0)
      .sort((a, b) => b.totalContributions - a.totalContributions)
      .slice(0, 10);

    return {
      totalGoals,
      totalXG: totalXG.toFixed(2),
      topScorer,
      topPlaymaker,
      chartData
    };
  }, [data]);

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

      {/* Chart Section */}
      <Card className="bg-white/5 border-white/10 text-white shadow-none">
        <CardHeader>
          <CardTitle>Top 10 Performers</CardTitle>
          <CardDescription className="text-white/50" >Ranked by Goals + Assists</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={stats.chartData}
                margin={{
                  left: -20,
                  right: 12,
                  top: 20,
                  bottom: 80
                }}
              >
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="goals" stackId="a" fill="var(--color-goals)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="assists" stackId="a" fill="var(--color-assists)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-white/50">
              No attacking data available down this filter path.
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
