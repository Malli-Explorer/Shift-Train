import { Router, Request, Response } from 'express';
import { getMessage } from '../i18n/translations';

const router = Router();

export interface DemoTrain {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: string[];
  runningDays: string[];
  isDemo: true;
  label: string;
}

export const INVENTED_TRAINS: DemoTrain[] = [
  {
    trainNumber: "99011",
    trainName: "Shift Express (Simulated)",
    source: "NDLS (New Delhi)",
    destination: "BCT (Mumbai Central)",
    departureTime: "06:00",
    arrivalTime: "21:30",
    duration: "15h 30m",
    classes: ["1A", "2A", "3A", "SL"],
    runningDays: ["Mon", "Wed", "Fri", "Sun"],
    isDemo: true,
    label: "DEMO DATA"
  },
  {
    trainNumber: "99022",
    trainName: "Jan Shatabdi Demo",
    source: "HWH (Howrah)",
    destination: "PNBE (Patna Jn)",
    departureTime: "14:15",
    arrivalTime: "21:45",
    duration: "7h 30m",
    classes: ["CC", "2S"],
    runningDays: ["Daily"],
    isDemo: true,
    label: "DEMO DATA"
  },
  {
    trainNumber: "99033",
    trainName: "Duronto Superfast Demo",
    source: "SBC (Bengaluru City)",
    destination: "MAS (Chennai Central)",
    departureTime: "07:30",
    arrivalTime: "13:00",
    duration: "5h 30m",
    classes: ["1A", "2A", "3A"],
    runningDays: ["Tue", "Thu", "Sat"],
    isDemo: true,
    label: "DEMO DATA"
  }
];

router.get('/search', (req: Request, res: Response) => {
  const lang = (req.headers['accept-language'] as string) || (req.query.lang as string) || 'en';
  const from = (req.query.from as string) || '';
  const to = (req.query.to as string) || '';
  const date = (req.query.date as string) || '';

  res.json({
    success: true,
    isDemoData: true,
    disclaimer: getMessage('demoDataNotice', lang),
    searchQuery: { from, to, date },
    count: INVENTED_TRAINS.length,
    trains: INVENTED_TRAINS
  });
});

export default router;
