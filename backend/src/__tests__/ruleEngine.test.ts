import { evaluateTicketRules } from '../services/ruleEngine';

describe('Deterministic Rule Engine Tests', () => {
  test('1. Confirmed ticket (CNF) gives boarding eligibility', () => {
    const res = evaluateTicketRules({ ticketStatus: 'CNF' });
    expect(res.isEligibleToBoard).toBe(true);
    expect(res.status).toBe('CNF');
    expect(res.berthAllotmentRule).toContain('Confirmed berth');
  });

  test('2. Confirmed ticket (CONFIRMED) aliases correctly', () => {
    const res = evaluateTicketRules({ ticketStatus: 'CONFIRMED' });
    expect(res.isEligibleToBoard).toBe(true);
  });

  test('3. RAC ticket allows boarding with seating accommodation', () => {
    const res = evaluateTicketRules({ ticketStatus: 'RAC' });
    expect(res.isEligibleToBoard).toBe(true);
    expect(res.berthAllotmentRule).toContain('RAC');
  });

  test('4. RAC ticket specifies cancellation and clerkage fee rule', () => {
    const res = evaluateTicketRules({ ticketStatus: 'RAC' });
    expect(res.cancellationRule).toContain('Clerkage fee');
  });

  test('5. Waitlist (WL) ticket denies boarding for reserved coach', () => {
    const res = evaluateTicketRules({ ticketStatus: 'WL' });
    expect(res.isEligibleToBoard).toBe(false);
    expect(res.berthAllotmentRule).toContain('waitlisted');
  });

  test('6. GNWL alias denies boarding', () => {
    const res = evaluateTicketRules({ ticketStatus: 'GNWL' });
    expect(res.isEligibleToBoard).toBe(false);
  });

  test('7. RLWL alias denies boarding', () => {
    const res = evaluateTicketRules({ ticketStatus: 'RLWL' });
    expect(res.isEligibleToBoard).toBe(false);
  });

  test('8. Tatkal ticket gives boarding eligibility under quota', () => {
    const res = evaluateTicketRules({ ticketStatus: 'TATKAL' });
    expect(res.isEligibleToBoard).toBe(true);
    expect(res.cancellationRule).toContain('Zero refund');
  });

  test('9. General ticket specifies unreserved coaches only', () => {
    const res = evaluateTicketRules({ ticketStatus: 'GENERAL' });
    expect(res.isEligibleToBoard).toBe(true);
    expect(res.berthAllotmentRule).toContain('General/Second Class unreserved');
  });

  test('10. Cancelled ticket is not eligible to board', () => {
    const res = evaluateTicketRules({ ticketStatus: 'CANCELLED' });
    expect(res.isEligibleToBoard).toBe(false);
    expect(res.summary).toContain('cancelled');
  });

  test('11. Unknown ticket status marks ineligible and advises verification', () => {
    const res = evaluateTicketRules({ ticketStatus: 'UNKNOWN_STATUS_XYZ' });
    expect(res.isEligibleToBoard).toBe(false);
    expect(res.berthAllotmentRule).toContain('Unknown');
  });

  test('12. Mandatory advice ALWAYS instructs to ask railway staff', () => {
    const statuses = ['CNF', 'RAC', 'WL', 'TATKAL', 'GENERAL', 'CANCELLED', 'INVALID'];
    statuses.forEach(status => {
      const res = evaluateTicketRules({ ticketStatus: status });
      expect(res.mandatoryAdvice.toLowerCase()).toContain('ask railway staff');
    });
  });

  test('13. Hindi language preference renders Hindi disclaimer in summary', () => {
    const res = evaluateTicketRules({ ticketStatus: 'CNF', lang: 'hi' });
    expect(res.summary).toContain('डेमो नियम इंजन');
  });
});
