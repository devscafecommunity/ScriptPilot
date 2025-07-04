import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Edit, Download, FileText } from "lucide-react"

const scripts = [
  {
    id: "1",
    name: "backup.sh",
    description: "Incremental backup script",
    type: "bash",
    size: "2.1 KB",
    parameters: ["destination", "exclude-pattern"],
    lastModified: "2025-07-01",
    compatible: ["Linux", "macOS"],
  },
  {
    id: "2",
    name: "update.py",
    description: "System package updater",
    type: "python",
    size: "5.3 KB",
    parameters: ["auto-restart", "exclude-packages"],
    lastModified: "2025-06-28",
    compatible: ["Linux", "Windows"],
  },
  {
    id: "3",
    name: "cleanup.sh",
    description: "Log file cleanup utility",
    type: "bash",
    size: "1.8 KB",
    parameters: ["days-to-keep", "log-path"],
    lastModified: "2025-06-25",
    compatible: ["Linux", "macOS"],
  },
  {
    id: "4",
    name: "monitor.js",
    description: "System monitoring script",
    type: "node",
    size: "3.7 KB",
    parameters: ["interval", "alert-threshold"],
    lastModified: "2025-07-02",
    compatible: ["Linux", "Windows", "macOS"],
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "bash":
      return "default"
    case "python":
      return "secondary"
    case "node":
      return "outline"
    default:
      return "outline"
  }
}

export function ScriptLibrary() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Script</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Parameters</TableHead>
          <TableHead>Compatible</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scripts.map((script) => (
          <TableRow key={script.id}>
            <TableCell>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{script.name}</p>
                  <p className="text-sm text-muted-foreground">{script.description}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getTypeColor(script.type)}>{script.type}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {script.parameters.map((param) => (
                  <Badge key={param} variant="outline" className="text-xs">
                    {param}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {script.compatible.map((os) => (
                  <Badge key={os} variant="secondary" className="text-xs">
                    {os}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">{script.size}</span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
