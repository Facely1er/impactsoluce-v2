import { AssessmentResponse, AssessmentQuestion, ESGScore } from '../types';

export interface ScoringWeights {
  environmental: number;
  social: number;
  governance: number;
}

export interface QuestionScore {
  questionId: string;
  rawScore: number;
  weightedScore: number;
  maxScore: number;
  category: 'environmental' | 'social' | 'governance';
  impact: 'high' | 'medium' | 'low';
}

export interface AssessmentScoreResult {
  overallScore: number;
  categoryScores: ESGScore;
  questionScores: QuestionScore[];
  completionRate: number;
  recommendations: {
    category: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
  }[];
  benchmarks: {
    industry: string;
    percentile: number;
    comparison: 'above' | 'below' | 'at';
  };
}

// Default scoring weights based on industry standards
const DEFAULT_WEIGHTS: ScoringWeights = {
  environmental: 0.4, // 40% weight for environmental factors
  social: 0.3,        // 30% weight for social factors
  governance: 0.3     // 30% weight for governance factors
};

// Industry benchmarks (simplified for demo)
const INDUSTRY_BENCHMARKS: Record<string, ESGScore> = {
  'Technology': { environmental: 72, social: 78, governance: 82, total: 77 },
  'Manufacturing': { environmental: 65, social: 70, governance: 75, total: 70 },
  'Financial Services': { environmental: 68, social: 75, governance: 85, total: 76 },
  'Healthcare': { environmental: 70, social: 82, governance: 80, total: 77 },
  'Retail': { environmental: 63, social: 72, governance: 70, total: 68 },
  'Other': { environmental: 68, social: 75, governance: 78, total: 74 }
};

export const calculateQuestionScore = (
  response: AssessmentResponse,
  question: AssessmentQuestion
): QuestionScore => {
  let rawScore = 0;
  let maxScore = 10; // Default max score

  // Calculate raw score based on question type
  switch (question.type) {
    case 'likert_scale':
      if (typeof response.value === 'string') {
        const index = parseInt(response.value);
        const optionsCount = question.options?.length || 5;
        rawScore = ((index + 1) / optionsCount) * maxScore;
      }
      break;

    case 'multiple_choice':
      if (typeof response.value === 'string') {
        // Score based on the "quality" of the answer
        const optionIndex = question.options?.indexOf(response.value) || 0;
        const optionsCount = question.options?.length || 1;
        rawScore = ((optionIndex + 1) / optionsCount) * maxScore;
      } else if (Array.isArray(response.value)) {
        // For multi-select, score based on number of selections
        const selectedCount = response.value.length;
        const totalOptions = question.options?.length || 1;
        rawScore = Math.min((selectedCount / totalOptions) * maxScore, maxScore);
      }
      break;

    case 'number':
      if (typeof response.value === 'number') {
        const min = question.validation?.min || 0;
        const max = question.validation?.max || 100;
        const normalizedValue = Math.min(Math.max(response.value, min), max);
        rawScore = (normalizedValue / max) * maxScore;
      }
      break;

    case 'file':
      // Score based on whether files are provided
      const hasFiles = response.attachments && response.attachments.length > 0;
      rawScore = hasFiles ? maxScore : 0;
      break;

    default:
      // For text responses, give full score if answered
      rawScore = response.value ? maxScore : 0;
  }

  // Apply question weight
  const weight = question.weight || 1;
  const weightedScore = rawScore * weight;

  // Determine category and impact
  const category = question.impactAreas?.[0] || 'governance';
  const impact = weight >= 3 ? 'high' : weight >= 2 ? 'medium' : 'low';

  return {
    questionId: question.id,
    rawScore,
    weightedScore,
    maxScore: maxScore * weight,
    category,
    impact
  };
};

export const calculateAssessmentScore = (
  responses: Record<string, AssessmentResponse>,
  questions: AssessmentQuestion[],
  industry: string = 'Other',
  weights: ScoringWeights = DEFAULT_WEIGHTS
): AssessmentScoreResult => {
  const questionScores: QuestionScore[] = [];
  const categoryTotals = { environmental: 0, social: 0, governance: 0 };
  const categoryMaxScores = { environmental: 0, social: 0, governance: 0 };

  // Calculate individual question scores
  questions.forEach(question => {
    const response = responses[question.id];
    if (response) {
      const score = calculateQuestionScore(response, question);
      questionScores.push(score);

      // Accumulate category scores
      categoryTotals[score.category] += score.weightedScore;
      categoryMaxScores[score.category] += score.maxScore;
    } else {
      // Handle missing responses
      const category = question.impactAreas?.[0] || 'governance';
      const weight = question.weight || 1;
      categoryMaxScores[category] += 10 * weight;
    }
  });

  // Calculate category percentages
  const categoryScores: ESGScore = {
    environmental: categoryMaxScores.environmental > 0 
      ? Math.round((categoryTotals.environmental / categoryMaxScores.environmental) * 100)
      : 0,
    social: categoryMaxScores.social > 0 
      ? Math.round((categoryTotals.social / categoryMaxScores.social) * 100)
      : 0,
    governance: categoryMaxScores.governance > 0 
      ? Math.round((categoryTotals.governance / categoryMaxScores.governance) * 100)
      : 0,
    total: 0
  };

  // Calculate weighted overall score
  const overallScore = Math.round(
    categoryScores.environmental * weights.environmental +
    categoryScores.social * weights.social +
    categoryScores.governance * weights.governance
  );

  categoryScores.total = overallScore;

  // Calculate completion rate
  const answeredQuestions = Object.keys(responses).length;
  const totalQuestions = questions.length;
  const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);

  // Generate recommendations
  const recommendations = generateRecommendations(categoryScores, questionScores);

  // Calculate industry benchmark comparison
  const industryBenchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS['Other'];
  const percentile = calculatePercentile(overallScore, industryBenchmark.total);

  return {
    overallScore,
    categoryScores,
    questionScores,
    completionRate,
    recommendations,
    benchmarks: {
      industry,
      percentile,
      comparison: overallScore > industryBenchmark.total ? 'above' : 
                 overallScore < industryBenchmark.total ? 'below' : 'at'
    }
  };
};

