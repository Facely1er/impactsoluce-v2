import { CarbonData, ESGFramework, ResourceItem, TechDependency, AssessmentSection, FrameworkMapping } from "../types";

export const frameworkMappings: FrameworkMapping[] = [
  // GRI Standards
  { id: 'gri-302', name: 'Energy', code: 'GRI 302', description: 'Energy consumption and efficiency' },
  { id: 'gri-305', name: 'Emissions', code: 'GRI 305', description: 'GHG emissions and climate impact' },
  { id: 'gri-306', name: 'Waste', code: 'GRI 306', description: 'Waste generation and management' },
  { id: 'gri-401', name: 'Employment', code: 'GRI 401', description: 'Employment practices and conditions' },
  { id: 'gri-405', name: 'Diversity', code: 'GRI 405', description: 'Diversity and equal opportunity' },

  // SASB Standards
  { id: 'sasb-tc', name: 'Technology & Communications', code: 'TC-SI', description: 'Software & IT Services' },
  { id: 'sasb-env', name: 'Environmental Footprint', code: 'TC-SI-130', description: 'Environmental footprint of operations' },
  { id: 'sasb-data', name: 'Data Privacy', code: 'TC-SI-220', description: 'Data privacy and security' },

  // TCFD Framework
  { id: 'tcfd-gov', name: 'Governance', code: 'TCFD-GOV', description: 'Climate-related governance' },
  { id: 'tcfd-strat', name: 'Strategy', code: 'TCFD-STRAT', description: 'Climate-related strategy' },
  { id: 'tcfd-risk', name: 'Risk Management', code: 'TCFD-RISK', description: 'Climate-related risks' },

  // ISSB Standards
  { id: 'issb-ifrs-s1', name: 'General Requirements', code: 'IFRS S1', description: 'General requirements for disclosure of sustainability-related financial information' },
  { id: 'issb-ifrs-s2', name: 'Climate-related Disclosures', code: 'IFRS S2', description: 'Climate-related disclosures' },

  // CSRD (Corporate Sustainability Reporting Directive)
  { id: 'csrd-env', name: 'Environmental Matters', code: 'CSRD-ENV', description: 'Environmental matters under CSRD' },
  { id: 'csrd-social', name: 'Social Matters', code: 'CSRD-SOC', description: 'Social and employee matters under CSRD' },
  { id: 'csrd-gov', name: 'Governance Matters', code: 'CSRD-GOV', description: 'Governance matters under CSRD' },

  // ISO Standards
  { id: 'iso-14001', name: 'Environmental Management', code: 'ISO 14001', description: 'Environmental management systems' },
  { id: 'iso-26000', name: 'Social Responsibility', code: 'ISO 26000', description: 'Social responsibility guidance' },
  { id: 'iso-50001', name: 'Energy Management', code: 'ISO 50001', description: 'Energy management systems' }
];

const standardsRequirements = [
  {
    id: 'env-1',
    framework: 'GRI',
    code: 'GRI 302',
    category: 'Environmental',
    requirement: 'Energy consumption and management within the organization',
    activities: [
      {
        id: 'act-1',
        name: 'Energy Audit',
        description: 'Conduct comprehensive energy audit of all technology systems',
        status: 'completed',
        dueDate: '2024-04-15',
        evidence: ['Energy Audit Report Q1 2024', 'System Performance Logs']
      },
      {
        id: 'act-2',
        name: 'Renewable Energy Transition',
        description: 'Implement renewable energy sources for data centers',
        status: 'in_progress',
        dueDate: '2024-06-30'
      }
    ]
  },
  {
    id: 'gov-1',
    framework: 'TCFD',
    code: 'TCFD-GOV',
    category: 'Governance',
    requirement: 'Board oversight of climate-related risks and opportunities',
    activities: [
      {
        id: 'act-3',
        name: 'ESG Committee Formation',
        description: 'Establish board-level ESG oversight committee',
        status: 'completed',
        evidence: ['Committee Charter', 'Meeting Minutes Q1 2024']
      },
      {
        id: 'act-4',
        name: 'Risk Assessment Framework',
        description: 'Develop climate risk assessment framework for tech operations',
        status: 'not_started',
        dueDate: '2024-07-15'
      }
    ]
  }
];

