import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArticleData } from "./Article";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function History() {
  const { data: articles, isLoading, error } = useQuery<ArticleData[]>({
    queryKey: ['/api/articles'],
  });
  
  if (isLoading) {
    return (
      <div className="max-w-container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Article History</h1>
          <p className="text-muted-foreground mt-1">View all your generated articles</p>
        </header>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-14 w-full mb-3" />
          <Skeleton className="h-14 w-full mb-3" />
          <Skeleton className="h-14 w-full mb-3" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Article History</h1>
          <p className="text-muted-foreground mt-1">View all your generated articles</p>
        </header>
        
        <div className="bg-destructive/15 p-4 rounded-md">
          <h3 className="text-lg font-medium text-destructive">Failed to load articles</h3>
          <p className="text-destructive/80 mt-1">
            {(error as Error).message || "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Article History</h1>
          <p className="text-muted-foreground mt-1">View all your generated articles</p>
        </div>
        <Link to="/">
          <Button>Generate New Article</Button>
        </Link>
      </header>
      
      <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
        {!articles || articles.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium">No articles yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Generate your first article to see it here
            </p>
            <Link to="/">
              <Button>Generate New Article</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableCaption>A list of all your generated articles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Words</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.id}</TableCell>
                  <TableCell className="max-w-[250px] truncate font-medium">
                    {article.title}
                  </TableCell>
                  <TableCell>{formatDate(article.date)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{article.primaryKeyword}</Badge>
                      {article.secondaryKeywords && (
                        <Badge variant="secondary" className="opacity-75">+</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{article.wordCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className="capitalize">{article.model}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/article/${article.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}