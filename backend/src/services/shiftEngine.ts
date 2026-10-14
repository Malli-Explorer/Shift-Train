/**
 * ShiftTrain AI - Commuter Shift Recommendation Engine
 * Analyzes journey bottlenecks, overcrowding, and unconfirmed ticket statuses
 * to compute optimal train and coach shift recommendations.
 */

export interface ShiftInput {
  currentTrainId?: string;
  source?: string;
  destination?: string;
  travelDate?: string;
  ticketStatus?: string; // e.g. 'WL', 'RAC', 'CNF', 'GENERAL'
  currentCoach?: string; // e.g. 'S3', 'B1'
  crowdLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  preferredTimeWindow?: string; // e.g. 'morning', 'afternoon', 'evening'
  lang?: string;
}

export interface ShiftAlternativeTrain {
  trainNumber: string;
  trainName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  timeDifferenceMinutes: number; // positive = later, negative = earlier
  vacantClasses: string[];
  crowdForecast: 'LOW' | 'MODERATE' | 'HIGH';
  confirmationProbabilityPercentage: number;
  shiftConfidenceScore: number; // 0 - 100
  shiftReason: string;
  comfortGainPercentage: number;
  routeHighlight: string;
}

export interface CoachShiftAdvice {
  currentCoach: string;
  recommendedCoach: string;
  crowdReductionPercentage: number;
  reason: string;
}

export interface ShiftRecommendationResult {
  evaluationId: string;
  generatedAt: string;
  primaryShiftAdvice: string;
  urgencyLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  currentStatusSummary: string;
  alternatives: ShiftAlternativeTrain[];
  coachShift?: CoachShiftAdvice;
  shiftActionSteps: string[];
  mandatoryDisclaimer: string;
  isDemoEngine: true;
}

// In-memory catalog of alternative shift services
const DEMO_ALTERNATIVE_SERVICES: Record<string, ShiftAlternativeTrain[]> = {
  NDLS_BCT: [
    {
      trainNumber: '99014',
      trainName: 'Vande Bharat Shift Superfast (Simulated)',
      departureTime: '06:45',
      arrivalTime: '19:45',
      duration: '13h 00m',
      timeDifferenceMinutes: 45,
      vacantClasses: ['EC', 'CC'],
      crowdForecast: 'LOW',
      confirmationProbabilityPercentage: 96,
      shiftConfidenceScore: 94,
      shiftReason: '2h 30m faster journey with low crowd index and guaranteed executive seating.',
      comfortGainPercentage: 70,
      routeHighlight: 'Via Kota & Vadodara (Fastest corridor)'
    },
    {
      trainNumber: '99018',
      trainName: 'Tejas Smart Shift Express',
      departureTime: '16:55',
      arrivalTime: '08:35',
      duration: '15h 40m',
      timeDifferenceMinutes: 655,
      vacantClasses: ['1A', '2A', '3A'],
      crowdForecast: 'MODERATE',
      confirmationProbabilityPercentage: 88,
      shiftConfidenceScore: 89,
      shiftReason: 'Overnight departure with high RAC-to-CNF clearance history.',
      comfortGainPercentage: 55,
      routeHighlight: 'Overnight sleeper with automated catering'
    },
    {
      trainNumber: '99019',
      trainName: 'Jan Sadharan Shift Special (Unreserved Relief)',
      departureTime: '09:00',
      arrivalTime: '02:30',
      duration: '17h 30m',
      timeDifferenceMinutes: 180,
      vacantClasses: ['2S', 'GEN'],
      crowdForecast: 'MODERATE',
      confirmationProbabilityPercentage: 100,
      shiftConfidenceScore: 78,
      shiftReason: 'Dedicated unreserved relief rake with 18 unreserved coaches to absorb overflow rush.',
      comfortGainPercentage: 40,
      routeHighlight: 'Affordable alternate with high boarding capacity'
    }
  ],
  HWH_PNBE: [
    {
      trainNumber: '99024',
      trainName: 'Patna Vande Express Shift (Demo)',
      departureTime: '15:20',
      arrivalTime: '21:55',
      duration: '6h 35m',
      timeDifferenceMinutes: 65,
      vacantClasses: ['CC', 'EC'],
      crowdForecast: 'LOW',
      confirmationProbabilityPercentage: 92,
      shiftConfidenceScore: 91,
      shiftReason: 'Avoid heavy afternoon rush on Jan Shatabdi; chair car berths currently vacant.',
      comfortGainPercentage: 65,
      routeHighlight: 'Via Asansol & Jhajha'
    }
  ],
  SBC_MAS: [
    {
      trainNumber: '99036',
      trainName: 'Shatabdi Shift Express (Demo)',
      departureTime: '06:00',
      arrivalTime: '11:00',
      duration: '5h 00m',
      timeDifferenceMinutes: -90,
      vacantClasses: ['CC', 'EC', '2S'],
      crowdForecast: 'LOW',
      confirmationProbabilityPercentage: 98,
      shiftConfidenceScore: 96,
      shiftReason: '90 minutes earlier departure with 85+ vacant seats in AC Chair Car.',
      comfortGainPercentage: 80,
      routeHighlight: 'Morning express with breakfast service'
    }
  ]
};

