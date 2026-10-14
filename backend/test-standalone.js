// Translations
const translations = {
  en: {
    ticketCheckNotice: "DEMO RULE ENGINE: No official ticket rule is verified. Always ask railway staff or TTE before boarding."
  },
  hi: {
    ticketCheckNotice: "डेमो नियम इंजन: कोई आधिकारिक टिकट नियम सत्यापित नहीं है। यात्रा से पहले सदैव रेलवे कर्मचारियों या टीटीई से पूछें।"
  }
};

function getMessage(key, lang = 'en') {
  const normalizedLang = lang && lang.toLowerCase().startsWith('hi') ? 'hi' : 'en';
  return translations[normalizedLang][key] || translations['en'][key];
}

// Rule Engine
function evaluateTicketRules(input) {
  const lang = input.lang || 'en';
  const statusUpper = (input.ticketStatus || '').toUpperCase().trim();
  const notice = getMessage('ticketCheckNotice', lang);

  let isEligibleToBoard = false;
  let berthAllotmentRule = '';
  let cancellationRule = '';
  let summary = '';

  switch (statusUpper) {
    case 'CNF':
    case 'CONFIRMED':
      isEligibleToBoard = true;
      berthAllotmentRule = 'Confirmed berth is reserved in specified coach. Berth details appear on chart preparation.';
      cancellationRule = 'Standard cancellation charges apply according to hours before scheduled departure.';
      summary = 'Ticket status is Confirmed. You have a reserved berth.';
      break;

    case 'RAC':
      isEligibleToBoard = true;
      berthAllotmentRule = 'RAC passengers are allowed to board and share a side-lower berth. May upgrade if cancellations occur.';
      cancellationRule = 'Clerkage fee applies up to 30 minutes before train departure if cancelled.';
      summary = 'RAC status: Allowed to travel with seating accommodation, berth subject to vacancy.';
      break;

    case 'WL':
    case 'WAITLIST':
    case 'GNWL':
    case 'RLWL':
      isEligibleToBoard = false;
      berthAllotmentRule = 'Fully waitlisted e-tickets cannot board reserved coaches. Counter tickets may have different rules.';
      cancellationRule = 'Automatic refund generated for unconfirmed e-tickets after chart preparation.';
      summary = 'Waitlisted status: Not entitled to board reserved coach under standard e-ticket rules.';
      break;

    case 'TATKAL':
      isEligibleToBoard = true;
      berthAllotmentRule = 'Tatkal booking has priority allocation for confirmed quotas.';
      cancellationRule = 'Zero refund on confirmed Tatkal tickets; partial refund under specific railway disruption rules.';
      summary = 'Tatkal reservation rules apply.';
      break;

    case 'GENERAL':
    case 'UNRESERVED':
      isEligibleToBoard = true;
      berthAllotmentRule = 'Valid for travel in General/Second Class unreserved coaches only. No reserved seat.';
      cancellationRule = 'Non-refundable after scheduled train departure time.';
      summary = 'Unreserved ticket: Valid only in designated unreserved compartments.';
      break;

    case 'CANCELLED':
      isEligibleToBoard = false;
      berthAllotmentRule = 'Cancelled ticket is void and holds no journey rights.';
      cancellationRule = 'Refund processed as per cancellation time stamp.';
      summary = 'Ticket has been cancelled.';
      break;

    default:
      isEligibleToBoard = false;
      berthAllotmentRule = 'Unknown ticket category. Rules cannot be reliably evaluated.';
      cancellationRule = 'Check official portal for applicable terms.';
      summary = 'Unknown ticket status provided.';
      break;
  }

  return {
    status: statusUpper || 'UNKNOWN',
    isEligibleToBoard,
    berthAllotmentRule,
    cancellationRule,
    mandatoryAdvice: 'Official ticket rule is not legally verified. Always ask railway staff / TTE on duty for final confirmation.',
    isDemoRuleEngine: true,
    summary: `${summary} Notice: ${notice}`
  };
}

// Crowd Store
class CrowdStore {
  constructor() {
    this.reports = [];
    this.duplicateWindowMs = 3 * 60 * 1000;
    this.maxCommentLength = 500;
  }

  clear() {
    this.reports = [];
  }

  getAll() {
    return [...this.reports];
  }

  getByTrain(trainId) {
    const cleanTrainId = (trainId || '').trim().toUpperCase();
    return this.reports.filter(r => r.trainId.toUpperCase() === cleanTrainId);
  }

  validateAndAdd(input) {
    if (!input.trainId || !input.coach || !input.crowdLevel) {
      return { success: false, errorKey: 'invalidPayload' };
    }

    const comment = (input.comment || '').trim();
    if (comment.length > this.maxCommentLength) {
      return { success: false, errorKey: 'sizeLimitExceeded' };
    }

    const normalizedTrainId = input.trainId.trim().toUpperCase();
    const normalizedCoach = input.coach.trim().toUpperCase();
    const normalizedCrowd = input.crowdLevel.trim().toUpperCase();
    const now = Date.now();

    const isDuplicate = this.reports.some(r => {
      const isWithinWindow = now - r.timestamp < this.duplicateWindowMs;
      const isSameTarget = r.trainId.toUpperCase() === normalizedTrainId &&
                           r.coach.toUpperCase() === normalizedCoach &&
                           r.crowdLevel.toUpperCase() === normalizedCrowd;
      const isSameReporter = input.reporterIp && r.reporterIp === input.reporterIp;
      return isWithinWindow && (isSameTarget || (isSameReporter && isSameTarget));
    });

    if (isDuplicate) {
      return { success: false, errorKey: 'duplicateReport' };
    }

    const newReport = {
      id: `cr-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      trainId: normalizedTrainId,
      coach: normalizedCoach,
      crowdLevel: normalizedCrowd,
      cleanlinessLevel: input.cleanlinessLevel?.toUpperCase() || 'AVERAGE',
      comment,
      timestamp: now,
      reporterIp: input.reporterIp
    };

    this.reports.unshift(newReport);
    if (this.reports.length > 500) {
      this.reports.pop();
    }

    return { success: true, report: newReport };
  }
}

const crowdStore = new CrowdStore();

// Assertions & Runner
const assert = require('assert');
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

console.log('--- Running Rule-Engine and Crowd Tests (19 of 19) ---');

// 1-13 Rule engine tests
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

// 14-19 Crowd tests
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
  crowdStore.clear();
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
  crowdStore.clear();
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
  assert.strictEqual(crowdStore.getAll().length, 2);
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
console.log(`Final Result: ${passed} of 19 pass. ${failed} failed.`);
console.log(`============================`);
process.exit(failed > 0 ? 1 : 0);
