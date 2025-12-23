/**
 * SubSectionHeader Component
 * Header for subsections with edit button
 */

import { Button } from "@/components/ui/button";
import { Edit, type LucideIcon } from "lucide-react";

interface SubSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  label: string;
  count?: number;
  onEdit: (label: string) => void;
}

export function SubSectionHeader({ 
  icon: Icon, 
  title, 
  label, 
  count,
  onEdit 
}: SubSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" /> 
        {title}
        {typeof count === 'number' && count > 0 && (
          <span className="text-xs text-muted-foreground/60 font-medium">
            ({count})
          </span>
        )}
      </h4>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onEdit(label)} 
        className="h-6 gap-1"
      >
        <Edit className="h-3 w-3" />
        Edit
      </Button>
    </div>
  );
}

