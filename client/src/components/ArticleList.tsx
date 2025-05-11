import { ArticleData } from "../pages/Article";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export default function ArticleList() {
  const { data: articles, isLoading, error } = useQuery<ArticleData[]>({
    queryKey: ['/api/articles'],
  });
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="h-7 w-4/5 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="pb-3">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Skeleton className="h-6 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <h3 className="text-lg font-medium text-destructive">Failed to load articles</h3>
        <p className="text-sm text-destructive/80 mt-1">
          {(error as Error).message || "An unexpected error occurred"}
        </p>
      </div>
    );
  }
  
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <h3 className="text-lg font-medium">No articles yet</h3>
        <p className="text-muted-foreground mt-1">
          Generate your first article to see it here
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article: ArticleData) => (
        <Card key={article.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold line-clamp-2">{article.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {formatDate(article.date)}
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{article.primaryKeyword}</Badge>
              <Badge variant="secondary">{article.wordCount} words</Badge>
              <Badge variant="secondary" className="capitalize">{article.model}</Badge>
            </div>
            <div className="text-sm text-muted-foreground line-clamp-3">
              Generated with {article.tone} tone in {article.pov} point of view
              {article.targetAudience && ` for ${article.targetAudience}`}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-3">
            <Link to={`/article/${article.id}`} className="text-primary text-sm font-medium hover:underline">
              View full article →
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}