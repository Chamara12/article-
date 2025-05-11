import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

// Form schema
const apiKeysSchema = z.object({
  chatgpt: z.string().optional(),
  anthropic: z.string().optional(),
  xai: z.string().optional(),
});

type ApiKeysFormValues = z.infer<typeof apiKeysSchema>;

interface ApiKeysFormProps {
  initialValues?: ApiKeysFormValues;
  onSubmit: (values: ApiKeysFormValues) => void;
  isLoading?: boolean;
}

export default function ApiKeysForm({ initialValues, onSubmit, isLoading = false }: ApiKeysFormProps) {
  const [showChatGPT, setShowChatGPT] = useState(false);
  const [showClaude, setShowClaude] = useState(false);
  const [showXAI, setShowXAI] = useState(false);

  const form = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: initialValues || {
      chatgpt: "",
      anthropic: "",
      xai: "",
    },
  });

  const handleSubmit = (values: ApiKeysFormValues) => {
    onSubmit(values);
  };

  const togglePasswordVisibility = (field: "chatgpt" | "anthropic" | "xai") => {
    switch (field) {
      case "chatgpt":
        setShowChatGPT(!showChatGPT);
        break;
      case "anthropic":
        setShowClaude(!showClaude);
        break;
      case "xai":
        setShowXAI(!showXAI);
        break;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="chatgpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ChatGPT API Key</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showChatGPT ? "text" : "password"}
                    placeholder="Enter your OpenAI API key"
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition"
                  onClick={() => togglePasswordVisibility("chatgpt")}
                >
                  <i className={`fas ${showChatGPT ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anthropic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Claude API Key</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showClaude ? "text" : "password"}
                    placeholder="Enter your Anthropic API key"
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition"
                  onClick={() => togglePasswordVisibility("anthropic")}
                >
                  <i className={`fas ${showClaude ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="xai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>x.ai API Key</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showXAI ? "text" : "password"}
                    placeholder="Enter your x.ai API key"
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition"
                  onClick={() => togglePasswordVisibility("xai")}
                >
                  <i className={`fas ${showXAI ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-8">
          <Button
            type="submit"
            className="px-6 py-3 bg-primary hover:bg-opacity-90 text-white font-medium rounded-md transition"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update API Keys"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
