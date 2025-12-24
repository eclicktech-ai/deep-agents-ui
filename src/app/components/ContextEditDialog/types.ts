/**
 * Types for ContextEditDialog
 */

import type {
  ContextItem,
  ContextPerson,
  ContextEntity,
} from "@/lib/api/client";
import type { SectionConfig } from "@/lib/context/section-mapping";

export interface ContextEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SectionConfig | null;
  onSuccess?: () => void;
}

export type ContextDataItem = ContextItem | ContextPerson | ContextEntity;

export interface DialogState {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
}

export interface SingletonState {
  data: Record<string, any>;
  version: number;
  jsonText: string;
  jsonError: string | null;
}

export interface ItemsState {
  items: ContextDataItem[];
  editingItem: ContextDataItem | null;
  isCreating: boolean;
  formData: Record<string, any>;
  dirtyItems: Set<string>;
  pendingCreations: ContextDataItem[];
  pendingDeletions: Set<string>;
}

