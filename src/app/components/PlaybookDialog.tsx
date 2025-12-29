"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Zap, CheckCircle2, ArrowLeft, BarChart, Settings2, Loader2 } from "lucide-react";
import { Playbook, PlaybookCategory } from "@/data/playbooks";
import { usePlaybooks } from "@/hooks/usePlaybooks";
import { getSkillFormConfig, type FormField } from "@/data/skillForms";
import { useContextMenu } from "@/providers/ContextProvider";

interface PlaybookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: PlaybookCategory | null;
  onRunPlaybook: (playbook: Playbook, formData?: Record<string, string>, customInstructions?: string) => void;
}

export function PlaybookDialog({
  open,
  onOpenChange,
  category,
  onRunPlaybook,
}: PlaybookDialogProps) {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  // Get context data
  const { contextData } = useContextMenu();
  
  // Extract competitor domains and niche/industry from context and save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Extract competitor domains from context
    const competitors = contextData?.knowledge?.competitors || [];
    const competitorWebsites = competitors
      .map(c => c.website)
      .filter((url): url is string => !!url && typeof url === 'string')
      .map(url => {
        // Normalize URLs: remove protocol, www, trailing slashes
        return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
      })
      .filter(Boolean);
    
    // Save competitor domains to localStorage
    if (competitorWebsites.length > 0) {
      localStorage.setItem('seenos_onboarding_competitors', JSON.stringify(competitorWebsites));
    }
    
    // Extract niche/industry from context (check multiple possible sources)
    let nicheIndustry: string | null = null;
    
    // Try to get from market intelligence
    const marketIntelligence = contextData?.knowledge?.marketIntelligence || [];
    if (marketIntelligence.length > 0) {
      // Extract industry/niche from market intelligence titles or types
      const industries = marketIntelligence
        .map(mi => {
          // Try to extract from title or type
          if (mi.type === 'industry_report' && mi.title) {
            return mi.title;
          }
          return null;
        })
        .filter(Boolean);
      if (industries.length > 0) {
        nicheIndustry = industries[0] as string;
      }
    }
    
    // Try to get from target market in brand info
    if (!nicheIndustry) {
      const brandInfo = contextData?.onSite?.brandInfo;
      if (brandInfo?.targetMarket) {
        nicheIndustry = brandInfo.targetMarket;
      }
    }
    
    // Save niche/industry to localStorage if found
    if (nicheIndustry) {
      localStorage.setItem('seenos_onboarding_niche', nicheIndustry);
    }
  }, [contextData]);
  
  // Get domain from localStorage (saved during onboarding)
  // Use useMemo to prevent unnecessary re-renders
  const onboardingDomain = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('seenos_onboarding_domain');
  }, []);
  
  // Get competitor domains from localStorage (if saved)
  // Use useMemo to prevent unnecessary re-renders
  const competitorDomains = React.useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('seenos_onboarding_competitors');
      if (stored) {
        const competitors = JSON.parse(stored);
        return Array.isArray(competitors) ? competitors.filter(Boolean) : [];
      }
    } catch {
      return [];
    }
    return [];
  }, []);
  
  // Get niche/industry from localStorage (if saved)
  const nicheIndustry = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('seenos_onboarding_niche');
  }, []);
  
  const hasOnboardingDomain = !!onboardingDomain;
  const hasCompetitorData = competitorDomains.length > 0;
  const hasNicheIndustry = !!nicheIndustry;

  // Reset state when dialog closes or category changes
  useEffect(() => {
    if (!open) {
      setSelectedPlaybook(null);
      setSelectedOption(null);
      setCustomInstructions("");
      setFormData({});
    }
  }, [open, category]);

  // Update custom instructions when option changes
  useEffect(() => {
    if (selectedPlaybook && selectedOption) {
      const option = selectedPlaybook.options?.find(o => o.value === selectedOption);
      if (option) {
        setCustomInstructions(option.defaultPrompt);
      }
    }
  }, [selectedOption, selectedPlaybook]);

  // Initialize form data when playbook is selected or onboarding data changes
  useEffect(() => {
    if (selectedPlaybook) {
      // Filter out tags starting with ###
      const filteredTags = selectedPlaybook.tags.filter(tag => !tag.startsWith('###'));
      const formConfig = getSkillFormConfig(
        selectedPlaybook.agentName, 
        selectedPlaybook.id,
        selectedPlaybook.title,
        filteredTags
      );
      if (formConfig) {
        const initialData: Record<string, string> = {};
        formConfig.fields.forEach((field) => {
          if (field.autoFill === 'domain') {
            // Get domain from localStorage (saved during onboarding)
            if (onboardingDomain) {
              initialData[field.key] = onboardingDomain;
            } else {
              initialData[field.key] = '';
            }
          } else if (field.autoFill === 'competitorDomains') {
            // Get competitor domains from localStorage if available
            if (hasCompetitorData && competitorDomains.length > 0) {
              initialData[field.key] = competitorDomains.join(', ');
            } else {
              initialData[field.key] = '';
            }
          } else if (field.autoFill === 'niche') {
            // Get niche/industry from localStorage if available
            if (hasNicheIndustry && nicheIndustry) {
              initialData[field.key] = nicheIndustry;
            } else {
              initialData[field.key] = '';
            }
          } else if (field.type === 'select' && field.defaultValue) {
            // For select fields, use defaultValue if provided
            initialData[field.key] = field.defaultValue;
          } else {
            // For fields without autoFill, start with empty
            initialData[field.key] = '';
          }
        });
        // Always update formData with initialData to ensure auto-fill works
        // This will fill empty fields or fields that should be auto-filled
        setFormData(prev => {
          // If formData is empty (first time), use initialData
          if (!prev || Object.keys(prev).length === 0) {
            return initialData;
          }
          // Otherwise, merge: keep user input for non-autoFill fields, but update autoFill fields if they're empty
          const merged = { ...prev };
          formConfig.fields.forEach((field) => {
            if (field.autoFill) {
              // Only update if the field is empty or if onboarding data just became available
              if (!merged[field.key] || merged[field.key].trim() === '') {
                merged[field.key] = initialData[field.key];
              }
            } else if (field.type === 'select' && field.defaultValue) {
              // For select fields with defaultValue, set it if not already set or if empty
              if (!merged[field.key] || merged[field.key].trim() === '') {
                merged[field.key] = initialData[field.key];
              }
            } else {
              // Keep user input for non-autoFill fields, but initialize if not set
              if (!merged[field.key]) {
                merged[field.key] = initialData[field.key];
              }
            }
          });
          return merged;
        });
      } else {
        setFormData({});
      }
    } else {
      // Reset formData when no playbook is selected
      setFormData({});
    }
  }, [selectedPlaybook, onboardingDomain, competitorDomains, hasCompetitorData, nicheIndustry, hasNicheIndustry]);

  // Get playbooks data
  const { playbooks: allPlaybooks, isLoading } = usePlaybooks({
    category: category || undefined,
    active_only: true,
  });

  if (!category) return null;

  // Filter playbooks by category
  const filteredPlaybooks = allPlaybooks.filter((p) => p.category === category);

  const getCategoryLabel = (cat: PlaybookCategory) => {
    switch (cat) {
      case "research":
        return "Deep Research Playbooks";
      case "build":
        return "Build & Content Playbooks";
      case "optimize":
        return "Optimization Playbooks";
      case "monitor":
        return "Monitoring & Decision Playbooks";
      default:
        return "Playbooks";
    }
  };

  const handleRun = () => {
    if (selectedPlaybook) {
      // Validate required fields
      const formConfig = getSkillFormConfig(selectedPlaybook.agentName, selectedPlaybook.id);
      if (formConfig) {
        const missingFields = formConfig.fields
          .filter(field => field.required && !formData[field.key]?.trim())
          .map(field => field.label);
        
        if (missingFields.length > 0) {
          // You could show a toast or error message here
          alert(`Please fill in required fields: ${missingFields.join(', ')}`);
          return;
        }
      }
      
      onRunPlaybook(selectedPlaybook, formData, customInstructions);
      onOpenChange(false);
    }
  };

  const handleFormFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderFormField = (field: FormField) => {
    const value = formData[field.key] || (field.type === 'select' && field.defaultValue ? field.defaultValue : '');
    
    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            id={field.key}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFormFieldChange(field.key, e.target.value)}
            className="min-h-[80px]"
            required={field.required}
          />
          {field.helpText && (
            <p className="text-xs text-muted-foreground">{field.helpText}</p>
          )}
        </div>
      );
    }
    
    if (field.type === 'select') {
      return (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Select
            value={value}
            onValueChange={(newValue) => handleFormFieldChange(field.key, newValue)}
            required={field.required}
          >
            <SelectTrigger id={field.key}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.helpText && (
            <p className="text-xs text-muted-foreground">{field.helpText}</p>
          )}
        </div>
      );
    }
    
    if (field.type === 'urls') {
      return (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={field.key}
            type="text"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFormFieldChange(field.key, e.target.value)}
            required={field.required}
          />
          {field.helpText && (
            <p className="text-xs text-muted-foreground">{field.helpText}</p>
          )}
          {field.autoFill && (field.autoFill === 'domain' ? hasOnboardingDomain : hasCompetitorData) && (
            <p className="text-xs text-muted-foreground">
              Auto-fill: The system will use the website configured during your Onboarding as the default value
            </p>
          )}
        </div>
      );
    }
    
    // Default to text/url input
    return (
      <div key={field.key} className="space-y-2">
        <Label htmlFor={field.key} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input
          id={field.key}
          type={field.type === 'url' ? 'url' : 'text'}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => handleFormFieldChange(field.key, e.target.value)}
          required={field.required}
        />
        {field.helpText && (
          <p className="text-xs text-muted-foreground">{field.helpText}</p>
        )}
        {field.autoFill === 'domain' && hasOnboardingDomain && (
          <p className="text-xs text-muted-foreground">
            Auto-fill: The system will use the website configured during your Onboarding as the default value
          </p>
        )}
        {field.autoFill === 'competitorDomains' && hasCompetitorData && (
          <p className="text-xs text-muted-foreground">
            Auto-fill: The system will use the website configured during your Onboarding as the default value
          </p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-muted/30">
          <div className="flex items-center gap-2">
            {selectedPlaybook && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2 mr-1"
                onClick={() => {
                  setSelectedPlaybook(null);
                  setSelectedOption(null);
                  setCustomInstructions("");
                  setFormData({});
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {selectedPlaybook ? (
                  selectedPlaybook.title
                ) : (
                  <>
                    <span className="capitalize">{category}</span>
                    <span className="text-muted-foreground font-normal">
                      / {getCategoryLabel(category)}
                    </span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedPlaybook
                  ? "Configure and run this playbook."
                  : "Select a specialized playbook to execute specific tasks."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="text-sm">Loading playbooks...</p>
              </div>
            </div>
          ) : selectedPlaybook ? (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Playbook Info */}
              <div className="space-y-6">
                
                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed">
                  {selectedPlaybook.description}
                </p>
                
                {/* Actions and Artifacts - Two separate blocks */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* What this playbook will do */}
                  <div className="text-sm bg-background/50 p-4 rounded-md border border-border/50">
                    <div className="space-y-3">
                      <div className="font-medium text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-foreground" />
                        What this playbook will do
                      </div>
                      <ul className="space-y-2">
                        {selectedPlaybook.autoActions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* What artifacts will be generated */}
                  <div className="text-sm bg-background/50 p-4 rounded-md border border-border/50">
                    <div className="space-y-3">
                      <div className="font-medium text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <BarChart className="h-3 w-3 text-foreground" />
                        What artifacts will be generated along with the playbook
                      </div>
                      <ul className="space-y-2">
                        {selectedPlaybook.outputs.map((output, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground">
                            <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                            <span>{output}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-6">
                {selectedPlaybook.options && selectedPlaybook.options.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      Configuration Options
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {selectedPlaybook.options.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => setSelectedOption(option.value)}
                          className={`
                            cursor-pointer rounded-lg border p-4 transition-all hover:bg-accent
                            ${selectedOption === option.value 
                              ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                              : 'border-border bg-card'}
                          `}
                        >
                          <div className="font-medium mb-1">{option.label}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {option.defaultPrompt}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                 {/* Expected Input Form */}
                 {(() => {
                   // Filter out tags starting with ###
                   const filteredTags = selectedPlaybook.tags.filter(tag => !tag.startsWith('###'));
                   const formConfig = getSkillFormConfig(
                     selectedPlaybook.agentName, 
                     selectedPlaybook.id,
                     selectedPlaybook.title,
                     filteredTags
                   );
                   
                   // Always show form section
                   if (formConfig) {
                     // If no fields, show "No specific input required"
                     if (formConfig.fields.length === 0) {
                       return (
                         <div className="space-y-4">
                           <label className="text-sm font-medium">
                             Expected Input
                           </label>
                           <div className="flex items-center justify-center p-8 rounded-lg border border-dashed border-border/50 bg-background/50">
                             <div className="text-center space-y-1">
                               <p className="text-sm font-medium text-muted-foreground">
                                 NO SPECIFIC INPUT REQUIRED
                               </p>
                             </div>
                           </div>
                         </div>
                       );
                     }
                     
                     // Otherwise show form fields
                     return (
                       <div className="space-y-4">
                         <label className="text-sm font-medium">
                           Expected Input
                         </label>
                         <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-background/50">
                           {formConfig.fields.map((field) => renderFormField(field))}
                         </div>
                       </div>
                     );
                   }
                   return null;
                 })()}

                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Custom Instructions
                  </label>
                  <Textarea
                    placeholder="Add specific instructions, context, or constraints..."
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    className="min-h-[120px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    These instructions will be appended to the agent's system prompt.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedPlaybook(null)}>
                  Cancel
                </Button>
                <Button onClick={handleRun} className="gap-2 pl-4 pr-6">
                  <Play className="h-4 w-4" />
                  Run Playbook
                </Button>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="grid grid-cols-1 gap-4">
              {filteredPlaybooks.map((playbook) => (
                <div
                  key={playbook.id}
                  className="group relative flex flex-col gap-4 rounded-lg border p-5 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedPlaybook(playbook);
                    setFormData({});
                    if (playbook.options && playbook.options.length > 0) {
                      setSelectedOption(playbook.options[0].value); // Select first option by default
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {playbook.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {playbook.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="shrink-0 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Configure
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm bg-background/50 p-3 rounded-md border border-border/50">
                      <div className="space-y-1.5">
                        <div className="font-medium text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="h-3 w-3 text-foreground" />What this playbook will do 
                        </div>
                        <div className="text-muted-foreground line-clamp-2">
                          {playbook.autoActions.slice(0, 2).join(", ")}...
                        </div>
                      </div>
                    </div>
                    <div className="text-sm bg-background/50 p-3 rounded-md border border-border/50">
                      <div className="space-y-1.5">
                        <div className="font-medium text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <BarChart className="h-3 w-3 text-foreground" /> What artifacts will be generated along with the playbook
                        </div>
                        <div className="text-foreground line-clamp-2">
                          {playbook.outputs.slice(0, 2).join(", ")}...
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex flex-wrap gap-2 pt-1">
                    {playbook.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {playbook.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground self-center">+{playbook.tags.length - 3}</span>
                    )}
                  </div> */}
                </div>
              ))}

              {filteredPlaybooks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No playbooks found for this category yet.
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

