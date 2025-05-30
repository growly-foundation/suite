import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type React from 'react';

type RecentSalesProps = React.HTMLAttributes<HTMLDivElement>;

export function RecentSales({ className, ...props }: RecentSalesProps) {
  const transactions = [
    {
      name: 'Olivia Martin',
      email: 'olivia.martin@email.com',
      amount: '+$1,999.00',
      status: 'deposit',
      date: 'Just now',
      avatar: '/placeholder.svg?height=36&width=36',
      initials: 'OM',
    },
    {
      name: 'Jackson Lee',
      email: 'jackson.lee@email.com',
      amount: '-$39.00',
      status: 'withdrawal',
      date: '2 minutes ago',
      avatar: '/placeholder.svg?height=36&width=36',
      initials: 'JL',
    },
    {
      name: 'Isabella Nguyen',
      email: 'isabella.nguyen@email.com',
      amount: '+$299.00',
      status: 'deposit',
      date: '3 hours ago',
      avatar: '/placeholder.svg?height=36&width=36',
      initials: 'IN',
    },
    {
      name: 'William Kim',
      email: 'will@email.com',
      amount: '+$99.00',
      status: 'deposit',
      date: 'Yesterday',
      avatar: '/placeholder.svg?height=36&width=36',
      initials: 'WK',
    },
    {
      name: 'Sofia Davis',
      email: 'sofia.davis@email.com',
      amount: '-$39.00',
      status: 'withdrawal',
      date: 'Yesterday',
      avatar: '/placeholder.svg?height=36&width=36',
      initials: 'SD',
    },
  ];

  return (
    <Card className={cn('rounded-xl shadow-sm', className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <CardDescription>You made 265 transactions this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarImage
                    src={transaction.avatar || '/placeholder.svg'}
                    alt={transaction.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {transaction.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{transaction.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{transaction.date}</span>
                    <span className="mx-1">•</span>
                    <span>{transaction.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    transaction.status === 'deposit'
                      ? 'bg-coinbase-green/10 text-coinbase-green'
                      : 'bg-coinbase-red/10 text-coinbase-red'
                  )}>
                  {transaction.status === 'deposit' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    'font-medium',
                    transaction.status === 'deposit' ? 'text-coinbase-green' : 'text-coinbase-red'
                  )}>
                  {transaction.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
