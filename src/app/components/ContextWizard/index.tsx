/**
 * Context Wizard - Main Component
 * A wizard for managing context data (brand, pages, knowledge, etc.)
 * Refactored from single file into modular structure
 */

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Globe, BookOpen, Loader2 } from "lucide-react";
import { useContextMenu } from "@/providers/ContextProvider";
import { ContextEditDialog } from "@/app/components/ContextEditDialog";
import { getSectionConfig, type SectionConfig } from "@/lib/context/section-mapping";
import { OnSiteTab } from "./tabs/OnSiteTab";
import { OffSiteTab } from "./tabs/OffSiteTab";
import { KnowledgeTab } from "./tabs/KnowledgeTab";
import type { TabType } from "./types";

interface ContextWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: TabType;
}

export function ContextWizard({ 
  open, 
  onOpenChange, 
  defaultTab = "onSite" 
}: ContextWizardProps) {
  const { contextData, updateKnowledge, reloadContextData } = useContextMenu();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogConfig, setEditDialogConfig] = useState<SectionConfig | null>(null);

  // Helper function to open ContextEditDialog
  const openEditDialog = (label: string) => {
    const config = getSectionConfig(label);
    if (config) {
      setEditDialogConfig(config);
      setEditDialogOpen(true);
    }
  };

  // Load data when wizard opens (only once per open)
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const lastOpenStateRef = React.useRef(false);

  // Check if we have any data to avoid showing loading screen unnecessarily
  const hasExistingData = React.useMemo(() => {
    return (
      contextData.onSite.productsServices.length > 0 ||
      contextData.onSite.landingPages.length > 0 ||
      contextData.onSite.blogPosts.length > 0 ||
      contextData.offSite.socialAccounts.length > 0 ||
      contextData.offSite.pressReleases.length > 0
    );
  }, [contextData]);

  React.useEffect(() => {
    if (open && !lastOpenStateRef.current) {
      lastOpenStateRef.current = true;
      // Only show loading indicator if we don't have existing data
      if (!hasExistingData) {
        setIsLoadingData(true);
      }
      // Refresh context data when wizard opens to ensure latest data is shown
      reloadContextData()
        .then(() => {
          setIsLoadingData(false);
        })
        .catch((error) => {
          console.error("[ContextWizard] Failed to reload context data:", error);
          setIsLoadingData(false);
        });
    } else if (!open) {
      lastOpenStateRef.current = false;
      setIsLoadingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // Only depend on open state

  return (
    <>
      <ContextEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        config={editDialogConfig}
        onSuccess={async () => {
          console.log(
            "[ContextWizard] ContextEditDialog onSuccess callback triggered, reloading context data..."
          );
          await reloadContextData();
          console.log("[ContextWizard] Context data reloaded successfully");
        }}
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1200px] h-[80vh] flex flex-col p-0 gap-0 [&_.text-xs]:text-sm [&_.h-8]:h-9 [&_.p-4]:p-5 [&_.rounded-lg]:rounded-xl [&_.space-y-3]:space-y-4 [&_.space-y-4]:space-y-5">
          <DialogHeader className="px-8 py-6 border-b shrink-0 bg-muted/30">
            <DialogTitle className="text-lg">Context Wizard</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Define your brand identity, products, team, competitive positioning, and
              upload supporting knowledge to power smarter agent decisions.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as TabType)}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="px-8 py-4 shrink-0 border-b bg-background/40">
                <TabsList className="grid w-full grid-cols-3 h-12 p-1.5 bg-muted/70 rounded-xl">
                  <TabsTrigger
                    value="onSite"
                    className="flex items-center gap-2 font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Network className="h-4 w-4" /> On-site
                  </TabsTrigger>
                  <TabsTrigger
                    value="offSite"
                    className="flex items-center gap-2 font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Globe className="h-4 w-4" /> Off-site
                  </TabsTrigger>
                  <TabsTrigger
                    value="knowledge"
                    className="flex items-center gap-2 font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <BookOpen className="h-4 w-4" /> Knowledge
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                {isLoadingData ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Loading context data...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <OnSiteTab
                      contextData={contextData}
                      openEditDialog={openEditDialog}
                    />
                    <OffSiteTab
                      contextData={contextData}
                      openEditDialog={openEditDialog}
                    />
                    <KnowledgeTab
                      contextData={contextData}
                      openEditDialog={openEditDialog}
                      updateKnowledge={updateKnowledge}
                    />
                  </>
                )}
              </div>
            </Tabs>
          </div>

          <DialogFooter className="pt-4 border-t shrink-0 px-6 py-4 bg-muted/30" />
        </DialogContent>
      </Dialog>
    </>
  );
}

