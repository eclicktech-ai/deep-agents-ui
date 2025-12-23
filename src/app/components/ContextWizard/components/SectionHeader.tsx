/**
 * SectionHeader Component
 * Header for major sections with edit button
 */

import { Button } from "@/components/ui/button";
import { Edit, type LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  label: string;
  count?: number;
  onEdit: (label: string) => void;
}

export function SectionHeader({ 
  icon: Icon, 
  title, 
  label, 
  count,
  onEdit 
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2 flex-1">
        <Icon className="h-5 w-5 text-muted-foreground" /> 
        {title}
        {typeof count === 'number' && count > 0 && (
          <span className="text-xs text-muted-foreground/60 font-medium">
            ({count})
          </span>
        )}
      </h3>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onEdit(label)} 
        className="h-7 gap-1"
      >
        <Edit className="h-3.5 w-3.5" />
        Edit
      </Button>
    </div>
  );
}

