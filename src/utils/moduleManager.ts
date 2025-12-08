import { RegulatoryModule, ModuleConfiguration } from '../types';

/**
 * Available regulatory modules
 */
export const AVAILABLE_MODULES: RegulatoryModule[] = [
  {
    id: 'eudr',
    name: 'EU Deforestation Regulation (EUDR)',
    description: 'Compliance tracking for EUDR covering commodities like cattle, cocoa, coffee, palm oil, rubber, soya, and wood. Track due diligence, geolocation data, and evidence requirements.',
    status: 'active',
    regulations: ['EUDR', 'EU Regulation 2023/1115'],
    features: {
      exposureAnalysis: true,
      evidenceRequirements: true,
      complianceTracking: true,
      reporting: true
    },
    configuration: {
      enabled: false,
      applicableSectors: ['agriculture', 'forestry', 'food', 'retail'],
      applicableGeographies: ['EU']
    },
    route: '/modules/eudr',
    icon: '🌳'
  },
  {
    id: 'child-labor',
    name: 'Child Labor & Social Compliance',
    description: 'Track labor risk assessments, supplier audits, remediation actions, and certifications (SMETA, SA8000) for social compliance requirements.',
    status: 'active',
    regulations: ['UK Modern Slavery Act', 'California Transparency Act', 'EU Forced Labor Regulation'],
    features: {
      exposureAnalysis: true,
      evidenceRequirements: true,
      complianceTracking: true,
      reporting: true
    },
    configuration: {
      enabled: false,
      applicableSectors: ['manufacturing', 'agriculture', 'retail', 'textiles'],
      applicableGeographies: ['global']
    },
    route: '/modules/child-labor',
    icon: '👥'
  },
  {
    id: 'supply-chain-transparency',
    name: 'Supply Chain Transparency',
    description: 'Map supply chain tiers, track transparency requirements, manage supplier data collection, and analyze risk propagation through the supply chain.',
    status: 'active',
    regulations: ['UK Modern Slavery Act', 'German Supply Chain Act', 'French Duty of Vigilance'],
    features: {
      exposureAnalysis: true,
      evidenceRequirements: true,
      complianceTracking: true,
      reporting: true
    },
    configuration: {
      enabled: false,
      applicableSectors: ['all'],
      applicableGeographies: ['global']
    },
    route: '/modules/supply-chain',
    icon: '🔗'
  },
  {
    id: 'climate-disclosure',
    name: 'Climate & Environmental Disclosure',
    description: 'Track disclosure requirements for CSRD, TCFD, SEC Climate rules. Manage climate data collection, scenario analysis, and target setting disclosures.',
    status: 'active',
    regulations: ['CSRD', 'TCFD', 'SEC Climate Disclosure', 'ISSB'],
    features: {
      exposureAnalysis: true,
      evidenceRequirements: true,
      complianceTracking: true,
      reporting: true
    },
    configuration: {
      enabled: false,
      applicableSectors: ['all'],
      applicableGeographies: ['EU', 'US', 'UK']
    },
    route: '/modules/climate',
    icon: '🌍'
  }
];

/**
 * Get all modules
 */
export function getAllModules(): RegulatoryModule[] {
  return AVAILABLE_MODULES;
}

/**
 * Get active modules
 */
export function getActiveModules(): RegulatoryModule[] {
  const stored = localStorage.getItem('activeModules');
  if (!stored) return [];
  
  const activeIds = JSON.parse(stored) as string[];
  return AVAILABLE_MODULES.filter(module => activeIds.includes(module.id));
}

/**
 * Get module by ID
 */
export function getModuleById(id: string): RegulatoryModule | undefined {
  return AVAILABLE_MODULES.find(module => module.id === id);
}

/**
 * Activate a module
 */
export function activateModule(moduleId: string): void {
  const activeModules = getActiveModules().map(m => m.id);
  if (!activeModules.includes(moduleId)) {
    activeModules.push(moduleId);
    localStorage.setItem('activeModules', JSON.stringify(activeModules));
  }
}

/**
 * Deactivate a module
 */
export function deactivateModule(moduleId: string): void {
  const activeModules = getActiveModules().map(m => m.id);
  const filtered = activeModules.filter(id => id !== moduleId);
  localStorage.setItem('activeModules', JSON.stringify(filtered));
}

/**
 * Check if module is active
 */
export function isModuleActive(moduleId: string): boolean {
  const activeModules = getActiveModules().map(m => m.id);
  return activeModules.includes(moduleId);
}

/**
 * Update module configuration
 */
export function updateModuleConfiguration(
  moduleId: string,
  configuration: Partial<ModuleConfiguration>
): void {
  const module = getModuleById(moduleId);
  if (!module) return;
  
  module.configuration = {
    ...module.configuration,
    ...configuration
  };
  
  // Store updated configuration
  const configs = JSON.parse(localStorage.getItem('moduleConfigurations') || '{}');
  configs[moduleId] = module.configuration;
  localStorage.setItem('moduleConfigurations', JSON.stringify(configs));
}

/**
 * Get module configuration
 */
export function getModuleConfiguration(moduleId: string): ModuleConfiguration | null {
  const configs = JSON.parse(localStorage.getItem('moduleConfigurations') || '{}');
  return configs[moduleId] || getModuleById(moduleId)?.configuration || null;
}