export const assessmentSections: AssessmentSection[] = [
  {
    id: 'demographics',
    title: 'Demographics',
    description: 'Basic information about your organization',
    questions: [
      {
        id: 'org_size',
        type: 'multiple_choice',
        category: 'demographics',
        question: 'Organization Size',
        description: 'Number of employees in your organization',
        required: true,
        options: ['1-50', '51-200', '201-1000', '1001-5000', '5000+'],
        frameworks: {
          gri: ['102-7'],
          sasb: ['TC-SI-330a.1']
        }
      },
      {
        id: 'industry',
        type: 'multiple_choice',
        category: 'demographics',
        question: 'Industry Sector',
        required: true,
        options: ['Technology', 'Manufacturing', 'Financial Services', 'Healthcare', 'Retail', 'Other'],
        frameworks: {
          gri: ['102-6']
        }
      },
      {
        id: 'region',
        type: 'multiple_choice',
        category: 'demographics',
        question: 'Primary Operating Region',
        required: true,
        options: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'],
        frameworks: {
          gri: ['102-4']
        }
      }
    ]
  },
  {
    id: 'environmental',
    title: 'Environmental Performance',
    description: 'Assessment of environmental management and impact',
    questions: [
      {
        id: 'env_policy',
        type: 'likert_scale',
        category: 'current_situation',
        question: 'Environmental Policy Implementation',
        description: 'Rate the maturity of your environmental policy implementation',
        required: true,
        options: ['Not Started', 'Initial', 'Developing', 'Established', 'Advanced'],
        frameworks: {
          gri: ['103-2'],
          iso: ['14001-4.3'],
          tcfd: ['TCFD-GOV-a']
        },
        weight: 2,
        impactAreas: ['environmental']
      },
      {
        id: 'carbon_tracking',
        type: 'likert_scale',
        category: 'current_situation',
        question: 'Carbon Emissions Tracking',
        description: 'How effectively do you track and manage carbon emissions?',
        required: true,
        options: ['Not Tracked', 'Basic Tracking', 'Regular Monitoring', 'Advanced Analytics', 'Full Integration'],
        frameworks: {
          gri: ['305-1', '305-2'],
          tcfd: ['TCFD-MET-a'],
          sasb: ['TC-SI-130a.1']
        },
        weight: 3,
        impactAreas: ['environmental']
      },
      {
        id: 'renewable_energy',
        type: 'number',
        category: 'current_situation',
        question: 'Renewable Energy Usage',
        description: 'Percentage of energy from renewable sources',
        required: true,
        validation: {
          min: 0,
          max: 100,
          message: 'Please enter a percentage between 0 and 100'
        },
        frameworks: {
          gri: ['302-1'],
          sasb: ['TC-SI-130a.2'],
          iso: ['50001-4.4']
        },
        weight: 2,
        impactAreas: ['environmental']
      }
    ]
  },
  {
    id: 'social',
    title: 'Social Impact',
    description: 'Assessment of social responsibility and impact',
    questions: [
      {
        id: 'diversity_inclusion',
        type: 'likert_scale',
        category: 'current_situation',
        question: 'Diversity and Inclusion Practices',
        description: 'Evaluate your organization\'s D&I initiatives',
        required: true,
        options: ['No Programs', 'Basic Policies', 'Active Programs', 'Comprehensive Strategy', 'Industry Leading'],
        frameworks: {
          gri: ['405-1'],
          sasb: ['TC-SI-330a.3'],
          iso: ['26000-6.3']
        },
        weight: 2,
        impactAreas: ['social']
      },
      {
        id: 'employee_development',
        type: 'likert_scale',
        category: 'current_situation',
        question: 'Employee Development Programs',
        description: 'Rate your employee training and development initiatives',
        required: true,
        options: ['Limited', 'Basic', 'Moderate', 'Comprehensive', 'Advanced'],
        frameworks: {
          gri: ['404-2'],
          iso: ['26000-6.4']
        },
        weight: 1,
        impactAreas: ['social']
      }
    ]
  },
  {
    id: 'governance',
    title: 'Governance Structure',
    description: 'Assessment of governance practices and risk management',
    questions: [
      {
        id: 'board_oversight',
        type: 'likert_scale',
        category: 'current_situation',
        question: 'ESG Board Oversight',
        description: 'Level of board involvement in ESG matters',
        required: true,
        options: ['None', 'Limited', 'Periodic', 'Regular', 'Comprehensive'],
        frameworks: {
          gri: ['102-18'],
          tcfd: ['TCFD-GOV-a'],
          sasb: ['TC-SI-330a.3']
        },
        weight: 3,
        impactAreas: ['governance']
      },
      {
        id: 'risk_management',
        type: 'likert_scale',
        category: 'current_situation',
        question: 'ESG Risk Management',
        description: 'Effectiveness of ESG risk management processes',
        required: true,
        options: ['Not Implemented', 'Basic', 'Developing', 'Established', 'Advanced'],
        frameworks: {
          gri: ['102-15'],
          tcfd: ['TCFD-RISK-a'],
          iso: ['14001-6.1']
        },
        weight: 2,
        impactAreas: ['governance']
      }
    ]
  }
];

