/**
 * EditableSectionLabel Component
 * Label with edit button for individual sections
 */

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EditableSectionLabelProps {
  label: string;
  count?: number;
  onEdit: (label: string) => void;
  editLabel: string;
}

export function EditableSectionLabel({
  label,
  count,
  onEdit,
  editLabel,
}: EditableSectionLabelProps) {
  return (
    <div className="flex items-center justify-between mb-1">
      <Label className="text-xs text-muted-foreground">
        {label}
        {typeof count === 'number' && count > 0 && (
          <span className="ml-1">({count})</span>
        )}
      </Label>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(editLabel)}
        className="h-5 gap-1 px-2"
      >
        <Edit className="h-3 w-3" />
        <span className="text-xs">Edit</span>
      </Button>
    </div>
  );
}

