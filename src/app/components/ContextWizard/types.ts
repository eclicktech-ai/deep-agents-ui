/**
 * Types for ContextWizard
 */

import type { ContextData, KnowledgeContext } from "@/app/types/context";

export interface TabProps {
  contextData: ContextData;
  openEditDialog: (label: string) => void;
}

export interface KnowledgeTabProps extends TabProps {
  updateKnowledge: (updates: Partial<KnowledgeContext>) => void;
}

export type TabType = "onSite" | "offSite" | "knowledge";

