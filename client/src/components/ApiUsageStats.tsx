import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from '@/lib/utils';

// API usage summary by model
interface ApiUsageSummary {
  model: string;
  totalTokens: number;
  totalRequests: number;
  dailyUsage: {
    date: string;
    tokens: number;
    requests: number;
  }[];
}

// API usage record
interface ApiUsageRecord {
  model: string;
  tokens: number;
  requests: number;
  date: string;
}

// API usage response
interface ApiUsageResponse {
  summary: ApiUsageSummary[];
  detailed: ApiUsageRecord[];
}

export default function ApiUsageStats() {
  const { data, isLoading, error } = useQuery<ApiUsageResponse>({
    queryKey: ['/api/admin/usage'],
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <h3 className="text-lg font-medium text-destructive">Failed to load API usage data</h3>
        <p className="text-sm text-destructive/80 mt-1">
          {(error as Error).message || "An unexpected error occurred"}
        </p>
      </div>
    );
  }
  
  if (!data || !data.summary || data.summary.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <h3 className="text-lg font-medium">No API usage data yet</h3>
        <p className="text-muted-foreground mt-1">
          Usage statistics will appear after you generate articles
        </p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Usage Statistics</CardTitle>
        <CardDescription>
          Track token usage and requests across different AI services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="daily">Detailed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Model</TableHead>
                    <TableHead className="text-right">Requests</TableHead>
                    <TableHead className="text-right">Total Tokens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.summary.map((item) => (
                    <TableRow key={item.model}>
                      <TableCell className="font-medium capitalize">{item.model}</TableCell>
                      <TableCell className="text-right">{item.totalRequests.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.totalTokens.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="daily">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Date</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Requests</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.detailed.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{formatDate(item.date)}</TableCell>
                      <TableCell className="capitalize">{item.model}</TableCell>
                      <TableCell className="text-right">{item.requests.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.tokens.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}