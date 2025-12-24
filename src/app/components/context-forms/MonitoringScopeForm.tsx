"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface MonitoringScopeData {
  brandKeywords?: string[];
  productKeywords?: string[];
  keyPersons?: string[];
  hashtags?: string[];
  requiredKeywords?: string[];
  excludedKeywords?: string[];
  regions?: string[];
  languages?: string[];
}

interface MonitoringScopeFormProps {
  data: MonitoringScopeData;
  onChange: (data: MonitoringScopeData) => void;
}

export function MonitoringScopeForm({
  data,
  onChange,
}: MonitoringScopeFormProps) {
  const addItem = (field: keyof MonitoringScopeData) => {
    const current = data[field] || [];
    onChange({ ...data, [field]: [...current, ""] });
  };

  const updateItem = (
    field: keyof MonitoringScopeData,
    index: number,
    value: string
  ) => {
    const current = [...(data[field] || [])];
    current[index] = value;
    onChange({ ...data, [field]: current });
  };

  const removeItem = (field: keyof MonitoringScopeData, index: number) => {
    const current = [...(data[field] || [])];
    current.splice(index, 1);
    onChange({ ...data, [field]: current });
  };

  const renderArrayField = (
    field: keyof MonitoringScopeData,
    label: string,
    placeholder: string
  ) => {
    const items = data[field] || [];
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">
            {label} {items.length > 0 && <span>({items.length})</span>}
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => addItem(field)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-1.5">
          {items.length === 0 ? (
            <div
              className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md cursor-pointer hover:bg-accent/50"
              onClick={() => addItem(field)}
            >
              Click + to add {label.toLowerCase()}
            </div>
          ) : (
            items.map((item: string, idx: number) => (
              <div key={idx} className="flex gap-1 group">
                <Input
                  placeholder={placeholder}
                  value={item}
                  onChange={(e) => updateItem(field, idx, e.target.value)}
                  className="text-xs h-8 bg-background/80"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0"
                  onClick={() => removeItem(field, idx)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Keywords & Signals</h4>
        {renderArrayField("brandKeywords", "Brand Keywords", "e.g. SeoPage.ai, SeoPage")}
        {renderArrayField("productKeywords", "Product Keywords", "e.g. SEO automation, content optimization")}
        {renderArrayField("keyPersons", "Key Persons", "e.g. CEO name, Founder name")}
        {renderArrayField("hashtags", "Hashtags", "e.g. #seo, #contentmarketing")}
      </div>

      <div className="space-y-4 pt-2 border-t">
        <h4 className="text-sm font-medium">Filters</h4>
        {renderArrayField("requiredKeywords", "Required Keywords (AND)", "Must include this keyword")}
        {renderArrayField("excludedKeywords", "Excluded Keywords (NOT)", "Must NOT include this keyword")}
      </div>

      <div className="space-y-4 pt-2 border-t">
        <h4 className="text-sm font-medium">Targeting</h4>
        {renderArrayField("regions", "Regions", "e.g. United States, Europe, Asia")}
        {renderArrayField("languages", "Languages", "e.g. English, Spanish, Chinese")}
      </div>
    </div>
  );
}

