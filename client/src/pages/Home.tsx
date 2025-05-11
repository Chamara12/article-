import ArticleGenerationForm from "@/components/ArticleGenerationForm";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Home() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (formData: any) => {
    try {
      const response = await apiRequest('POST', '/api/articles/generate', formData);
      const data = await response.json();
      
      // Redirect to the article page
      setLocation(`/article/${data.id}`);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating article",
        description: error.message || "Please try again later",
      });
    }
  };

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Create SEO-Optimized Article</h1>
        <p className="text-muted-foreground mt-1">Fill in the form below to generate your article</p>
      </header>
      
      <ArticleGenerationForm onSubmit={handleSubmit} />
    </div>
  );
}
