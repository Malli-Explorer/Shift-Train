import { getMessage } from '../i18n/translations';
import { sanitizeText } from '../utils/sanitizer';

export interface TicketCheckInput {
  pnr?: string;
  ticketStatus: 'CNF' | 'RAC' | 'WL' | 'TATKAL' | 'GENERAL' | 'CANCELLED' | string;
  coach?: string;
  berthType?: string;
  lang?: string;
}

export interface TicketCheckResult {
  status: string;
  isEligibleToBoard: boolean;
  berthAllotmentRule: string;
  cancellationRule: string;
  chartingRule: string;
  confirmationProbability: number;
  recommendedShiftAction: string;
  mandatoryAdvice: string;
  isDemoRuleEngine: true;
  summary: string;
}

export function evaluateTicketRules(input: TicketCheckInput): TicketCheckResult {
  const lang = sanitizeText(input.lang || 'en');
  const statusUpper = sanitizeText(input.ticketStatus || '').toUpperCase().trim();
  const notice = getMessage('ticketCheckNotice', lang);

  let isEligibleToBoard = false;
  let berthAllotmentRule = '';
  let cancellationRule = '';
  let chartingRule = '';
  let confirmationProbability = 0;
  let recommendedShiftAction = '';
  let summary = '';

  switch (statusUpper) {
    case 'CNF':
    case 'CONFIRMED':
      isEligibleToBoard = true;
      confirmationProbability = 100;
      berthAllotmentRule = 'Confirmed berth is reserved in specified coach. Exact berth number is printed on your ticket or confirmed on chart preparation.';
      cancellationRule = 'Standard cancellation slab applies: flat fee up to 48 hrs before departure; 25% within 48-12 hrs; 50% within 12-4 hrs.';
      chartingRule = 'First chart prepares 4 hours before departure; second chart 30 minutes before departure for remaining vacant berths.';
      recommendedShiftAction = 'No shift needed. Board the train at your allocated coach.';
      summary = 'Ticket status is Confirmed. You have a reserved berth.';
      break;

    case 'RAC':
      isEligibleToBoard = true;
      confirmationProbability = 78;
      berthAllotmentRule = 'RAC passengers are allowed to board and share a side-lower berth. May upgrade if cancellations occur.';
      cancellationRule = 'Clerkage fee applies up to 30 minutes before train departure if cancelled.';
      chartingRule = 'RAC passengers are first in line for upgrading when CNF passengers cancel or miss the train.';
      recommendedShiftAction = 'Consider checking ShiftTrain alternatives if you prefer a dedicated sleeper berth over a shared seat.';
      summary = 'RAC status: Allowed to travel with seating accommodation, berth subject to vacancy.';
      break;

    case 'WL':
    case 'WAITLIST':
    case 'GNWL':
    case 'RLWL':
    case 'PQWL':
      isEligibleToBoard = false;
      confirmationProbability = 24;
      berthAllotmentRule = 'Fully waitlisted e-tickets cannot board reserved coaches. Counter tickets may have different rules.';
      cancellationRule = 'Automatic refund generated for unconfirmed e-tickets after chart preparation.';
      chartingRule = 'Check PNR 4 hours prior to departure when the 1st reservation chart is generated.';
      recommendedShiftAction = '⚡ High-Priority Shift Needed: Use the ShiftTrain Advisor tab to switch to an alternative train or special relief service before charting lock.';
      summary = 'Waitlisted status: Not entitled to board reserved coach under standard e-ticket rules.';
      break;

    case 'TATKAL':
      isEligibleToBoard = true;
      confirmationProbability = 95;
      berthAllotmentRule = 'Tatkal booking has priority allocation for confirmed quotas.';
      cancellationRule = 'Zero refund on confirmed Tatkal tickets; partial refund under specific railway disruption rules.';
      chartingRule = 'Tatkal charts lock alongside general charts 4 hours before departure.';
      recommendedShiftAction = 'Ticket is confirmed under Tatkal; proceed to station as scheduled.';
      summary = 'Tatkal reservation rules apply.';
      break;

    case 'GENERAL':
    case 'UNRESERVED':
      isEligibleToBoard = true;
      confirmationProbability = 100;
      berthAllotmentRule = 'Valid for travel in General/Second Class unreserved coaches only. No reserved seat.';
      cancellationRule = 'Non-refundable after scheduled train departure time.';
      chartingRule = 'No chart prepared for unreserved coaches.';
      recommendedShiftAction = 'Check Station Platform Density in ShiftTrain to board from the less crowded platform gate.';
      summary = 'Unreserved ticket: Valid only in designated unreserved compartments.';
      break;

    case 'CANCELLED':
      isEligibleToBoard = false;
      confirmationProbability = 0;
      berthAllotmentRule = 'Cancelled ticket is legally void and confers no boarding or platform journey authorization.';
      cancellationRule = 'Refund processed according to timestamp of cancellation as per IRCTC refund policy.';
      chartingRule = 'Name omitted from passenger manifest chart.';
      recommendedShiftAction = 'Re-book via ShiftTrain Search to select an alternative available train.';
      summary = 'Ticket has been cancelled.';
      break;

    default:
      isEligibleToBoard = false;
      confirmationProbability = 0;
      berthAllotmentRule = 'Unknown ticket category. Rules cannot be reliably evaluated.';
      cancellationRule = 'Check official portal for applicable terms.';
      chartingRule = 'Consult Station Master counter for verification.';
      recommendedShiftAction = 'Verify status with railway staff before proceeding.';
      summary = 'Unknown ticket status provided.';
      break;
  }

  return {
    status: statusUpper || 'UNKNOWN',
    isEligibleToBoard,
    berthAllotmentRule,
    cancellationRule,
    chartingRule,
    confirmationProbability,
    recommendedShiftAction,
    mandatoryAdvice: 'Official ticket rule is not legally verified. Always ask railway staff / TTE on duty for final confirmation.',
    isDemoRuleEngine: true,
    summary: `${summary} Notice: ${notice}`
  };
}
