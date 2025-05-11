import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form schema
const articleFormSchema = z.object({
  primaryKeyword: z.string().min(1, "Primary keyword is required"),
  secondaryKeywords: z.string().optional(),
  wordCount: z.coerce.number().min(100).max(5000).default(200),
  tone: z.string().default("professional"),
  pov: z.string().default("second"),
  model: z.string().default("chatgpt"),
  targetAudience: z.string().optional(),
  humanize: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface ArticleGenerationFormProps {
  onSubmit: (values: ArticleFormValues) => void;
}

export default function ArticleGenerationForm({ onSubmit }: ArticleGenerationFormProps) {
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      primaryKeyword: "",
      secondaryKeywords: "",
      wordCount: 200,
      tone: "professional",
      pov: "second",
      model: "chatgpt",
      targetAudience: "",
      humanize: false,
    },
  });

  const handleSubmit = (values: ArticleFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="primaryKeyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Keyword <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., digital marketing"
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryKeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Keywords</FormLabel>
                <FormControl>
                  <Input
                    placeholder="seo, content strategy, web traffic"
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wordCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Word Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={100}
                    max={5000}
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pov"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Point of View</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white">
                      <SelectValue placeholder="Select point of view" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="first">First Person (I, We)</SelectItem>
                    <SelectItem value="second">Second Person (You)</SelectItem>
                    <SelectItem value="third">Third Person (They, It)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="chatgpt">ChatGPT</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="xai">x.ai</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Target Audience (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., small business owners, tech enthusiasts, parents"
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="humanize"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2 flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in mr-2">
                    <input
                      type="checkbox"
                      id="humanize"
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-700 appearance-none cursor-pointer left-0 top-0"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                    <label
                      htmlFor="humanize"
                      className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"
                    ></label>
                  </div>
                  <FormLabel htmlFor="humanize" className="cursor-pointer">
                    Humanize Article
                  </FormLabel>
                </div>
                <div className="ml-2 text-muted-foreground text-xs">
                  <i 
                    className="fas fa-info-circle cursor-help" 
                    title="Makes the article sound more natural and human-written"
                  ></i>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8">
          <Button
            type="submit"
            className="w-full px-6 py-3 bg-primary hover:bg-opacity-90 text-white font-medium rounded-md transition"
          >
            Generate Article
          </Button>
        </div>
      </form>
    </Form>
  );
}
