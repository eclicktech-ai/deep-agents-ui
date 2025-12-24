/**
 * ReadOnlyField Component
 * Displays a read-only text field with optional placeholder
 */

interface ReadOnlyFieldProps {
  value?: string | null;
  placeholder?: string;
  className?: string;
}

export function ReadOnlyField({ 
  value, 
  placeholder, 
  className = "" 
}: ReadOnlyFieldProps) {
  return (
    <div className={`text-sm px-3 py-2 border rounded-md bg-muted/30 ${value ? 'text-foreground' : 'text-muted-foreground'} ${className}`}>
      {value || (
        <span className="text-muted-foreground/60 italic">
          {placeholder || "No data"}
        </span>
      )}
    </div>
  );
}

