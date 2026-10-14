const assert = require('assert');

// 1. Translations
const { translations, getMessage } = require('./dist-test/i18n/translations');

// 2. Rule Engine
const { evaluateTicketRules } = require('./dist-test/services/ruleEngine');

// 3. Crowd Store
const { crowdStore } = require('./dist-test/services/crowdStore');

console.log('--- Running Rule-Engine & Crowd Tests (19 tests) ---');

let passed = 0;
let failed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

// Rule Engine Tests (1-13)
it('1. Confirmed ticket (CNF) gives boarding eligibility', () => {
  const res = evaluateTicketRules({ ticketStatus: 'CNF' });
  assert.strictEqual(res.isEligibleToBoard, true);
  assert.strictEqual(res.status, 'CNF');
  assert.ok(res.berthAllotmentRule.includes('Confirmed berth'));
});

it('2. Confirmed ticket (CONFIRMED) aliases correctly', () => {
  const res = evaluateTicketRules({ ticketStatus: 'CONFIRMED' });
  assert.strictEqual(res.isEligibleToBoard, true);
});

it('3. RAC ticket allows boarding with seating accommodation', () => {
  const res = evaluateTicketRules({ ticketStatus: 'RAC' });
  assert.strictEqual(res.isEligibleToBoard, true);
  assert.ok(res.berthAllotmentRule.includes('RAC'));
});

it('4. RAC ticket specifies cancellation and clerkage fee rule', () => {
  const res = evaluateTicketRules({ ticketStatus: 'RAC' });
  assert.ok(res.cancellationRule.includes('Clerkage fee'));
});

it('5. Waitlist (WL) ticket denies boarding for reserved coach', () => {
  const res = evaluateTicketRules({ ticketStatus: 'WL' });
  assert.strictEqual(res.isEligibleToBoard, false);
  assert.ok(res.berthAllotmentRule.includes('waitlisted'));
});

it('6. GNWL alias denies boarding', () => {
  const res = evaluateTicketRules({ ticketStatus: 'GNWL' });
  assert.strictEqual(res.isEligibleToBoard, false);
});

it('7. RLWL alias denies boarding', () => {
  const res = evaluateTicketRules({ ticketStatus: 'RLWL' });
  assert.strictEqual(res.isEligibleToBoard, false);
});

it('8. Tatkal ticket gives boarding eligibility under quota', () => {
  const res = evaluateTicketRules({ ticketStatus: 'TATKAL' });
  assert.strictEqual(res.isEligibleToBoard, true);
  assert.ok(res.cancellationRule.includes('Zero refund'));
});

it('9. General ticket specifies unreserved coaches only', () => {
  const res = evaluateTicketRules({ ticketStatus: 'GENERAL' });
  assert.strictEqual(res.isEligibleToBoard, true);
  assert.ok(res.berthAllotmentRule.includes('General/Second Class unreserved'));
});

it('10. Cancelled ticket is not eligible to board', () => {
  const res = evaluateTicketRules({ ticketStatus: 'CANCELLED' });
  assert.strictEqual(res.isEligibleToBoard, false);
  assert.ok(res.summary.includes('cancelled'));
});

it('11. Unknown ticket status marks ineligible and advises verification', () => {
  const res = evaluateTicketRules({ ticketStatus: 'UNKNOWN_STATUS_XYZ' });
  assert.strictEqual(res.isEligibleToBoard, false);
  assert.ok(res.berthAllotmentRule.includes('Unknown'));
});

it('12. Mandatory advice ALWAYS instructs to ask railway staff', () => {
  const statuses = ['CNF', 'RAC', 'WL', 'TATKAL', 'GENERAL', 'CANCELLED', 'INVALID'];
  statuses.forEach(status => {
    const res = evaluateTicketRules({ ticketStatus: status });
    assert.ok(res.mandatoryAdvice.toLowerCase().includes('ask railway staff'));
  });
});

it('13. Hindi language preference renders Hindi disclaimer in summary', () => {
  const res = evaluateTicketRules({ ticketStatus: 'CNF', lang: 'hi' });
  assert.ok(res.summary.includes('डेमो नियम इंजन'));
});

// Crowd Tests (14-19)
crowdStore.clear();

it('14. Valid report is recorded into memory', () => {
  const res = crowdStore.validateAndAdd({
    trainId: '99011',
    coach: 'B1',
    crowdLevel: 'HIGH',
    comment: 'Very crowded near doors'
  });
  assert.strictEqual(res.success, true);
  assert.ok(res.report && res.report.id);
  assert.strictEqual(res.report.trainId, '99011');
  assert.strictEqual(crowdStore.getAll().length, 1);
});

it('15. Missing required fields fails validation', () => {
  const res = crowdStore.validateAndAdd({
    trainId: '',
    coach: '',
    crowdLevel: ''
  });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.errorKey, 'invalidPayload');
});

it('16. Duplicate submission in short time window is rejected', () => {
  const first = crowdStore.validateAndAdd({
    trainId: '99011',
    coach: 'B1',
    crowdLevel: 'HIGH',
    reporterIp: '127.0.0.1'
  });
  assert.strictEqual(first.success, true);

  const duplicate = crowdStore.validateAndAdd({
    trainId: '99011',
    coach: 'B1',
    crowdLevel: 'HIGH',
    reporterIp: '127.0.0.1'
  });
  assert.strictEqual(duplicate.success, false);
  assert.strictEqual(duplicate.errorKey, 'duplicateReport');
});

it('17. Different coach or train is not flagged as duplicate', () => {
  crowdStore.validateAndAdd({
    trainId: '99011',
    coach: 'B1',
    crowdLevel: 'HIGH'
  });
  const differentCoach = crowdStore.validateAndAdd({
    trainId: '99011',
    coach: 'B2',
    crowdLevel: 'HIGH'
  });
  assert.strictEqual(differentCoach.success, true);
  assert.strictEqual(crowdStore.getAll().length, 3);
});

it('18. Comments exceeding 500 characters trigger size limit error', () => {
  const hugeComment = 'A'.repeat(501);
  const res = crowdStore.validateAndAdd({
    trainId: '99022',
    coach: 'D1',
    crowdLevel: 'MEDIUM',
    comment: hugeComment
  });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.errorKey, 'sizeLimitExceeded');
});

it('19. Querying by train filters correctly and resets on clear', () => {
  crowdStore.clear();
  crowdStore.validateAndAdd({ trainId: '99011', coach: 'S1', crowdLevel: 'LOW' });
  crowdStore.validateAndAdd({ trainId: '99022', coach: 'C1', crowdLevel: 'HIGH' });

  assert.strictEqual(crowdStore.getByTrain('99011').length, 1);
  assert.strictEqual(crowdStore.getByTrain('99022').length, 1);
  assert.strictEqual(crowdStore.getByTrain('99033').length, 0);

  crowdStore.clear();
  assert.strictEqual(crowdStore.getAll().length, 0);
});

console.log(`\n============================`);
console.log(`Result: ${passed} of 19 pass. ${failed} failed.`);
console.log(`============================`);
process.exit(failed > 0 ? 1 : 0);
