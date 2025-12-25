"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import type { ContextItem } from "@/lib/api/client";

interface ProductsServicesFormProps {
  items: ContextItem[];
  onAdd: () => void;
  onUpdate: (index: number, item: Partial<ContextItem>) => void;
  onDelete: (index: number) => void;
  label?: string;
}

export function ProductsServicesForm({
  items,
  onAdd,
  onUpdate,
  onDelete,
  label = "Products & Services",
}: ProductsServicesFormProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getExtraField = (item: ContextItem, field: string, defaultValue: any = []) => {
    return (item.extra as any)?.[field] || defaultValue;
  };

  const updateExtraField = (
    idx: number,
    field: string,
    value: any
  ) => {
    onUpdate(idx, {
      extra: {
        ...(items[idx].extra as any),
        [field]: value,
      },
    });
  };

  const addArrayItem = (idx: number, field: string) => {
    const current = getExtraField(items[idx], field, []);
    updateExtraField(idx, field, [...current, ""]);
  };

  const updateArrayItem = (idx: number, field: string, arrayIdx: number, value: string) => {
    const current = getExtraField(items[idx], field, []);
    const updated = [...current];
    updated[arrayIdx] = value;
    updateExtraField(idx, field, updated);
  };

  const removeArrayItem = (idx: number, field: string, arrayIdx: number) => {
    const current = getExtraField(items[idx], field, []);
    updateExtraField(idx, field, current.filter((_: any, i: number) => i !== arrayIdx));
  };

  const addPricingPlan = (idx: number) => {
    const current = getExtraField(items[idx], "pricing_plans", []);
    updateExtraField(idx, "pricing_plans", [
      ...current,
      { name: "", price: "", features: [] },
    ]);
  };

  const updatePricingPlan = (
    idx: number,
    planIdx: number,
    field: string,
    value: any
  ) => {
    const current = getExtraField(items[idx], "pricing_plans", []);
    const updated = [...current];
    updated[planIdx] = { ...updated[planIdx], [field]: value };
    updateExtraField(idx, "pricing_plans", updated);
  };

  const removePricingPlan = (idx: number, planIdx: number) => {
    const current = getExtraField(items[idx], "pricing_plans", []);
    updateExtraField(idx, "pricing_plans", current.filter((_: any, i: number) => i !== planIdx));
  };

  const addPlanFeature = (idx: number, planIdx: number) => {
    const current = getExtraField(items[idx], "pricing_plans", []);
    const plan = current[planIdx] || { name: "", price: "", features: [] };
    const updated = [...current];
    updated[planIdx] = {
      ...plan,
      features: [...(plan.features || []), ""],
    };
    updateExtraField(idx, "pricing_plans", updated);
  };

  const updatePlanFeature = (
    idx: number,
    planIdx: number,
    featureIdx: number,
    value: string
  ) => {
    const current = getExtraField(items[idx], "pricing_plans", []);
    const updated = [...current];
    const plan = updated[planIdx];
    const features = [...(plan.features || [])];
    features[featureIdx] = value;
    updated[planIdx] = { ...plan, features };
    updateExtraField(idx, "pricing_plans", updated);
  };

  const removePlanFeature = (idx: number, planIdx: number, featureIdx: number) => {
    const current = getExtraField(items[idx], "pricing_plans", []);
    const updated = [...current];
    const plan = updated[planIdx];
    updated[planIdx] = {
      ...plan,
      features: (plan.features || []).filter((_: any, i: number) => i !== featureIdx),
    };
    updateExtraField(idx, "pricing_plans", updated);
  };

  return (
    <div className="space-y-3" lang="en">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">
          {label} {items.length > 0 && <span>({items.length})</span>}
        </Label>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div
            className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md cursor-pointer hover:bg-accent/50"
            onClick={onAdd}
          >
            Click + to add {label.toLowerCase()}
          </div>
        ) : (
          items.map((item, idx) => {
            const isExpanded = expandedItems.has(item.id);
            const features = getExtraField(item, "features", []);
            const benefits = getExtraField(item, "benefits", []);
            const howItWorks = getExtraField(item, "how_it_works", []);
            const pricingPlans = getExtraField(item, "pricing_plans", []);

            return (
              <div
                key={item.id}
                className="border rounded-md p-2 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Input
                    placeholder="Title..."
                    value={item.title || ""}
                    onChange={(e) => onUpdate(idx, { title: e.target.value })}
                    className="text-xs h-8 flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => onDelete(idx)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {isExpanded && (
                  <div className="space-y-2 pl-8">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Description
                      </Label>
                      <Textarea
                        placeholder="Description..."
                        value={item.description || ""}
                        onChange={(e) =>
                          onUpdate(idx, { description: e.target.value })
                        }
                        className="text-xs min-h-[60px]"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        URL
                      </Label>
                      <Input
                        placeholder="https://..."
                        value={item.url || ""}
                        onChange={(e) => onUpdate(idx, { url: e.target.value })}
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Image URL
                      </Label>
                      <Input
                        placeholder="https://..."
                        value={item.image_url || ""}
                        onChange={(e) =>
                          onUpdate(idx, { image_url: e.target.value })
                        }
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Notes
                      </Label>
                      <Textarea
                        placeholder="Notes..."
                        value={item.notes || ""}
                        onChange={(e) =>
                          onUpdate(idx, { notes: e.target.value })
                        }
                        className="text-xs min-h-[40px]"
                        rows={2}
                      />
                    </div>

                    {/* Features */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Features {features.length > 0 && <span>({features.length})</span>}
                        </Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => addArrayItem(idx, "features")}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {features.length === 0 ? (
                          <div
                            className="text-xs text-muted-foreground text-center py-1 border border-dashed rounded cursor-pointer hover:bg-accent/50"
                            onClick={() => addArrayItem(idx, "features")}
                          >
                            Click + to add features
                          </div>
                        ) : (
                          features.map((feature: string, fIdx: number) => (
                            <div key={fIdx} className="flex gap-1 group">
                              <Input
                                placeholder="Feature..."
                                value={feature || ""}
                                onChange={(e) =>
                                  updateArrayItem(idx, "features", fIdx, e.target.value)
                                }
                                className="text-xs h-7"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
                                onClick={() => removeArrayItem(idx, "features", fIdx)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Benefits {benefits.length > 0 && <span>({benefits.length})</span>}
                        </Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => addArrayItem(idx, "benefits")}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {benefits.length === 0 ? (
                          <div
                            className="text-xs text-muted-foreground text-center py-1 border border-dashed rounded cursor-pointer hover:bg-accent/50"
                            onClick={() => addArrayItem(idx, "benefits")}
                          >
                            Click + to add benefits
                          </div>
                        ) : (
                          benefits.map((benefit: string, bIdx: number) => (
                            <div key={bIdx} className="flex gap-1 group">
                              <Input
                                placeholder="Benefit..."
                                value={benefit || ""}
                                onChange={(e) =>
                                  updateArrayItem(idx, "benefits", bIdx, e.target.value)
                                }
                                className="text-xs h-7"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
                                onClick={() => removeArrayItem(idx, "benefits", bIdx)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* How It Works */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                          How It Works {howItWorks.length > 0 && <span>({howItWorks.length})</span>}
                        </Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => addArrayItem(idx, "how_it_works")}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {howItWorks.length === 0 ? (
                          <div
                            className="text-xs text-muted-foreground text-center py-1 border border-dashed rounded cursor-pointer hover:bg-accent/50"
                            onClick={() => addArrayItem(idx, "how_it_works")}
                          >
                            Click + to add steps
                          </div>
                        ) : (
                          howItWorks.map((step: string, sIdx: number) => (
                            <div key={sIdx} className="flex gap-1 group">
                              <Input
                                placeholder="Step..."
                                value={step || ""}
                                onChange={(e) =>
                                  updateArrayItem(idx, "how_it_works", sIdx, e.target.value)
                                }
                                className="text-xs h-7"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
                                onClick={() => removeArrayItem(idx, "how_it_works", sIdx)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Pricing Plans */}
                    <div className="space-y-2 border-t pt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Pricing Plans {pricingPlans.length > 0 && <span>({pricingPlans.length})</span>}
                        </Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => addPricingPlan(idx)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {pricingPlans.length === 0 ? (
                          <div
                            className="text-xs text-muted-foreground text-center py-1 border border-dashed rounded cursor-pointer hover:bg-accent/50"
                            onClick={() => addPricingPlan(idx)}
                          >
                            Click + to add pricing plan
                          </div>
                        ) : (
                          pricingPlans.map((plan: any, pIdx: number) => (
                            <div
                              key={pIdx}
                              className="border rounded p-2 space-y-2 bg-muted/30"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Plan name..."
                                    value={plan.name || ""}
                                    onChange={(e) =>
                                      updatePricingPlan(idx, pIdx, "name", e.target.value)
                                    }
                                    className="text-xs h-7"
                                  />
                                  <Input
                                    placeholder="Price..."
                                    value={plan.price || ""}
                                    onChange={(e) =>
                                      updatePricingPlan(idx, pIdx, "price", e.target.value)
                                    }
                                    className="text-xs h-7"
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 shrink-0"
                                  onClick={() => removePricingPlan(idx, pIdx)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="space-y-1 pl-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">
                                    Features
                                  </Label>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => addPlanFeature(idx, pIdx)}
                                  >
                                    <Plus className="h-2.5 w-2.5" />
                                  </Button>
                                </div>
                                <div className="space-y-1">
                                  {(plan.features || []).map((feature: string, fIdx: number) => (
                                    <div key={fIdx} className="flex gap-1 group">
                                      <Input
                                        placeholder="Feature..."
                                        value={feature || ""}
                                        onChange={(e) =>
                                          updatePlanFeature(idx, pIdx, fIdx, e.target.value)
                                        }
                                        className="text-xs h-6"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                                        onClick={() => removePlanFeature(idx, pIdx, fIdx)}
                                      >
                                        <X className="h-2.5 w-2.5" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

