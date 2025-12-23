/**
 * Knowledge Tab Component
 * Manages knowledge base sources (files, links, notes, etc.)
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  Link2,
  FileText,
  Cloud,
  Save,
  Upload,
  X,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { KnowledgeTabProps } from "../types";

export function KnowledgeTab({ contextData, updateKnowledge }: KnowledgeTabProps) {
  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.txt,.md,.doc,.docx,.csv,.mp3,.wav,.png,.jpg,.jpeg,.webp,.mp4,.webm";
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((file) => {
          const fileExt = file.name.split(".").pop()?.toLowerCase() || "file";
          const newSource = {
            id: uuidv4(),
            title: file.name,
            type: "uploaded" as const,
            sourceType: fileExt as any,
            addedAt: new Date().toISOString(),
            category: "internal_doc" as const,
          };
          updateKnowledge({
            sources: [...(contextData.knowledge.sources || []), newSource],
          });
        });
      }
    };
    
    input.click();
  };

  const handleAddLink = () => {
    const url = prompt("Enter URL (webpage, YouTube, GitHub, or Google Scholar):");
    if (url) {
      let sourceType: "webpage" | "youtube" | "github" | "google_scholar" = "webpage";
      
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        sourceType = "youtube";
      } else if (url.includes("github.com")) {
        sourceType = "github";
      } else if (url.includes("scholar.google")) {
        sourceType = "google_scholar";
      }
      
      const newSource = {
        id: uuidv4(),
        title: url.length > 50 ? url.substring(0, 50) + "..." : url,
        type: "linked" as const,
        sourceType: sourceType,
        url: url,
        addedAt: new Date().toISOString(),
      };
      
      updateKnowledge({
        sources: [...(contextData.knowledge.sources || []), newSource],
      });
    }
  };

  const handlePasteContent = () => {
    const pasteType = prompt("Paste type (plain_text / markdown / rich_text / code):");
    if (pasteType && ["plain_text", "markdown", "rich_text", "code"].includes(pasteType.toLowerCase().replace(" ", "_"))) {
      const text = prompt("Paste your content:");
      if (text) {
        const newSource = {
          id: uuidv4(),
          title: text.length > 40 ? text.substring(0, 40) + "..." : text,
          type: "pasted" as const,
          sourceType: pasteType.toLowerCase().replace(" ", "_") as any,
          content: text,
          addedAt: new Date().toISOString(),
        };
        
        updateKnowledge({
          sources: [...(contextData.knowledge.sources || []), newSource],
        });
      }
    }
  };

  const handleImportCloud = () => {
    const service = prompt("Enter service (google_drive / onedrive / notion / obsidian):");
    if (service && ["google_drive", "onedrive", "notion", "obsidian"].includes(service.toLowerCase().replace(" ", "_"))) {
      const url = prompt(`Enter ${service} file or page URL:`);
      if (url) {
        const newSource = {
          id: uuidv4(),
          title: url.length > 50 ? url.substring(0, 50) + "..." : url,
          type: "imported" as const,
          sourceType: service.toLowerCase().replace(" ", "_") as any,
          url: url,
          addedAt: new Date().toISOString(),
        };
        
        updateKnowledge({
          sources: [...(contextData.knowledge.sources || []), newSource],
        });
      }
    }
  };

  const handleRemoveSource = (sourceId: string) => {
    updateKnowledge({
      sources: (contextData.knowledge.sources || []).filter((s: any) => s.id !== sourceId),
    });
  };

  const renderSourceColumn = (
    type: string,
    icon: React.ReactNode,
    label: string
  ) => {
    const sources = (contextData.knowledge.sources || []).filter(
      (s: any) => s.type === type
    );

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 pb-2 border-b">
          {icon}
          <span className="text-xs font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">({sources.length})</span>
        </div>
        <div className="space-y-1">
          {sources.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 py-2">
              No {label.toLowerCase()} {type === "uploaded" ? "files" : ""}
            </p>
          ) : (
            sources.map((source: any) => (
              <div
                key={source.id}
                className="group flex items-center gap-2 py-1 px-2 rounded hover:bg-accent/30 transition-colors"
              >
                <span className="text-[10px] px-1 py-0.5 rounded bg-muted text-muted-foreground font-mono shrink-0">
                  {type === "uploaded" ? `.${source.sourceType || "file"}` : source.sourceType || type}
                </span>
                <span className="text-xs truncate flex-1" title={source.title}>
                  {source.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => handleRemoveSource(source.id)}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <TabsContent value="knowledge" className="p-8 m-0 h-full overflow-y-auto">
      <div className="space-y-7 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Knowledge Base
              <span className="text-sm font-normal text-muted-foreground">
                ({(contextData.knowledge.sources || []).length}/
                {contextData.knowledge.sourceLimit || 50})
              </span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add files, links, and notes to give the agent deeper context about your business.
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center hover:border-primary/50 hover:bg-accent/30 transition-all cursor-pointer"
          onClick={handleFileUpload}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Upload sources</p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or{" "}
                <span className="text-primary underline">choose file</span> to upload
              </p>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Supported: PDF, TXT, MD, DOCX, XLSX, PPTX, CSV, JSON, HTML, XML, RTF, PNG, JPG, GIF, WEBP, MP3, MP4, WAV, WEBM
            </p>
          </div>
        </div>

        {/* Quick Add Methods */}
        <div className="grid grid-cols-1 gap-5">
          {/* Link Button */}
          <div
            className="border rounded-xl p-5 bg-card/50 hover:bg-accent/30 transition-colors cursor-pointer"
            onClick={handleAddLink}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium text-sm">Link</p>
              </div>
              <p className="text-xs text-muted-foreground">
                e.g., Webpage, YouTube, GitHub, Scholar...
              </p>
            </div>
          </div>

          {/* Paste Button */}
          <div
            className="border rounded-xl p-5 bg-card/50 hover:bg-accent/30 transition-colors cursor-pointer"
            onClick={handlePasteContent}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium text-sm">Paste</p>
              </div>
              <p className="text-xs text-muted-foreground">
                e.g., Plain Text, Rich Text, Markdown, Code...
              </p>
            </div>
          </div>

          {/* Cloud & Notes Button */}
          <div
            className="border rounded-xl p-5 bg-card/50 hover:bg-accent/30 transition-colors cursor-pointer"
            onClick={handleImportCloud}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium text-sm">Cloud & Notes</p>
              </div>
              <p className="text-xs text-muted-foreground">
                e.g., Google Drive, OneDrive, Notion, Obsidian...
              </p>
            </div>
          </div>

          {/* Saved Artifacts Button */}
          <div
            className="border rounded-xl p-5 bg-card/50 hover:bg-accent/30 transition-colors cursor-pointer opacity-60"
            title="Saved artifacts from agent research will appear here"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Save className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium text-sm">Saved Artifacts</p>
              </div>
              <p className="text-xs text-muted-foreground">
                e.g., Competitors, FAQs, Keywords, Sitemap...
              </p>
            </div>
          </div>
        </div>

        {/* Source Cards - Kanban Layout */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">Added Sources</Label>
          <div className="grid grid-cols-5 gap-4">
            {renderSourceColumn(
              "uploaded",
              <Upload className="h-4 w-4 text-primary" />,
              "Uploaded"
            )}
            {renderSourceColumn(
              "linked",
              <Link2 className="h-4 w-4 text-muted-foreground" />,
              "Linked"
            )}
            {renderSourceColumn(
              "pasted",
              <FileText className="h-4 w-4 text-muted-foreground" />,
              "Pasted"
            )}
            {renderSourceColumn(
              "imported",
              <Cloud className="h-4 w-4 text-muted-foreground" />,
              "Imported"
            )}
            {renderSourceColumn(
              "saved",
              <Save className="h-4 w-4 text-muted-foreground" />,
              "Saved"
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}

