import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { ArticleData } from "@/pages/Article";

interface ArticleDisplayProps {
  article: ArticleData;
}

export default function ArticleDisplay({ article }: ArticleDisplayProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    const contentElement = document.querySelector('.article-content');
    if (contentElement) {
      const range = document.createRange();
      range.selectNode(contentElement);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      
      toast({
        title: "Copied to clipboard",
        description: "Article content has been copied to clipboard",
      });
    }
  };

  const downloadAsHtml = () => {
    const contentElement = document.querySelector('.article-content');
    if (contentElement) {
      const htmlContent = contentElement.innerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${article.title.replace(/\s+/g, '-').toLowerCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{article.title}</h1>
          <p className="text-muted-foreground mt-1">
            Generated on {formatDate(article.date)} • {article.wordCount} words
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={copyToClipboard}
            className="p-2 text-white hover:text-primary transition"
            title="Copy to clipboard"
          >
            <i className="fas fa-copy"></i>
          </button>
          <button
            onClick={downloadAsHtml}
            className="p-2 text-white hover:text-primary transition"
            title="Download as HTML"
          >
            <i className="fas fa-download"></i>
          </button>
        </div>
      </header>

      <div className="bg-gray-900 rounded-lg p-6 mb-8 article-content" 
           dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="border-t border-gray-800 pt-4">
        <h3 className="text-lg font-medium mb-3">Article Settings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Primary Keyword</p>
            <p className="font-medium">{article.primaryKeyword}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Word Count</p>
            <p className="font-medium">{article.wordCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tone</p>
            <p className="font-medium">{article.tone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">AI Model</p>
            <p className="font-medium">{article.model}</p>
          </div>
        </div>
      </div>
    </>
  );
}
