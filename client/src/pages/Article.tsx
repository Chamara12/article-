import { useEffect, useState } from "react";
import ArticleDisplay from "@/components/ArticleDisplay";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export interface ArticleData {
  id: string;
  title: string;
  content: string;
  date: string;
  wordCount: number;
  primaryKeyword: string;
  secondaryKeywords: string;
  tone: string;
  model: string;
  pov: string;
  targetAudience?: string;
}

export default function Article() {
  const { id } = useParams();
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: [`/api/articles/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full rounded-lg mb-8" />
        <Skeleton className="h-5 w-1/4 mb-2" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-container mx-auto px-4 py-8">
        <div className="bg-destructive/20 text-destructive p-4 rounded-md">
          <h2 className="text-lg font-semibold">Error Loading Article</h2>
          <p>{error ? (error as Error).message : "Article not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <ArticleDisplay article={article} />
    </div>
  );
}