export const esgFrameworks: ESGFramework[] = [
  {
    id: "gri",
    name: "Global Reporting Initiative (GRI)",
    description: "Internationally recognized standards for sustainability reporting",
    categories: [
      {
        name: "Environmental",
        score: 65,
        items: [
          { id: "e1", name: "Energy Management", score: 7, maxScore: 10 },
          { id: "e2", name: "Emissions Reduction", score: 6, maxScore: 10 },
          { id: "e3", name: "Waste Management", score: 5, maxScore: 10 },
          { id: "e4", name: "Water Usage", score: 4, maxScore: 10 }
        ]
      },
      {
        name: "Social",
        score: 72,
        items: [
          { id: "s1", name: "Human Rights", score: 8, maxScore: 10 },
          { id: "s2", name: "Employee Wellbeing", score: 7, maxScore: 10 },
          { id: "s3", name: "Community Impact", score: 6, maxScore: 10 },
          { id: "s4", name: "Diversity & Inclusion", score: 8, maxScore: 10 }
        ]
      },
      {
        name: "Governance",
        score: 80,
        items: [
          { id: "g1", name: "Board Structure", score: 9, maxScore: 10 },
          { id: "g2", name: "Ethics & Compliance", score: 8, maxScore: 10 },
          { id: "g3", name: "Risk Management", score: 8, maxScore: 10 },
          { id: "g4", name: "Transparency", score: 7, maxScore: 10 }
        ]
      }
    ]
  }
];

export const techDependencies: TechDependency[] = [
  {
    id: "tech1",
    name: "Cloud Infrastructure",
    category: "Infrastructure",
    impact: "high",
    emissions: 125,
    energy: 240,
    risk: 68
  },
  {
    id: "tech2",
    name: "Data Centers",
    category: "Infrastructure",
    impact: "high",
    emissions: 180,
    energy: 320,
    risk: 72
  },
  {
    id: "tech3",
    name: "Desktop Computers",
    category: "End User",
    impact: "medium",
    emissions: 45,
    energy: 90,
    risk: 35
  },
  {
    id: "tech4",
    name: "Mobile Devices",
    category: "End User",
    impact: "low",
    emissions: 15,
    energy: 25,
    risk: 20
  },
  {
    id: "tech5",
    name: "Enterprise Software",
    category: "Software",
    impact: "medium",
    emissions: 60,
    energy: 110,
    risk: 42
  }
];

export const carbonData: CarbonData[] = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 115 },
  { month: "Mar", value: 130 },
  { month: "Apr", value: 125 },
  { month: "May", value: 110 },
  { month: "Jun", value: 105 },
  { month: "Jul", value: 100 },
  { month: "Aug", value: 95 },
  { month: "Sep", value: 90 },
  { month: "Oct", value: 85 },
  { month: "Nov", value: 80 },
  { month: "Dec", value: 75 }
];

export const resources: ResourceItem[] = [
  {
    id: "res1",
    title: "ESG Policy Template",
    description: "Comprehensive template for developing your organization's ESG policy",
    type: "docx",
    category: "policy",
    url: "/resources/ESG_Policy_Template.docx"
  },
  {
    id: "res2",
    title: "Sustainable Technology Procurement Guide",
    description: "Best practices for sustainable technology procurement",
    type: "pdf",
    category: "guide",
    url: "/resources/Sustainable_Technology_Procurement_Guide.pdf"
  },
  {
    id: "res3",
    title: "Carbon Reduction Roadmap Template",
    description: "Template for planning and tracking carbon reduction initiatives",
    type: "xlsx",
    category: "template",
    url: "/resources/Carbon_Reduction_Roadmap_Template.xlsx"
  },
  {
    id: "res4",
    title: "TCFD Disclosure Checklist",
    description: "Checklist for Task Force on Climate-related Financial Disclosures compliance",
    type: "pdf",
    category: "checklist",
    url: "/resources/TCFD_Disclosure_Checklist.pdf"
  },
  {
    id: "res5",
    title: "Technology Dependency Sustainability Assessment",
    description: "Assessment template for evaluating technology sustainability",
    type: "xlsx",
    category: "template",
    url: "/resources/Technology_Dependency_Sustainability_Assessment.xlsx"
  },
  {
    id: "res6",
    title: "Digital Accessibility Compliance Guide",
    description: "Guide for ensuring digital accessibility compliance",
    type: "pdf",
    category: "guide",
    url: "/resources/Digital_Accessibility_Compliance_Guide.pdf"
  }
];

export { standardsRequirements };