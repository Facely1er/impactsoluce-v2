export interface Alert {
  id: string;
  type: 'deadline' | 'compliance' | 'risk' | 'evidence';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  relatedEntity?: string;
  relatedEntityType?: 'regulation' | 'supplier' | 'evidence' | 'assessment';
  deadline?: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

export interface AlertPreferences {
  emailNotifications: boolean;
  deadlineAlerts: boolean;
  complianceAlerts: boolean;
  riskAlerts: boolean;
  evidenceAlerts: boolean;
  daysBeforeDeadline: number; // Alert X days before deadline
}

const DEFAULT_PREFERENCES: AlertPreferences = {
  emailNotifications: true,
  deadlineAlerts: true,
  complianceAlerts: true,
  riskAlerts: true,
  evidenceAlerts: true,
  daysBeforeDeadline: 7
};

/**
 * Get alert preferences from localStorage
 */
export function getAlertPreferences(): AlertPreferences {
  const stored = localStorage.getItem('alertPreferences');
  if (stored) {
    try {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Save alert preferences to localStorage
 */
export function saveAlertPreferences(preferences: Partial<AlertPreferences>): void {
  const current = getAlertPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem('alertPreferences', JSON.stringify(updated));
}

/**
 * Get all alerts from localStorage
 */
export function getAlerts(): Alert[] {
  const stored = localStorage.getItem('alerts');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Save alerts to localStorage
 */
export function saveAlerts(alerts: Alert[]): void {
  localStorage.setItem('alerts', JSON.stringify(alerts));
}

/**
 * Add a new alert
 */
export function addAlert(alert: Omit<Alert, 'id' | 'createdAt' | 'acknowledged'>): Alert {
  const alerts = getAlerts();
  const newAlert: Alert = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    acknowledged: false
  };
  alerts.push(newAlert);
  saveAlerts(alerts);
  return newAlert;
}

/**
 * Acknowledge an alert
 */
export function acknowledgeAlert(alertId: string): void {
  const alerts = getAlerts();
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    saveAlerts(alerts);
  }
}

/**
 * Delete an alert
 */
export function deleteAlert(alertId: string): void {
  const alerts = getAlerts().filter(a => a.id !== alertId);
  saveAlerts(alerts);
}

/**
 * Get unacknowledged alerts
 */
export function getUnacknowledgedAlerts(): Alert[] {
  return getAlerts().filter(a => !a.acknowledged);
}

/**
 * Check for deadline alerts based on stored data
 */
export function checkDeadlineAlerts(): Alert[] {
  const preferences = getAlertPreferences();
  if (!preferences.deadlineAlerts) return [];

  const alerts: Alert[] = [];
  const now = new Date();
  const alertThreshold = new Date(now.getTime() + preferences.daysBeforeDeadline * 24 * 60 * 60 * 1000);

  // Check EUDR compliance deadlines
  try {
    const eudrData = localStorage.getItem('eudrCompliance');
    if (eudrData) {
      const compliance = JSON.parse(eudrData);
      if (compliance.dueDiligence?.gaps) {
        compliance.dueDiligence.gaps.forEach((gap: any) => {
          if (gap.deadline) {
            const deadline = new Date(gap.deadline);
            if (deadline <= alertThreshold && deadline >= now) {
              alerts.push({
                id: '',
                type: 'deadline',
                severity: gap.severity === 'critical' ? 'critical' : gap.severity === 'high' ? 'high' : 'medium',
                title: `EUDR Deadline: ${gap.requirement}`,
                message: gap.description,
                relatedEntity: 'EUDR',
                relatedEntityType: 'regulation',
                deadline: gap.deadline,
                createdAt: '',
                acknowledged: false
              });
            }
          }
        });
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // Check Child Labor remediation deadlines
  try {
    const childLaborData = localStorage.getItem('childLaborCompliance');
    if (childLaborData) {
      const compliance = JSON.parse(childLaborData);
      if (compliance.remediationActions) {
        compliance.remediationActions.forEach((action: any) => {
          if (action.deadline) {
            const deadline = new Date(action.deadline);
            if (deadline <= alertThreshold && deadline >= now) {
              alerts.push({
                id: '',
                type: 'deadline',
                severity: 'high',
                title: `Remediation Deadline: ${action.action}`,
                message: `Remediation action deadline approaching`,
                relatedEntity: 'Child Labor Compliance',
                relatedEntityType: 'regulation',
                deadline: action.deadline,
                createdAt: '',
                acknowledged: false
              });
            }
          }
        });
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // Check Supply Chain transparency deadlines
  try {
    const supplyChainData = localStorage.getItem('supplyChainCompliance');
    if (supplyChainData) {
      const compliance = JSON.parse(supplyChainData);
      if (compliance.transparencyRequirements) {
        compliance.transparencyRequirements.forEach((req: any) => {
          if (req.deadline) {
            const deadline = new Date(req.deadline);
            if (deadline <= alertThreshold && deadline >= now) {
              alerts.push({
                id: '',
                type: 'deadline',
                severity: req.status === 'non_compliant' ? 'critical' : 'high',
                title: `Transparency Deadline: ${req.regulation}`,
                message: req.requirement,
                relatedEntity: req.regulation,
                relatedEntityType: 'regulation',
                deadline: req.deadline,
                createdAt: '',
                acknowledged: false
              });
            }
          }
        });
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // Check Climate Disclosure deadlines
  try {
    const climateData = localStorage.getItem('climateCompliance');
    if (climateData) {
      const compliance = JSON.parse(climateData);
      if (compliance.disclosures) {
        compliance.disclosures.forEach((disclosure: any) => {
          if (disclosure.deadline) {
            const deadline = new Date(disclosure.deadline);
            if (deadline <= alertThreshold && deadline >= now) {
              alerts.push({
                id: '',
                type: 'deadline',
                severity: disclosure.status === 'not_started' ? 'critical' : 'high',
                title: `Climate Disclosure Deadline: ${disclosure.framework}`,
                message: disclosure.requirement,
                relatedEntity: disclosure.framework,
                relatedEntityType: 'regulation',
                deadline: disclosure.deadline,
                createdAt: '',
                acknowledged: false
              });
            }
          }
        });
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // Check Evidence expiration
  try {
    const evidenceData = localStorage.getItem('evidenceInventory');
    if (evidenceData) {
      const inventory = JSON.parse(evidenceData);
      if (inventory.items) {
        inventory.items.forEach((item: any) => {
          if (item.expiresAt) {
            const expiration = new Date(item.expiresAt);
            if (expiration <= alertThreshold && expiration >= now) {
              alerts.push({
                id: '',
                type: 'evidence',
                severity: 'medium',
                title: `Evidence Expiring: ${item.title}`,
                message: `Evidence document will expire soon`,
                relatedEntity: item.id,
                relatedEntityType: 'evidence',
                deadline: item.expiresAt,
                createdAt: '',
                acknowledged: false
              });
            }
          }
        });
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // Add alerts that don't already exist
  const existingAlerts = getAlerts();
  const newAlerts = alerts.filter(newAlert => {
    return !existingAlerts.some(existing => 
      existing.type === newAlert.type &&
      existing.relatedEntity === newAlert.relatedEntity &&
      existing.deadline === newAlert.deadline &&
      !existing.acknowledged
    );
  });

  newAlerts.forEach(alert => {
    addAlert(alert);
  });

  return newAlerts;
}

/**
 * Run alert checks (should be called periodically)
 */
export function runAlertChecks(): Alert[] {
  const preferences = getAlertPreferences();
  const alerts: Alert[] = [];

  if (preferences.deadlineAlerts) {
    alerts.push(...checkDeadlineAlerts());
  }

  // Add more alert checks here as needed

  return alerts;
}

