import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type React from 'react';

type OverviewProps = React.HTMLAttributes<HTMLDivElement>;

export function Overview({ className, ...props }: OverviewProps) {
  // Sample data for the chart
  const data = [
    { month: 'Jan', value: 4500 },
    { month: 'Feb', value: 6000 },
    { month: 'Mar', value: 5200 },
    { month: 'Apr', value: 7800 },
    { month: 'May', value: 6800 },
    { month: 'Jun', value: 9200 },
    { month: 'Jul', value: 8100 },
    { month: 'Aug', value: 10500 },
    { month: 'Sep', value: 9300 },
    { month: 'Oct', value: 11200 },
    { month: 'Nov', value: 9800 },
    { month: 'Dec', value: 12400 },
  ];

  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <Card className={cn('rounded-xl shadow-sm', className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span className="text-xs text-muted-foreground">This Year</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-full bg-muted"></div>
              <span className="text-xs text-muted-foreground">Last Year</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 800 280" preserveAspectRatio="none">
            {/* Grid lines */}
            <g>
              {[0, 1, 2, 3, 4].map(line => (
                <line
                  key={line}
                  x1="0"
                  y1={70 * line}
                  x2="800"
                  y2={70 * line}
                  className="chart-grid"
                />
              ))}
            </g>

            {/* Chart bars */}
            <g>
              {data.map((item, index) => {
                const barHeight = (item.value / maxValue) * 240;
                const x = index * (800 / data.length) + (800 / data.length) * 0.3;
                const width = (800 / data.length) * 0.4;

                return (
                  <g key={index}>
                    {/* Last year's data (slightly lower) */}
                    <rect
                      x={x}
                      y={280 - barHeight * 0.8}
                      width={width}
                      height={barHeight * 0.8}
                      rx="4"
                      className="fill-muted"
                    />

                    {/* This year's data */}
                    <rect
                      x={x}
                      y={280 - barHeight}
                      width={width}
                      height={barHeight}
                      rx="4"
                      className="fill-primary"
                      opacity="0.8"
                    />

                    {/* Month label */}
                    <text
                      x={x + width / 2}
                      y="275"
                      textAnchor="middle"
                      className="fill-muted-foreground text-[10px]">
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Value indicators */}
            <g>
              {[0, 1, 2, 3, 4].map(line => (
                <text
                  key={line}
                  x="10"
                  y={70 * line + 15}
                  className="fill-muted-foreground text-[10px]">
                  ${(maxValue - (maxValue / 4) * line).toLocaleString()}
                </text>
              ))}
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