const generateRecommendations = (
  categoryScores: ESGScore,
  questionScores: QuestionScore[]
): AssessmentScoreResult['recommendations'] => {
  const recommendations: AssessmentScoreResult['recommendations'] = [];

  // Environmental recommendations
  if (categoryScores.environmental < 70) {
    recommendations.push({
      category: 'Environmental',
      priority: 'high',
      title: 'Implement Comprehensive Carbon Management',
      description: 'Establish systematic carbon tracking and reduction programs across all operations.',
      impact: 'Could improve environmental score by 15-25 points'
    });
  }

  if (categoryScores.environmental < 80) {
    recommendations.push({
      category: 'Environmental',
      priority: 'medium',
      title: 'Increase Renewable Energy Usage',
      description: 'Transition to renewable energy sources for facilities and operations.',
      impact: 'Could improve environmental score by 10-15 points'
    });
  }

  // Social recommendations
  if (categoryScores.social < 70) {
    recommendations.push({
      category: 'Social',
      priority: 'high',
      title: 'Enhance Diversity & Inclusion Programs',
      description: 'Develop comprehensive D&I initiatives with measurable targets and outcomes.',
      impact: 'Could improve social score by 12-20 points'
    });
  }

  if (categoryScores.social < 80) {
    recommendations.push({
      category: 'Social',
      priority: 'medium',
      title: 'Expand Employee Development',
      description: 'Invest in comprehensive training and career development programs.',
      impact: 'Could improve social score by 8-12 points'
    });
  }

  // Governance recommendations
  if (categoryScores.governance < 70) {
    recommendations.push({
      category: 'Governance',
      priority: 'high',
      title: 'Strengthen ESG Board Oversight',
      description: 'Establish dedicated ESG committee with regular reporting and accountability.',
      impact: 'Could improve governance score by 15-25 points'
    });
  }

  if (categoryScores.governance < 80) {
    recommendations.push({
      category: 'Governance',
      priority: 'medium',
      title: 'Enhance Risk Management Framework',
      description: 'Implement comprehensive ESG risk assessment and management processes.',
      impact: 'Could improve governance score by 10-15 points'
    });
  }

  // Sort by priority
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

const calculatePercentile = (score: number, benchmark: number): number => {
  // Simplified percentile calculation
  const difference = score - benchmark;
  const percentile = 50 + (difference / benchmark) * 30;
  return Math.max(5, Math.min(95, Math.round(percentile)));
};

export const getScoreInterpretation = (score: number): {
  level: string;
  description: string;
  color: string;
} => {
  if (score >= 85) {
    return {
      level: 'Excellent',
      description: 'Outstanding ESG performance with industry-leading practices',
      color: 'text-green-600'
    };
  } else if (score >= 75) {
    return {
      level: 'Good',
      description: 'Strong ESG performance with room for targeted improvements',
      color: 'text-green-500'
    };
  } else if (score >= 65) {
    return {
      level: 'Moderate',
      description: 'Developing ESG practices with significant improvement opportunities',
      color: 'text-yellow-500'
    };
  } else if (score >= 50) {
    return {
      level: 'Basic',
      description: 'Early-stage ESG implementation requiring substantial development',
      color: 'text-orange-500'
    };
  } else {
    return {
      level: 'Needs Improvement',
      description: 'Limited ESG practices requiring comprehensive strategy development',
      color: 'text-red-500'
    };
  }
};

export const generateScoreReport = (result: AssessmentScoreResult): string => {
  const interpretation = getScoreInterpretation(result.overallScore);
  
  return `
ESG Assessment Score Report
==========================

Overall Score: ${result.overallScore}/100 (${interpretation.level})
${interpretation.description}

Category Breakdown:
- Environmental: ${result.categoryScores.environmental}/100
- Social: ${result.categoryScores.social}/100  
- Governance: ${result.categoryScores.governance}/100

Industry Comparison:
Your organization scores ${result.benchmarks.comparison} the ${result.benchmarks.industry} industry average.
Industry Percentile: ${result.benchmarks.percentile}th percentile

Completion Rate: ${result.completionRate}%

Top Recommendations:
${result.recommendations.slice(0, 3).map((rec, i) => 
  `${i + 1}. ${rec.title} (${rec.priority} priority)\n   ${rec.description}\n   ${rec.impact}`
).join('\n\n')}
  `.trim();
};