export function calculateShiftRecommendation(input: ShiftInput): ShiftRecommendationResult {
  const statusUpper = (input.ticketStatus || '').toUpperCase().trim();
  const crowdUpper = (input.crowdLevel || '').toUpperCase().trim();
  const coach = (input.currentCoach || '').toUpperCase().trim();

  // Determine urgency
  let urgencyLevel: ShiftRecommendationResult['urgencyLevel'] = 'LOW';
  if (statusUpper.includes('WL') || statusUpper === 'WAITLIST' || crowdUpper === 'EXTREME') {
    urgencyLevel = 'CRITICAL';
  } else if (statusUpper === 'RAC' || crowdUpper === 'HIGH') {
    urgencyLevel = 'HIGH';
  } else if (crowdUpper === 'MEDIUM') {
    urgencyLevel = 'MODERATE';
  }

  // Derive route key
  let routeKey = 'NDLS_BCT';
  const src = (input.source || '').toUpperCase();
  const dst = (input.destination || '').toUpperCase();
  if (src.includes('HWH') || dst.includes('PNBE') || input.currentTrainId === '99022') {
    routeKey = 'HWH_PNBE';
  } else if (src.includes('SBC') || dst.includes('MAS') || input.currentTrainId === '99033') {
    routeKey = 'SBC_MAS';
  }

  const rawAlternatives = DEMO_ALTERNATIVE_SERVICES[routeKey] || DEMO_ALTERNATIVE_SERVICES.NDLS_BCT;

  // Compute customized alternatives
  const alternatives = rawAlternatives.map(alt => {
    let score = alt.shiftConfidenceScore;
    if (urgencyLevel === 'CRITICAL') {
      score = Math.min(99, score + 4);
    }
    return {
      ...alt,
      shiftConfidenceScore: score
    };
  });

  // Compute coach shift recommendation if passenger is onboard an overcrowded carriage
  let coachShift: CoachShiftAdvice | undefined;
  if (coach) {
    let recommendedCoach = 'S7';
    if (coach.startsWith('S') && parseInt(coach.slice(1), 10) <= 4) {
      recommendedCoach = 'S8 (Rear Coach)';
    } else if (coach.startsWith('B')) {
      recommendedCoach = 'B4 (Mid AC Coach)';
    } else if (coach.startsWith('D')) {
      recommendedCoach = 'D1 (Front Second Sitting)';
    }
    coachShift = {
      currentCoach: coach,
      recommendedCoach,
      crowdReductionPercentage: crowdUpper === 'EXTREME' ? 52 : 35,
      reason: `Historical sensor & commuter reports show ${recommendedCoach} has substantially lower station gate boarding density.`
    };
  }

  let primaryShiftAdvice = 'Your current train schedule is optimal, but alternative departures with lower crowd density are available.';
  if (urgencyLevel === 'CRITICAL') {
    primaryShiftAdvice = '⚡ Urgent Shift Recommended: Your current ticket status or coach crowd indicates high travel friction. Shifting to alternative Train ' + alternatives[0].trainNumber + ' offers a ' + alternatives[0].confirmationProbabilityPercentage + '% confirmation chance with ' + alternatives[0].comfortGainPercentage + '% comfort improvement.';
  } else if (urgencyLevel === 'HIGH') {
    primaryShiftAdvice = '⚠️ Moderate Shift Recommended: Shifting departure by ' + Math.abs(alternatives[0].timeDifferenceMinutes) + ' minutes gives you confirmed seating and avoids peak platform congestion.';
  }

  const currentStatusSummary = `Ticket Status: ${statusUpper || 'Unspecified'} | Reported Crowd: ${crowdUpper || 'Normal'} | Coach: ${coach || 'General'}`;

  const shiftActionSteps = [
    'Check vacant quotas via Current Reservation counter up to 30 minutes before chart preparation.',
    'If shifting from Waitlist (WL), unconfirmed e-tickets cancel automatically; book alternate service before chart lock.',
    'Consult platform TTE or Station Master counter for available emergency or tatkal shift quotas.',
    'Review the coach position indicators on the platform before shifting carriage compartments.'
  ];

  return {
    evaluationId: `shift-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    generatedAt: new Date().toISOString(),
    primaryShiftAdvice,
    urgencyLevel,
    currentStatusSummary,
    alternatives,
    coachShift,
    shiftActionSteps,
    mandatoryDisclaimer: 'Shift recommendations are AI-simulated advisory estimates. Always ask railway staff and verify ticket validity prior to boarding alternative trains.',
    isDemoEngine: true
  };
}
