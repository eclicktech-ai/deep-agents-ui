/**
 * Skill Form Fields Configuration
 * Defines form fields for each skill based on their agentName or skill_id
 */

export type FormFieldType = 'text' | 'textarea' | 'url' | 'urls';

export interface FormField {
  key: string;
  label: string;
  type: FormFieldType;
  placeholder: string;
  required: boolean;
  autoFill?: 'domain' | 'competitorDomains' | 'niche'; // Which field to auto-fill from project/context
  helpText?: string;
}

export interface SkillFormConfig {
  fields: FormField[];
}

/**
 * Map of skill identifiers to their form configurations
 * Uses agentName or skill_id to match skills
 */
export const skillFormConfigs: Record<string, SkillFormConfig> = {
  // Keyword Research
  'keyword-research': {
    fields: [
      {
        key: 'targetUrl',
        label: 'Target Website URL',
        type: 'url',
        placeholder: 'e.g., example.com',
        required: true,
        autoFill: 'domain',
        helpText: 'The website you want to analyze for keyword opportunities',
      },
      {
        key: 'focusTopic',
        label: 'Focus Topic / Keywords (Optional)',
        type: 'text',
        placeholder: 'e.g., project management software, sustainable fashion',
        required: false,
      },
      {
        key: 'competitorUrls',
        label: 'Known Competitor URLs (Optional, Comma-separated)',
        type: 'urls',
        placeholder: 'e.g., competitor1.com, competitor2.com',
        required: false,
        autoFill: 'competitorDomains',
      },
    ],
  },
  
  // SERP Analysis
  'serp-analysis': {
    fields: [
      {
        key: 'targetUrl',
        label: 'Target Website URL',
        type: 'url',
        placeholder: 'e.g., example.com',
        required: true,
        autoFill: 'domain',
      },
      {
        key: 'keywords',
        label: 'Keywords to Analyze (Optional)',
        type: 'text',
        placeholder: 'e.g., best project management tools, agile software',
        required: false,
      },
    ],
  },
  
  // Competitor Analysis
  'competitor-analysis': {
    fields: [
      {
        key: 'targetUrl',
        label: 'Target Website URL',
        type: 'url',
        placeholder: 'e.g., example.com',
        required: true,
        autoFill: 'domain',
      },
      {
        key: 'competitorUrls',
        label: 'Competitor URLs (Optional, Comma-separated)',
        type: 'urls',
        placeholder: 'e.g., competitor1.com, competitor2.com',
        required: false,
        autoFill: 'competitorDomains',
      },
      {
        key: 'analysisFocus',
        label: 'Analysis Focus (Optional)',
        type: 'text',
        placeholder: 'e.g., pricing, features, market positioning',
        required: false,
      },
    ],
  },
  
  // Content Gap Analysis
  'content-gap-analysis': {
    fields: [
      {
        key: 'targetUrl',
        label: 'Target Website URL',
        type: 'url',
        placeholder: 'e.g., example.com',
        required: true,
        autoFill: 'domain',
      },
      {
        key: 'competitorUrls',
        label: 'Competitor URLs (Optional, Comma-separated)',
        type: 'urls',
        placeholder: 'e.g., competitor1.com, competitor2.com',
        required: false,
        autoFill: 'competitorDomains',
      },
      {
        key: 'niche',
        label: 'Niche / Industry Focus (Optional)',
        type: 'text',
        placeholder: 'e.g., SaaS, E-commerce, Healthcare',
        required: false,
        autoFill: 'niche',
      },
    ],
  },
  
  // Gap Analyst / Gap Analysis (alternative names)
  'gap-analyst': {
    fields: [
      {
        key: 'targetUrl',
        label: 'Target Website URL',
        type: 'url',
        placeholder: 'e.g., example.com',
        required: true,
        autoFill: 'domain',
      },
      {
        key: 'competitorUrls',
        label: 'Competitor URLs (Optional, Comma-separated)',
        type: 'urls',
        placeholder: 'e.g., competitor1.com, competitor2.com',
        required: false,
        autoFill: 'competitorDomains',
      },
      {
        key: 'niche',
        label: 'Niche / Industry Focus (Optional)',
        type: 'text',
        placeholder: 'e.g., SaaS, E-commerce, Healthcare',
        required: false,
        autoFill: 'niche',
      },
    ],
  },
  
  'gap-analysis': {
    fields: [
      {
        key: 'targetUrl',
        label: 'Target Website URL',
        type: 'url',
        placeholder: 'e.g., example.com',
        required: true,
        autoFill: 'domain',
      },
      {
        key: 'competitorUrls',
        label: 'Competitor URLs (Optional, Comma-separated)',
        type: 'urls',
        placeholder: 'e.g., competitor1.com, competitor2.com',
        required: false,
        autoFill: 'competitorDomains',
      },
      {
        key: 'niche',
        label: 'Niche / Industry Focus (Optional)',
        type: 'text',
        placeholder: 'e.g., SaaS, E-commerce, Healthcare',
        required: false,
        autoFill: 'niche',
      },
    ],
  },
};

