import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MetaPreviewProps {
  title: string;
  description: string;
  keywords: string;
}

export default function MetaPreview({
  title,
  description,
  keywords,
}: MetaPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Tags Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-blue-600 hover:underline">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground">Keywords: {keywords}</p>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <pre className="text-xs overflow-x-auto">
              {`<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="keywords" content="${keywords}" />`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
