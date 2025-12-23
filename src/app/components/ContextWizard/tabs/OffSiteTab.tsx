/**
 * OffSite Tab Component
 * Displays off-site presence information (social, reviews, media, etc.)
 */

import React from "react";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import {
  Target,
  Building2,
  Star,
  MessageSquare,
  Newspaper,
  Users,
} from "lucide-react";
import type { TabProps } from "../types";
import { ReadOnlyField } from "../components/ReadOnlyField";
import { SectionHeader } from "../components/SectionHeader";
import { SubSectionHeader } from "../components/SubSectionHeader";

export function OffSiteTab({ contextData, openEditDialog }: TabProps) {
  return (
    <TabsContent value="offSite" className="p-8 m-0 h-full overflow-y-auto">
      <div className="flex gap-8 pb-12">
        {/* Left Column - 1/3 Width: Monitoring Scope */}
        <div className="w-1/3 shrink-0 space-y-5">
          {/* Monitoring Scope */}
          <div className="p-5 border rounded-xl bg-card/50 space-y-5">
            <SectionHeader
              icon={Target}
              title="Monitoring Scope"
              label="Monitoring Scope"
              onEdit={openEditDialog}
            />

            {/* Keywords & Signals */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Brand Keywords
                </Label>
                <div className="space-y-1">
                  {(contextData.offSite.monitoringScope?.brandKeywords || [])
                    .length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No brand keywords
                    </div>
                  ) : (
                    (contextData.offSite.monitoringScope.brandKeywords || []).map(
                      (keyword: string, idx: number) => (
                        <ReadOnlyField
                          key={idx}
                          value={keyword}
                          placeholder="Brand keyword"
                        />
                      )
                    )
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Product Keywords
                </Label>
                <div className="space-y-1">
                  {(contextData.offSite.monitoringScope?.productKeywords || [])
                    .length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No product keywords
                    </div>
                  ) : (
                    (contextData.offSite.monitoringScope.productKeywords || []).map(
                      (keyword: string, idx: number) => (
                        <ReadOnlyField
                          key={idx}
                          value={keyword}
                          placeholder="Product keyword"
                        />
                      )
                    )
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Key Persons
                </Label>
                <div className="space-y-1">
                  {(contextData.offSite.monitoringScope?.keyPersons || [])
                    .length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No key persons
                    </div>
                  ) : (
                    (contextData.offSite.monitoringScope.keyPersons || []).map(
                      (person: string, idx: number) => (
                        <ReadOnlyField
                          key={idx}
                          value={person}
                          placeholder="Person name"
                        />
                      )
                    )
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Hashtags
                </Label>
                <div className="space-y-1">
                  {(contextData.offSite.monitoringScope?.hashtags || []).length ===
                  0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No hashtags
                    </div>
                  ) : (
                    (contextData.offSite.monitoringScope.hashtags || []).map(
                      (hashtag: string, idx: number) => (
                        <ReadOnlyField
                          key={idx}
                          value={hashtag}
                          placeholder="#hashtag"
                        />
                      )
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Required Keywords (AND)
                </Label>
                <div className="space-y-1">
                  {(contextData.offSite.monitoringScope?.requiredKeywords || [])
                    .length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No required keywords
                    </div>
                  ) : (
                    (contextData.offSite.monitoringScope.requiredKeywords || []).map(
                      (keyword: string, idx: number) => (
                        <ReadOnlyField
                          key={idx}
                          value={keyword}
                          placeholder="Required keyword"
                        />
                      )
                    )
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Excluded Keywords
                </Label>
                <div className="space-y-1">
                  {(contextData.offSite.monitoringScope?.excludedKeywords || [])
                    .length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No excluded keywords
                    </div>
                  ) : (
                    (contextData.offSite.monitoringScope.excludedKeywords || []).map(
                      (keyword: string, idx: number) => (
                        <ReadOnlyField
                          key={idx}
                          value={keyword}
                          placeholder="Excluded keyword"
                        />
                      )
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Geographic & Language */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Regions
                  </Label>
                  <div className="space-y-1">
                    {(contextData.offSite.monitoringScope?.regions || []).length ===
                    0 ? (
                      <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                        None
                      </div>
                    ) : (
                      (contextData.offSite.monitoringScope.regions || []).map(
                        (region: string, idx: number) => (
                          <ReadOnlyField
                            key={idx}
                            value={region}
                            placeholder="Region"
                            className="text-xs"
                          />
                        )
                      )
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Languages
                  </Label>
                  <div className="space-y-1">
                    {(contextData.offSite.monitoringScope?.languages || [])
                      .length === 0 ? (
                      <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                        None
                      </div>
                    ) : (
                      (contextData.offSite.monitoringScope.languages || []).map(
                        (lang: string, idx: number) => (
                          <ReadOnlyField
                            key={idx}
                            value={lang}
                            placeholder="Language"
                            className="text-xs"
                          />
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 2/3 Width: MECE Layout */}
        <div className="flex-1 space-y-5">
          {/* Owned Presence */}
          <div className="p-5 border rounded-xl bg-card/50 space-y-4">
            <SubSectionHeader
              icon={Building2}
              title="Owned Presence"
              label="Owned Presence"
              onEdit={openEditDialog}
            />
            <div className="grid grid-cols-2 gap-4">
              {/* Official Channels */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Official Channels
                  </Label>
                </div>
                <div
                  className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => openEditDialog("Social Profiles")}
                >
                  {contextData.offSite.socialAccounts.length === 0 ? (
                    <>Click to manage social media channels</>
                  ) : (
                    <>
                      {contextData.offSite.socialAccounts.length} channel
                      {contextData.offSite.socialAccounts.length > 1 ? "s" : ""}{" "}
                      configured
                    </>
                  )}
                </div>
              </div>

              {/* Executive Accounts */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Executive Accounts
                </Label>
                <div className="space-y-1">
                  {((contextData.offSite as any).executiveAccounts || [])
                    .length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No executive accounts
                    </div>
                  ) : (
                    ((contextData.offSite as any).executiveAccounts || []).map(
                      (e: any) => (
                        <div
                          key={e.id}
                          className="p-2 border rounded bg-muted/30 text-xs"
                        >
                          <div className="font-medium">{e.name}</div>
                          {e.xUrl && (
                            <div className="text-muted-foreground truncate">
                              X: {e.xUrl}
                            </div>
                          )}
                          {e.linkedinUrl && (
                            <div className="text-muted-foreground truncate">
                              LinkedIn: {e.linkedinUrl}
                            </div>
                          )}
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & Community */}
          <div className="grid grid-cols-2 gap-4">
            {/* Reviews & Listings */}
            <div className="p-5 border rounded-xl bg-card/50 space-y-4">
              <SubSectionHeader
                icon={Star}
                title="Reviews & Listings"
                label="Reviews & Listings"
                onEdit={openEditDialog}
              />

              {/* Reviews */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Review Platforms
                </Label>
                <div className="space-y-1">
                  {contextData.offSite.reviewPlatforms.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No review platforms
                    </div>
                  ) : (
                    contextData.offSite.reviewPlatforms.map((r: any) => (
                      <div
                        key={r.id}
                        className="p-2 border rounded bg-muted/30 text-xs"
                      >
                        <div className="font-medium">{r.platform}</div>
                        {r.profileUrl && (
                          <div className="text-muted-foreground truncate">
                            {r.profileUrl}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Directories */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs text-muted-foreground">
                  Directories
                </Label>
                <div className="space-y-1">
                  {((contextData.offSite as any).directoryListings || [])
                    .length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No directories
                    </div>
                  ) : (
                    ((contextData.offSite as any).directoryListings || []).map(
                      (d: any) => (
                        <div
                          key={d.id}
                          className="p-2 border rounded bg-muted/30 text-xs"
                        >
                          <div className="font-medium">{d.directoryName}</div>
                          {d.listingUrl && (
                            <div className="text-muted-foreground truncate">
                              {d.listingUrl}
                            </div>
                          )}
                        </div>
                      )
                    )
                  )}
                </div>
              </div>

              {/* Storefronts */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs text-muted-foreground">
                  Storefronts
                </Label>
                <div className="space-y-1">
                  {contextData.offSite.ecommercePlatforms.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No storefronts
                    </div>
                  ) : (
                    contextData.offSite.ecommercePlatforms.map((e: any) => (
                      <div
                        key={e.id}
                        className="p-2 border rounded bg-muted/30 text-xs"
                      >
                        <div className="font-medium">{e.platform}</div>
                        {e.storeUrl && (
                          <div className="text-muted-foreground truncate">
                            {e.storeUrl}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="p-4 border rounded-lg bg-card/50 space-y-3">
              <SubSectionHeader
                icon={MessageSquare}
                title="Community"
                label="Community Forums"
                onEdit={openEditDialog}
              />

              {/* Forums */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Forums</Label>
                <div className="space-y-1">
                  {contextData.offSite.communities.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No forums
                    </div>
                  ) : (
                    contextData.offSite.communities.map((c: any) => (
                      <div
                        key={c.id}
                        className="p-2 border rounded bg-muted/30 text-xs"
                      >
                        <div className="font-medium">{c.platformType}</div>
                        {c.url && (
                          <div className="text-muted-foreground truncate">
                            {c.url}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Q&A */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs text-muted-foreground">
                  Q&A Platforms
                </Label>
                <div className="space-y-1">
                  {contextData.offSite.qaPlatforms.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No Q&A platforms
                    </div>
                  ) : (
                    contextData.offSite.qaPlatforms.map((q: any) => (
                      <div
                        key={q.id}
                        className="p-2 border rounded bg-muted/30 text-xs"
                      >
                        <div className="font-medium">{q.platform}</div>
                        {q.url && (
                          <div className="text-muted-foreground truncate">
                            {q.url}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Groups */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs text-muted-foreground">
                  Professional Groups
                </Label>
                <div className="space-y-1">
                  {((contextData.offSite as any).professionalNetworks || [])
                    .length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No groups
                    </div>
                  ) : (
                    ((contextData.offSite as any).professionalNetworks || []).map(
                      (p: any) => (
                        <div
                          key={p.id}
                          className="p-2 border rounded bg-muted/30 text-xs"
                        >
                          <div className="font-medium">{p.platform}</div>
                          {p.url && (
                            <div className="text-muted-foreground truncate">
                              {p.url}
                            </div>
                          )}
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Media & KOLs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Media */}
            <div className="p-4 border rounded-lg bg-card/50 space-y-3">
              <SubSectionHeader
                icon={Newspaper}
                title="Media"
                label="Press Coverage"
                onEdit={openEditDialog}
              />

              {/* Channels */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Media Channels
                </Label>
                <div className="space-y-1">
                  {contextData.offSite.mediaSources.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No media channels
                    </div>
                  ) : (
                    contextData.offSite.mediaSources.map((m: any) => (
                      <div
                        key={m.id}
                        className="p-2 border rounded bg-muted/30 text-xs"
                      >
                        <div className="font-medium">{m.type}</div>
                        {m.url && (
                          <div className="text-muted-foreground truncate">
                            {m.url}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Coverage */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs text-muted-foreground">
                  Press Coverage
                </Label>
                <div className="space-y-1">
                  {((contextData.offSite as any).backlinks || []).length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No coverage
                    </div>
                  ) : (
                    ((contextData.offSite as any).backlinks || []).map((b: any) => (
                      <div
                        key={b.id}
                        className="p-2 border rounded bg-muted/30 text-xs"
                      >
                        <div className="font-medium">{b.type}</div>
                        {b.pageUrl && (
                          <div className="text-muted-foreground truncate">
                            {b.pageUrl}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Events */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs text-muted-foreground">Events</Label>
                <div className="space-y-1">
                  {((contextData.offSite as any).externalEvents || []).length ===
                  0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No events
                    </div>
                  ) : (
                    ((contextData.offSite as any).externalEvents || []).map(
                      (ev: any) => (
                        <div
                          key={ev.id}
                          className="p-2 border rounded bg-muted/30 text-xs"
                        >
                          <div className="font-medium">{ev.type}</div>
                          {ev.url && (
                            <div className="text-muted-foreground truncate">
                              {ev.url}
                            </div>
                          )}
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>

            {/* KOLs */}
            <div className="p-4 border rounded-lg bg-card/50 space-y-3">
              <SubSectionHeader
                icon={Users}
                title="KOLs"
                label="KOLs"
                onEdit={openEditDialog}
              />

              {/* Creators */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Creators</Label>
                <div className="space-y-1">
                  {contextData.offSite.influencerAccounts.filter(
                    (i: any) => i.role === "kol"
                  ).length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No creators
                    </div>
                  ) : (
                    contextData.offSite.influencerAccounts
                      .filter((i: any) => i.role === "kol")
                      .map((i: any) => (
                        <div
                          key={i.id}
                          className="p-2 border rounded bg-muted/30 text-xs"
                        >
                          <div className="font-medium">{i.platform}</div>
                          {i.url && (
                            <div className="text-muted-foreground truncate">
                              {i.url}
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Experts */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs text-muted-foreground">
                  Industry Experts
                </Label>
                <div className="space-y-1">
                  {contextData.offSite.influencerAccounts.filter(
                    (i: any) => i.role === "analyst"
                  ).length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No experts
                    </div>
                  ) : (
                    contextData.offSite.influencerAccounts
                      .filter((i: any) => i.role === "analyst")
                      .map((i: any) => (
                        <div
                          key={i.id}
                          className="p-2 border rounded bg-muted/30 text-xs"
                        >
                          <div className="font-medium">{i.platform}</div>
                          {i.url && (
                            <div className="text-muted-foreground truncate">
                              {i.url}
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Press */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs text-muted-foreground">
                  Press Contacts
                </Label>
                <div className="space-y-1">
                  {contextData.offSite.influencerAccounts.filter(
                    (i: any) => i.role === "journalist" || i.role === "media"
                  ).length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
                      No press contacts
                    </div>
                  ) : (
                    contextData.offSite.influencerAccounts
                      .filter(
                        (i: any) => i.role === "journalist" || i.role === "media"
                      )
                      .map((i: any) => (
                        <div
                          key={i.id}
                          className="p-2 border rounded bg-muted/30 text-xs"
                        >
                          <div className="font-medium">{i.platform}</div>
                          {i.url && (
                            <div className="text-muted-foreground truncate">
                              {i.url}
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}