/**
 * Default form configuration for skills without specific configuration
 * Provides a common set of fields that most research skills need
 */
const defaultFormConfig: SkillFormConfig = {
  fields: [
    {
      key: 'targetUrl',
      label: 'Target Website URL',
      type: 'url',
      placeholder: 'e.g., example.com',
      required: true,
      autoFill: 'domain',
      helpText: 'The website you want to analyze',
    },
    {
      key: 'competitorUrls',
      label: 'Competitor URLs (Optional, Comma-separated)',
      type: 'urls',
      placeholder: 'e.g., competitor1.com, competitor2.com',
      required: false,
      autoFill: 'competitorDomains',
    },
    {
      key: 'additionalContext',
      label: 'Additional Context (Optional)',
      type: 'text',
      placeholder: 'e.g., specific focus areas, industry, or requirements',
      required: false,
    },
  ],
};

/**
 * Get form configuration for a skill by its agentName, skill_id, title, or tags
 * Returns default config if no specific config is found
 */
export function getSkillFormConfig(
  agentName: string, 
  skillId?: string, 
  title?: string, 
  tags?: string[]
): SkillFormConfig {
  // Normalize the name for matching
  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Try to match by skill_id first (if provided)
  if (skillId) {
    const normalizedId = normalize(skillId);
    if (skillFormConfigs[normalizedId]) {
      return skillFormConfigs[normalizedId];
    }
  }
  
  // Try to match by agentName (normalized to lowercase with hyphens)
  const normalizedName = normalize(agentName);
  if (skillFormConfigs[normalizedName]) {
    return skillFormConfigs[normalizedName];
  }
  
  // Try to match by title if provided
  if (title) {
    const normalizedTitle = normalize(title);
    if (skillFormConfigs[normalizedTitle]) {
      return skillFormConfigs[normalizedTitle];
    }
  }
  
  // Try to match by tags if provided
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      const normalizedTag = normalize(tag.replace(/^#+/, '')); // Remove leading # symbols
      if (skillFormConfigs[normalizedTag]) {
        return skillFormConfigs[normalizedTag];
      }
    }
  }
  
  // Try partial matching for common patterns
  // Check if any key is contained in the normalized name or vice versa
  for (const [key, config] of Object.entries(skillFormConfigs)) {
    // Check if key words match (e.g., "keyword" and "research" in "keyword-research")
    const keyWords = key.split('-');
    const nameWords = normalizedName.split('-');
    
    // If all key words are found in the name, it's a match
    const allWordsMatch = keyWords.every(kw => 
      nameWords.some(nw => nw.includes(kw) || kw.includes(nw))
    );
    
    if (allWordsMatch || normalizedName.includes(key) || key.includes(normalizedName)) {
      return config;
    }
  }
  
  // Also check title if provided
  if (title) {
    const normalizedTitle = normalize(title);
    for (const [key, config] of Object.entries(skillFormConfigs)) {
      if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
        return config;
      }
    }
  }
  
  // Enhanced keyword matching - check for key terms in name/title
  const searchText = `${normalizedName} ${title ? normalize(title) : ''}`.toLowerCase();
  
  // Special case: if name contains "gap" and "analysis" (or "analyst"), match to gap-analysis config
  if (searchText.includes('gap')) {
    if (searchText.includes('analysis') || searchText.includes('analyst') || searchText.includes('content')) {
      return skillFormConfigs['gap-analysis'] || skillFormConfigs['content-gap-analysis'] || skillFormConfigs['gap-analyst'];
    }
  }
  
  // Special case: if name contains "keyword" and "research", match to keyword-research
  if (searchText.includes('keyword') && searchText.includes('research')) {
    return skillFormConfigs['keyword-research'];
  }
  
  // Special case: if name contains "serp" and "analysis", match to serp-analysis
  if (searchText.includes('serp') && searchText.includes('analysis')) {
    return skillFormConfigs['serp-analysis'];
  }
  
  // Special case: if name contains "competitor" and "analysis", match to competitor-analysis
  if (searchText.includes('competitor') && searchText.includes('analysis')) {
    return skillFormConfigs['competitor-analysis'];
  }
  
  // Special case: if name contains "content" and "gap", match to content-gap-analysis
  if (searchText.includes('content') && searchText.includes('gap')) {
    return skillFormConfigs['content-gap-analysis'] || skillFormConfigs['gap-analysis'];
  }
  
  // Return default config for skills without specific configuration
  // This ensures all skills will have at least a basic form
  return defaultFormConfig;
}

