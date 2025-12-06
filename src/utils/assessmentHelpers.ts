import { AssessmentResponse, AssessmentQuestion, AssessmentSection } from '../types';
import { calculateAssessmentScore } from './scoring';

export const validateAssessmentCompletion = (
  responses: Record<string, AssessmentResponse>,
  sections: AssessmentSection[]
): {
  isComplete: boolean;
  missingRequired: string[];
  completionRate: number;
} => {
  const allQuestions = sections.flatMap(section => section.questions);
  const requiredQuestions = allQuestions.filter(q => q.required);
  
  const missingRequired = requiredQuestions
    .filter(q => !responses[q.id] || !responses[q.id].value)
    .map(q => q.id);

  const totalQuestions = allQuestions.length;
  const answeredQuestions = allQuestions.filter(q => responses[q.id]?.value).length;
  const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);

  return {
    isComplete: missingRequired.length === 0,
    missingRequired,
    completionRate
  };
};

export const generateAssessmentMetadata = (
  responses: Record<string, AssessmentResponse>,
  sections: AssessmentSection[]
): {
  totalQuestions: number;
  answeredQuestions: number;
  sectionBreakdown: Record<string, { answered: number; total: number; percentage: number }>;
  estimatedTimeToComplete: number;
  lastModified: string;
} => {
  const allQuestions = sections.flatMap(section => section.questions);
  const totalQuestions = allQuestions.length;
  const answeredQuestions = Object.keys(responses).length;

  const sectionBreakdown: Record<string, { answered: number; total: number; percentage: number }> = {};
  
  sections.forEach(section => {
    const sectionQuestions = section.questions;
    const answeredInSection = sectionQuestions.filter(q => responses[q.id]?.value).length;
    const percentage = Math.round((answeredInSection / sectionQuestions.length) * 100);
    
    sectionBreakdown[section.id] = {
      answered: answeredInSection,
      total: sectionQuestions.length,
      percentage
    };
  });

  // Estimate time to complete remaining questions (2 minutes per question)
  const remainingQuestions = totalQuestions - answeredQuestions;
  const estimatedTimeToComplete = remainingQuestions * 2;

  // Find the most recent response timestamp
  const timestamps = Object.values(responses)
    .map(r => new Date(r.timestamp))
    .sort((a, b) => b.getTime() - a.getTime());
  
  const lastModified = timestamps[0]?.toISOString() || new Date().toISOString();

  return {
    totalQuestions,
    answeredQuestions,
    sectionBreakdown,
    estimatedTimeToComplete,
    lastModified
  };
};

export const getAssessmentInsights = (
  responses: Record<string, AssessmentResponse>,
  questions: AssessmentQuestion[]
): {
  strengths: string[];
  weaknesses: string[];
  riskAreas: string[];
  complianceGaps: string[];
} => {
  const insights = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    riskAreas: [] as string[],
    complianceGaps: [] as string[]
  };

  questions.forEach(question => {
    const response = responses[question.id];
    if (!response) return;

    // Analyze response quality
    let score = 0;
    if (question.type === 'likert_scale' && typeof response.value === 'string') {
      const index = parseInt(response.value);
      const maxIndex = (question.options?.length || 5) - 1;
      score = (index / maxIndex) * 100;
    } else if (question.type === 'multiple_choice') {
      // Simplified scoring for multiple choice
      score = response.value ? 80 : 0;
    } else if (question.type === 'number' && typeof response.value === 'number') {
      const max = question.validation?.max || 100;
      score = (response.value / max) * 100;
    }

    // Categorize based on score and question metadata
    if (score >= 80) {
      insights.strengths.push(question.question);
    } else if (score < 50) {
      insights.weaknesses.push(question.question);
    }

    // Check for risk areas
    if (question.risks && score < 60) {
      question.risks.forEach(risk => {
        if (risk.level === 'high') {
          insights.riskAreas.push(risk.description);
        }
      });
    }

    // Check for compliance gaps
    if (question.compliance && score < 70) {
      question.compliance.forEach(comp => {
        insights.complianceGaps.push(`${comp.regulation}: ${comp.requirement}`);
      });
    }
  });

  return insights;
};

export const calculateImprovementPotential = (
  responses: Record<string, AssessmentResponse>,
  questions: AssessmentQuestion[]
): {
  category: string;
  currentScore: number;
  potentialScore: number;
  improvementActions: string[];
}[] => {
  const scoreResult = calculateAssessmentScore(responses, questions);
  
  return [
    {
      category: 'Environmental',
      currentScore: scoreResult.categoryScores.environmental,
      potentialScore: Math.min(scoreResult.categoryScores.environmental + 20, 100),
      improvementActions: [
        'Implement comprehensive carbon tracking',
        'Increase renewable energy usage',
        'Optimize energy efficiency programs'
      ]
    },
    {
      category: 'Social',
      currentScore: scoreResult.categoryScores.social,
      potentialScore: Math.min(scoreResult.categoryScores.social + 15, 100),
      improvementActions: [
        'Enhance diversity and inclusion programs',
        'Expand employee development initiatives',
        'Strengthen community engagement'
      ]
    },
    {
      category: 'Governance',
      currentScore: scoreResult.categoryScores.governance,
      potentialScore: Math.min(scoreResult.categoryScores.governance + 18, 100),
      improvementActions: [
        'Establish ESG board oversight',
        'Implement risk management framework',
        'Enhance transparency and reporting'
      ]
    }
  ];
};

export const exportAssessmentData = (
  responses: Record<string, AssessmentResponse>,
  questions: AssessmentQuestion[],
  format: 'json' | 'csv' = 'json'
): string => {
  if (format === 'csv') {
    const headers = ['Question ID', 'Question', 'Response', 'Category', 'Timestamp'];
    const rows = questions.map(question => {
      const response = responses[question.id];
      return [
        question.id,
        question.question,
        response ? String(response.value) : '',
        question.category,
        response ? response.timestamp : ''
      ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // JSON format
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    responses: Object.entries(responses).map(([questionId, response]) => {
      const question = questions.find(q => q.id === questionId);
      return {
        questionId,
        question: question?.question || '',
        response: response.value,
        category: question?.category || '',
        timestamp: response.timestamp,
        attachments: response.attachments?.length || 0
      };
    }),
    summary: calculateAssessmentScore(responses, questions)
  }, null, 2);
};