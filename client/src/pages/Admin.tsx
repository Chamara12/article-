import ApiKeysForm from "@/components/ApiKeysForm";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: apiKeys, isLoading, error } = useQuery({
    queryKey: ['/api/admin/keys'],
  });
  
  const mutation = useMutation({
    mutationFn: async (keys: { chatgpt: string; anthropic: string; xai: string }) => {
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

  const handleUpdateApiKeys = async (keys: { chatgpt: string; anthropic: string; xai: string }) => {
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
        <p className="text-muted-foreground mt-1">Manage your AI API keys</p>
      </header>
      
      <div className="bg-gray-900 rounded-lg p-6">
        <ApiKeysForm 
          initialValues={apiKeys}
          onSubmit={handleUpdateApiKeys}
          isLoading={mutation.isPending}
        />
      </div>
    </div>
  );
}
