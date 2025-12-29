"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BrandAssetsData {
  brandName?: {
    name?: string;
    subtitle?: string;
  };
  metaDescription?: string;
  images?: {
    favicon?: string;
    ogImage?: string;
  };
  logos?: {
    fullLogoLight?: string;
    fullLogoDark?: string;
    iconOnlyLight?: string;
    iconOnlyDark?: string;
  };
  colors?: {
    primaryLight?: string;
    primaryDark?: string;
    secondaryLight?: string;
    secondaryDark?: string;
  };
  typography?: {
    heading?: string;
    body?: string;
  };
  tone?: string;
  languages?: string;
}

interface BrandAssetsFormProps {
  data: BrandAssetsData;
  onChange: (data: BrandAssetsData) => void;
}

export function BrandAssetsForm({ data, onChange }: BrandAssetsFormProps) {
  const updateNested = (path: string[], value: any) => {
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Brand Name *</Label>
              <Input
                placeholder="Company or Product Name"
                value={data.brandName?.name || ""}
                onChange={(e) =>
                  updateNested(["brandName", "name"], e.target.value)
                }
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subtitle</Label>
              <Input
                placeholder="Your Tagline or Slogan"
                value={data.brandName?.subtitle || ""}
                onChange={(e) =>
                  updateNested(["brandName", "subtitle"], e.target.value)
                }
                className="h-9"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Meta Description</Label>
          <Textarea
            placeholder="A compelling description of your website (150-160 characters)..."
            value={data.metaDescription || ""}
            onChange={(e) => updateNested(["metaDescription"], e.target.value)}
            className="min-h-[140px] resize-none"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
        <h3 className="text-sm font-semibold mb-3 text-foreground">Images</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Open Graph Image</Label>
            <Input
              placeholder="https://... (1200x630)"
              value={data.images?.ogImage || ""}
              onChange={(e) =>
                updateNested(["images", "ogImage"], e.target.value)
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Favicon</Label>
            <Input
              placeholder="https://... (32x32)"
              value={data.images?.favicon || ""}
              onChange={(e) =>
                updateNested(["images", "favicon"], e.target.value)
              }
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Logos */}
      <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
        <h3 className="text-sm font-semibold mb-3 text-foreground">Logos</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Full Logo (Light)</Label>
            <Input
              placeholder="https://..."
              value={data.logos?.fullLogoLight || ""}
              onChange={(e) =>
                updateNested(["logos", "fullLogoLight"], e.target.value)
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Full Logo (Dark)</Label>
            <Input
              placeholder="https://..."
              value={data.logos?.fullLogoDark || ""}
              onChange={(e) =>
                updateNested(["logos", "fullLogoDark"], e.target.value)
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Icon Only (Light)</Label>
            <Input
              placeholder="https://..."
              value={data.logos?.iconOnlyLight || ""}
              onChange={(e) =>
                updateNested(["logos", "iconOnlyLight"], e.target.value)
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Icon Only (Dark)</Label>
            <Input
              placeholder="https://..."
              value={data.logos?.iconOnlyDark || ""}
              onChange={(e) =>
                updateNested(["logos", "iconOnlyDark"], e.target.value)
              }
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
        <h3 className="text-sm font-semibold mb-3 text-foreground">Brand Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Primary (Light)</Label>
            <Input
              placeholder="#3B82F6"
              value={data.colors?.primaryLight || ""}
              onChange={(e) =>
                updateNested(["colors", "primaryLight"], e.target.value)
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Primary (Dark)</Label>
            <Input
              placeholder="#60A5FA"
              value={data.colors?.primaryDark || ""}
              onChange={(e) =>
                updateNested(["colors", "primaryDark"], e.target.value)
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Secondary (Light)</Label>
            <Input
              placeholder="#10B981"
              value={data.colors?.secondaryLight || ""}
              onChange={(e) =>
                updateNested(["colors", "secondaryLight"], e.target.value)
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Secondary (Dark)</Label>
            <Input
              placeholder="#34D399"
              value={data.colors?.secondaryDark || ""}
              onChange={(e) =>
                updateNested(["colors", "secondaryDark"], e.target.value)
              }
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
        <h3 className="text-sm font-semibold mb-3 text-foreground">Typography / Fonts</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Heading Font</Label>
            <Input
              placeholder="Inter, Poppins, etc."
              value={data.typography?.heading || ""}
              onChange={(e) =>
                updateNested(["typography", "heading"], e.target.value)
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Body Font</Label>
            <Input
              placeholder="Open Sans, Roboto, etc."
              value={data.typography?.body || ""}
              onChange={(e) =>
                updateNested(["typography", "body"], e.target.value)
              }
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Content Style */}
      <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
        <h3 className="text-sm font-semibold mb-3 text-foreground">Content Style</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tone of Voice</Label>
            <Textarea
              placeholder="Professional, Friendly, Bold..."
              value={data.tone || ""}
              onChange={(e) => updateNested(["tone"], e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Supported Languages</Label>
            <Input
              placeholder="English, Spanish, Chinese..."
              value={data.languages || ""}
              onChange={(e) => updateNested(["languages"], e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

