import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScriptLibrary } from "@/components/script-library"
import { Upload, Plus, FolderOpen } from "lucide-react"

export default function ScriptsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scripts</h1>
          <p className="text-muted-foreground">Manage your script library and execute tasks manually</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FolderOpen className="h-4 w-4 mr-2" />
            Browse
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Script
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Scripts</CardTitle>
          <CardDescription>Scripts available for execution on your agents</CardDescription>
        </CardHeader>
        <CardContent>
          <ScriptLibrary />
        </CardContent>
      </Card>
    </div>
  )
}
