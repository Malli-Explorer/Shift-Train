import { getMessage } from '../i18n/translations';

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
  mandatoryAdvice: string;
  isDemoRuleEngine: true;
  summary: string;
}

export function evaluateTicketRules(input: TicketCheckInput): TicketCheckResult {
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
