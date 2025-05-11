import ApiKeysForm from "@/components/ApiKeysForm";
import ArticleList from "@/components/ArticleList";
import ApiUsageStats from "@/components/ApiUsageStats";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: apiKeys, isLoading, error } = useQuery<{ chatgpt?: string; anthropic?: string; xai?: string }>({
    queryKey: ['/api/admin/keys'],
  });
  
  const mutation = useMutation({
    mutationFn: async (keys: { chatgpt?: string; anthropic?: string; xai?: string }) => {
      return apiRequest('POST', '/api/admin/keys', keys);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "API keys have been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/keys'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error updating API keys",
        description: error.message || "Please try again later",
      });
    }
  });

  const handleUpdateApiKeys = async (keys: { chatgpt?: string; anthropic?: string; xai?: string }) => {
    mutation.mutate(keys);
  };
  
  if (isLoading) {
    return (
      <div className="max-w-container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-2/4 mb-2" />
        <Skeleton className="h-5 w-1/3 mb-8" />
        <div className="bg-gray-900 rounded-lg p-6">
          <Skeleton className="h-16 w-full mb-5" />
          <Skeleton className="h-16 w-full mb-5" />
          <Skeleton className="h-16 w-full mb-8" />
          <Skeleton className="h-12 w-36" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-container mx-auto px-4 py-8">
        <div className="bg-destructive/20 text-destructive p-4 rounded-md">
          <h2 className="text-lg font-semibold">Error Loading API Keys</h2>
          <p>{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage your content and AI service settings</p>
      </header>
      
      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="mb-2">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="api-usage">API Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys" className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-6">
            <ApiKeysForm 
              initialValues={apiKeys}
              onSubmit={handleUpdateApiKeys}
              isLoading={mutation.isPending}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="articles" className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Articles</h2>
            <p className="text-muted-foreground mb-6">
              All articles created using the AI generation tools
            </p>
            <ArticleList />
          </div>
        </TabsContent>
        
        <TabsContent value="api-usage" className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">API Usage Statistics</h2>
            <p className="text-muted-foreground mb-6">
              Track and monitor your AI service usage and token consumption
            </p>
            <ApiUsageStats />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
