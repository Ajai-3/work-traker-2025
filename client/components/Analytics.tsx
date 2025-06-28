import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Clock, Calendar, TrendingUp } from "lucide-react";
import { calculateStats } from "@/lib/storage";
import { secondsToHours, hoursToReadable } from "@/lib/time-utils";

interface AnalyticsProps {
  refreshKey: number;
}

export function Analytics({ refreshKey }: AnalyticsProps) {
  const stats = calculateStats();

  const statCards = [
    {
      title: "Today's Total",
      value: hoursToReadable(secondsToHours(stats.totalToday)),
      icon: Clock,
      description: "Time worked today",
    },
    {
      title: "Weekly Total",
      value: hoursToReadable(secondsToHours(stats.totalWeek)),
      icon: Calendar,
      description: "Time worked this week",
    },
    {
      title: "Daily Average",
      value: hoursToReadable(stats.dailyAverage),
      icon: TrendingUp,
      description: "Average per day (7 days)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Daily Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Daily Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={true}
                  axisLine={true}
                  allowDataOverflow={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: "Hours", angle: -90, position: "insideLeft" }}
                  tickLine={true}
                  axisLine={true}
                  allowDataOverflow={false}
                  domain={[0, "auto"]}
                />
                <Bar
                  dataKey="hours"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
