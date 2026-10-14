"use strict";
/**
 * Station Awareness & Platform Intelligence Service
 * Provides station platform density, facilities, accessibility, and crowd guidance.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATION_DIRECTORY = void 0;
exports.getStationInsights = getStationInsights;
exports.STATION_DIRECTORY = {
    NDLS: {
        stationCode: 'NDLS',
        stationName: 'New Delhi Railway Station',
        city: 'Delhi',
        division: 'Northern Railway',
        overallCongestion: 'HIGH',
        platforms: [
            { platformNumber: 1, expectedCrowdLevel: 'HIGH', currentTrain: '12423 Dibrugarh Rajdhani', crowdFactorPercentage: 78, bestBoardingZone: 'Pahar Ganj Entrance (Coaches B1-B8)' },
            { platformNumber: 2, expectedCrowdLevel: 'MODERATE', currentTrain: '12004 Lucknow Shatabdi', crowdFactorPercentage: 54, bestBoardingZone: 'Mid-Platform Escalators' },
            { platformNumber: 3, expectedCrowdLevel: 'LOW', currentTrain: '12952 Mumbai Tejas Rajdhani', crowdFactorPercentage: 35, bestBoardingZone: 'Ajmeri Gate Gate-2 (Coaches A1-H1)' },
            { platformNumber: 4, expectedCrowdLevel: 'EXTREME', currentTrain: '99011 Shift Express (Demo)', crowdFactorPercentage: 92, bestBoardingZone: 'Rear Foot Overbridge (Unreserved S1-S4)' },
            { platformNumber: 5, expectedCrowdLevel: 'LOW', currentTrain: '12056 Dehradun Jan Shatabdi', crowdFactorPercentage: 28, bestBoardingZone: 'Near Waiting Hall (Coaches C1-C6)' },
        ],
        facilities: [
            { name: 'Wheelchair & Ramp Access', icon: '♿', location: 'Gate 1 (Pahar Ganj) & Gate 2 (Ajmeri Gate)', isAccessible: true },
            { name: 'RPF Emergency Assistance Post', icon: '👮', location: 'Platform 1 Center & Foot Overbridge 2', isAccessible: true },
            { name: 'RO Filtered Drinking Water', icon: '💧', location: 'All Platforms near Water Posts 4 & 12', isAccessible: true },
            { name: 'Medical First Aid Post', icon: '🏥', location: 'Near Station Director Office, Platform 1', isAccessible: true },
            { name: 'Executive Waiting Lounge', icon: '🛋️', location: 'Platform 16 (Ajmeri Gate side, 1st Floor)', isAccessible: true },
        ],
        safetyGuidelines: [
            'Mind the gap between platform and footboard at curves on Platforms 3 and 4.',
            'Peak boarding surge occurs 20 minutes prior to departure; reach your coach marker early.',
            'Always consult Station Master / TTE booth on Platform 1 for unconfirmed RAC/WL status queries.',
        ],
        helplineNumbers: {
            railwayHelpline: '139',
            securityRPF: '182',
            medicalEmergency: '108',
            stationMaster: '011-23340000',
        },
        isDemo: true,
    },
    BCT: {
        stationCode: 'BCT',
        stationName: 'Mumbai Central',
        city: 'Mumbai',
        division: 'Western Railway',
        overallCongestion: 'MODERATE',
        platforms: [
            { platformNumber: 1, expectedCrowdLevel: 'LOW', currentTrain: '12951 Tejas Rajdhani Express', crowdFactorPercentage: 32, bestBoardingZone: 'Main Concourse (AC Coahes)' },
            { platformNumber: 2, expectedCrowdLevel: 'MODERATE', currentTrain: '12953 August Kranti Rajdhani', crowdFactorPercentage: 58, bestBoardingZone: 'Pillar 12-18' },
            { platformNumber: 3, expectedCrowdLevel: 'HIGH', currentTrain: '12961 Avantika Express', crowdFactorPercentage: 74, bestBoardingZone: 'Overbridge Ramp 1' },
        ],
        facilities: [
            { name: 'Escalators and Lifts', icon: '🛗', location: 'Platform 1 & Central Skywalk', isAccessible: true },
            { name: 'RPF Assistance Booth', icon: '👮', location: 'Platform 1 Entrance', isAccessible: true },
            { name: 'Feeding & Nursing Pods', icon: '👶', location: 'Platform 1 Waiting Hall', isAccessible: true },
            { name: 'Cloak Room & Luggage Locker', icon: '🧳', location: 'Concourse West Side', isAccessible: true },
        ],
        safetyGuidelines: [
            'Mumbai local EMU suburban rush overlaps between 17:00 and 20:30; use outer foot overbridge for mainline trains.',
            'Do not lean against coach doors during suburban platform clearances.',
        ],
        helplineNumbers: {
            railwayHelpline: '139',
            mumbaiRPF: '022-23077249',
        },
        isDemo: true,
    },
    HWH: {
        stationCode: 'HWH',
        stationName: 'Howrah Junction',
        city: 'Kolkata',
        division: 'Eastern Railway',
        overallCongestion: 'HIGH',
        platforms: [
            { platformNumber: 8, expectedCrowdLevel: 'MODERATE', currentTrain: '12301 Howrah Rajdhani', crowdFactorPercentage: 55, bestBoardingZone: 'Cab Road Entry' },
            { platformNumber: 9, expectedCrowdLevel: 'EXTREME', currentTrain: '99022 Jan Shatabdi Demo', crowdFactorPercentage: 88, bestBoardingZone: 'North Overbridge Ramp' },
        ],
        facilities: [
            { name: 'Yatri Niwas & Resting Pods', icon: '🛏️', location: 'Old Complex, 2nd Floor', isAccessible: true },
            { name: 'Battery Operated Carts', icon: '🛺', location: 'Main Concourse near Yatri Sahayak Counter', isAccessible: true },
            { name: 'Emergency Health Clinic', icon: '🩺', location: 'Platform 8 Entrance', isAccessible: true },
        ],
        safetyGuidelines: [
            'Howrah station has 23 platforms spanning two complexes (Old & New); check complex code on your ticket.',
        ],
        helplineNumbers: { railwayHelpline: '139', gRPPolice: '033-26602020' },
        isDemo: true,
    },
    SBC: {
        stationCode: 'SBC',
        stationName: 'KSR Bengaluru City',
        city: 'Bengaluru',
        division: 'South Western Railway',
        overallCongestion: 'MODERATE',
        platforms: [
            { platformNumber: 1, expectedCrowdLevel: 'LOW', currentTrain: '20608 Vande Bharat Express', crowdFactorPercentage: 30, bestBoardingZone: 'Main Entry VIP Gate' },
            { platformNumber: 5, expectedCrowdLevel: 'HIGH', currentTrain: '99033 Duronto Superfast Demo', crowdFactorPercentage: 76, bestBoardingZone: 'Subway Footpath 2' },
        ],
        facilities: [
            { name: 'Metro Connection Walkway', icon: '🚇', location: 'Direct skywalk to Namma Metro Majestic Station', isAccessible: true },
            { name: 'Wheelchair Ramp', icon: '♿', location: 'Platform 1 & Platform 8', isAccessible: true },
        ],
        safetyGuidelines: [
            'Use the dedicated elevated pedestrian walkway to switch between platforms without taking stairs with heavy luggage.',
        ],
        helplineNumbers: { railwayHelpline: '139' },
        isDemo: true,
    }
};
function getStationInsights(stationCode) {
    const code = (stationCode || '').toUpperCase().trim();
    if (exports.STATION_DIRECTORY[code]) {
        return exports.STATION_DIRECTORY[code];
    }
    // Generative default fallback for any searched station
    return {
        stationCode: code || 'STN',
        stationName: `${code || 'Central'} Railway Station`,
        city: 'Simulated Station',
        division: 'Indian Railways (Simulated)',
        overallCongestion: 'MODERATE',
        platforms: [
            { platformNumber: 1, expectedCrowdLevel: 'MODERATE', currentTrain: 'Express Commuter', crowdFactorPercentage: 50, bestBoardingZone: 'Concourse Central Gate' },
            { platformNumber: 2, expectedCrowdLevel: 'LOW', currentTrain: 'Superfast Special', crowdFactorPercentage: 35, bestBoardingZone: 'Main Waiting Hall' },
        ],
        facilities: [
            { name: 'RPF Assistance Booth', icon: '👮', location: 'Platform 1', isAccessible: true },
            { name: 'Drinking Water & Restrooms', icon: '💧', location: 'All Platforms', isAccessible: true },
            { name: 'Wheelchair Assistance', icon: '♿', location: 'Station Master Office', isAccessible: true },
        ],
        safetyGuidelines: [
            'Arrive at least 30 minutes before departure for smooth boarding.',
            'Always verify coach position display boards on the platform before train arrival.',
        ],
        helplineNumbers: { railwayHelpline: '139', emergencyRPF: '182' },
        isDemo: true,
    };
}
