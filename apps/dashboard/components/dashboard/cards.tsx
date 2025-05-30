import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, CreditCard, TrendingUp, Users } from 'lucide-react';

export function DashboardCards() {
  return (
    <>
      <Card className="overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-md">
        <div className="gradient-blue p-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Total Revenue</h3>
            <div className="rounded-full bg-white/20 p-2">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </div>
            <div className="flex h-12 items-end">
              {[40, 25, 50, 30, 60, 75, 65].map((height, i) => (
                <div
                  key={i}
                  className="mx-[1px] w-1.5 rounded-t-sm bg-primary/20"
                  style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-md">
        <div className="gradient-teal p-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Subscriptions</h3>
            <div className="rounded-full bg-white/20 p-2">
              <Users className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </div>
            <div className="flex h-12 items-end">
              {[20, 45, 30, 60, 75, 55, 80].map((height, i) => (
                <div
                  key={i}
                  className="mx-[1px] w-1.5 rounded-t-sm bg-coinbase-teal/20"
                  style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-md">
        <div className="gradient-green p-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Sales</h3>
            <div className="rounded-full bg-white/20 p-2">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </div>
            <div className="flex h-12 items-end">
              {[30, 55, 35, 45, 65, 40, 70].map((height, i) => (
                <div
                  key={i}
                  className="mx-[1px] w-1.5 rounded-t-sm bg-coinbase-green/20"
                  style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-md">
        <div className="gradient-purple p-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Active Now</h3>
            <div className="rounded-full bg-white/20 p-2">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 since last hour</p>
            </div>
            <div className="flex h-12 items-end">
              {[50, 35, 60, 40, 70, 55, 65].map((height, i) => (
                <div
                  key={i}
                  className="mx-[1px] w-1.5 rounded-t-sm bg-coinbase-purple/20"
                  style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
