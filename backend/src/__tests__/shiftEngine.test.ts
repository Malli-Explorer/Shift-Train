import { calculateShiftRecommendation } from '../services/shiftEngine';
import { getStationInsights, STATION_DIRECTORY } from '../services/stationService';
import { sanitizeText, isValidPnr, isValidCoach } from '../utils/sanitizer';

describe('ShiftTrain AI - Shift Engine & Intelligence Tests', () => {
  describe('Shift Recommendation Engine', () => {
    test('1. Calculates critical urgency and provides alternative trains for Waitlist status', () => {
      const result = calculateShiftRecommendation({
        currentTrainId: '99011',
        source: 'NDLS',
        destination: 'BCT',
        ticketStatus: 'WL',
        currentCoach: 'S2',
        crowdLevel: 'EXTREME'
      });

      expect(result.urgencyLevel).toBe('CRITICAL');
      expect(result.alternatives.length).toBeGreaterThan(0);
      expect(result.alternatives[0].confirmationProbabilityPercentage).toBeGreaterThanOrEqual(80);
      expect(result.coachShift).toBeDefined();
      expect(result.coachShift?.recommendedCoach).toContain('S8');
      expect(result.mandatoryDisclaimer.toLowerCase()).toContain('ask railway staff');
    });

    test('2. Suggests coach shift for overcrowded coach without train switch', () => {
      const result = calculateShiftRecommendation({
        currentTrainId: '99011',
        ticketStatus: 'CNF',
        currentCoach: 'S3',
        crowdLevel: 'HIGH'
      });

      expect(result.urgencyLevel).toBe('HIGH');
      expect(result.coachShift).toBeDefined();
      expect(result.coachShift?.crowdReductionPercentage).toBeGreaterThan(0);
    });

    test('3. Computes time delta and comfort gain for alternative trains', () => {
      const result = calculateShiftRecommendation({
        source: 'NDLS',
        destination: 'BCT'
      });

      const fastest = result.alternatives[0];
      expect(fastest.shiftConfidenceScore).toBeGreaterThan(70);
      expect(fastest.comfortGainPercentage).toBeGreaterThan(0);
      expect(Array.isArray(fastest.vacantClasses)).toBe(true);
    });
  });

  describe('Station Awareness & Platform Intelligence', () => {
    test('4. Retrieves comprehensive platform and facility insights for NDLS', () => {
      const insights = getStationInsights('NDLS');
      expect(insights.stationCode).toBe('NDLS');
      expect(insights.platforms.length).toBeGreaterThan(0);
      expect(insights.facilities.length).toBeGreaterThan(0);
      expect(insights.helplineNumbers.railwayHelpline).toBe('139');
      expect(insights.isDemo).toBe(true);
    });

    test('5. Gracefully handles uncataloged station with simulated defaults', () => {
      const insights = getStationInsights('XYZ');
      expect(insights.stationCode).toBe('XYZ');
      expect(insights.platforms.length).toBeGreaterThanOrEqual(1);
      expect(insights.safetyGuidelines.length).toBeGreaterThan(0);
    });
  });

  describe('Security Sanitizer & Validation', () => {
    test('6. Strips malicious HTML script tags and javascript: URIs', () => {
      const dirty = '<script>alert("xss")</script>Normal Note<img src=x onerror=alert(1)>';
      const clean = sanitizeText(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('onerror');
      expect(clean).toContain('Normal Note');
    });

    test('7. Defends against prototype pollution keys', () => {
      expect(sanitizeText('__proto__')).toBe('');
      expect(sanitizeText('constructor')).toBe('');
      expect(sanitizeText('prototype')).toBe('');
    });

    test('8. Validates 10-digit PNR and coach formats accurately', () => {
      expect(isValidPnr('1234567890')).toBe(true);
      expect(isValidPnr('12345')).toBe(false);
      expect(isValidPnr('12345678901')).toBe(false);
      expect(isValidPnr('')).toBe(true); // Optional field

      expect(isValidCoach('S3')).toBe(true);
      expect(isValidCoach('B1')).toBe(true);
      expect(isValidCoach('HA1')).toBe(true);
      expect(isValidCoach('INVALID_LONG_COACH')).toBe(false);
    });
  });
});
