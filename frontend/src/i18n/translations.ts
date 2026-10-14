export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  isPartial?: boolean;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', isPartial: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isPartial: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isPartial: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isPartial: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isPartial: false },
];

export interface AppTranslations {
  appTitle: string;
  appSubtitle: string;
  demoBanner: string;
  demoBannerSubtitle: string;
  partialNotice: string;
  
  // Navigation tabs
  tabSearch: string;
  tabShift: string;
  tabStation: string;
  tabCrowd: string;
  tabTicket: string;

  // Search tab
  searchTitle: string;
  fromStation: string;
  toStation: string;
  journeyDate: string;
  classFilter: string;
  allClasses: string;
  searchButton: string;
  searching: string;
  noTrainsFound: string;
  trainBadge: string;
  duration: string;
  departs: string;
  arrives: string;
  runsOn: string;
  availableClasses: string;
  punctuality: string;
  crowdLevelIndicator: string;
  suggestedShift: string;

  // Shift Advisor tab
  shiftTitle: string;
  shiftSubtitle: string;
  shiftCurrentTrain: string;
  shiftTicketStatus: string;
  shiftCurrentCoach: string;
  shiftCrowdObserved: string;
  calculateShiftButton: string;
  calculatingShift: string;
  shiftScoreLabel: string;
  confirmationBoostLabel: string;
  comfortGainLabel: string;
  urgencyLabel: string;
  recommendedAlternatives: string;
  coachShiftRecommendation: string;
  actionChecklist: string;
  shiftDisclaimer: string;

  // Station Intel tab
  stationTitle: string;
  stationSubtitle: string;
  selectStation: string;
  platformCongestionTitle: string;
  platformNumberLabel: string;
  bestBoardingZoneLabel: string;
  stationFacilitiesTitle: string;
  safetyGuidelinesTitle: string;
  emergencyHelplinesTitle: string;

  // Crowd tab
  crowdTitle: string;
  crowdSubtitle: string;
  trainNumber: string;
  coachNumber: string;
  crowdLevel: string;
  crowdLow: string;
  crowdMedium: string;
  crowdHigh: string;
  crowdExtreme: string;
  cleanliness: string;
  cleanClean: string;
  cleanAverage: string;
  cleanPoor: string;
  commentLabel: string;
  commentPlaceholder: string;
  submitReport: string;
  submitting: string;
  recentReports: string;
  noReportsYet: string;
  reportSuccess: string;
  verifiedUpvotes: string;
  verifyButton: string;
  crowdHeatmapTitle: string;

  // Ticket check tab
  ticketTitle: string;
  ticketSubtitle: string;
  pnrNumber: string;
  ticketStatus: string;
  statusCnf: string;
  statusRac: string;
  statusWl: string;
  statusTatkal: string;
  statusGeneral: string;
  statusCancelled: string;
  checkTicketButton: string;
  checking: string;
  eligibleToBoard: string;
  notEligibleToBoard: string;
  berthRule: string;
  cancellationRule: string;
  chartingRule: string;
  confirmationProbability: string;
  recommendedShiftAction: string;
  mandatoryAdvice: string;
  ruleNotice: string;

  // Common & Accessibility
  networkError: string;
  requiredFields: string;
}

export const translations: Record<SupportedLanguage, AppTranslations> = {
  en: {
    appTitle: "ShiftTrain AI",
    appSubtitle: "Next-generation commuter intelligence, train shift advisor & station awareness",
    demoBanner: "DEMO DATA: Simulated Railway Assistant",
    demoBannerSubtitle: "No live IRCTC connection. Official ticket rules not verified. Always ask railway staff.",
    partialNotice: "ShiftTrain AI provides full multilingual intelligence across English, Hindi, Tamil, Telugu, and Bengali.",
    tabSearch: "Train Search",
    tabShift: "Shift Advisor",
    tabStation: "Station Intel",
    tabCrowd: "Crowd Reports",
    tabTicket: "Ticket Rules",
    searchTitle: "Search Trains & Corridors",
    fromStation: "From Station",
    toStation: "To Station",
    journeyDate: "Date of Journey",
    classFilter: "Class Preference",
    allClasses: "All Classes",
    searchButton: "Search Trains",
    searching: "Searching Demo Trains...",
    noTrainsFound: "No demo trains found for this route.",
    trainBadge: "DEMO DATA",
    duration: "Duration",
    departs: "Departs",
    arrives: "Arrives",
    runsOn: "Runs On",
    availableClasses: "Classes",
    punctuality: "On-Time Rating",
    crowdLevelIndicator: "Crowd Forecast",
    suggestedShift: "⚡ Shift Option Available",
    shiftTitle: "Intelligent Shift Recommendation Engine",
    shiftSubtitle: "AI-computed train & coach shifts to avoid overcrowding and unconfirmed waitlists",
    shiftCurrentTrain: "Current Train (Optional)",
    shiftTicketStatus: "Current Ticket Status",
    shiftCurrentCoach: "Current Coach (e.g. S3, B1)",
    shiftCrowdObserved: "Observed Carriage Crowd",
    calculateShiftButton: "Compute Optimal Shift",
    calculatingShift: "Analyzing Alternatives & Waitlist Probabilities...",
    shiftScoreLabel: "Shift Confidence Score",
    confirmationBoostLabel: "Confirmation Probability",
    comfortGainLabel: "Estimated Comfort Gain",
    urgencyLabel: "Shift Urgency",
    recommendedAlternatives: "Recommended Alternate Trains",
    coachShiftRecommendation: "Coach Reallocation Advice",
    actionChecklist: "Recommended Next Steps",
    shiftDisclaimer: "Shift recommendations are simulated advisory estimates. Always ask railway staff and verify ticket validity prior to boarding.",
    stationTitle: "Station Awareness & Platform Radar",
    stationSubtitle: "Live platform congestion radar, accessibility ramps, and passenger amenities",
    selectStation: "Select Station",
    platformCongestionTitle: "Platform Crowd Radar",
    platformNumberLabel: "Platform",
    bestBoardingZoneLabel: "Optimal Boarding Zone",
    stationFacilitiesTitle: "Station Amenities & Accessibility",
    safetyGuidelinesTitle: "Passenger Safety Protocols",
    emergencyHelplinesTitle: "Emergency & RPF Helplines",
    crowdTitle: "Crowdsourced Carriage Reports",
    crowdSubtitle: "Share and inspect live coach crowd levels verified by fellow commuters",
    trainNumber: "Train Number / Name",
    coachNumber: "Coach (e.g. S3, B1, D2)",
    crowdLevel: "Crowd Level",
    crowdLow: "Low (Seats Available)",
    crowdMedium: "Medium (Standing Room Only)",
    crowdHigh: "High (Heavy Rush)",
    crowdExtreme: "Extreme (Packed / Hard to Board)",
    cleanliness: "Cleanliness",
    cleanClean: "Clean",
    cleanAverage: "Average",
    cleanPoor: "Needs Cleaning",
    commentLabel: "Additional Note (Max 500 chars)",
    commentPlaceholder: "e.g., Heavy baggage crowd near gate 2",
    submitReport: "Submit Crowd Report",
    submitting: "Submitting Report...",
    recentReports: "Live Verified Reports",
    noReportsYet: "No crowd reports submitted yet. Be the first to report!",
    reportSuccess: "Crowd report submitted and recorded successfully!",
    verifiedUpvotes: "Helpful / Verified",
    verifyButton: "👍 Helpful",
    crowdHeatmapTitle: "Coach Density Heatmap",
    ticketTitle: "Deterministic Ticket Rule Check",
    ticketSubtitle: "Inspect IRCTC boarding eligibility, charting rules, and confirmation estimates",
    pnrNumber: "PNR Number (Optional 10-digit)",
    ticketStatus: "Current Ticket Status",
    statusCnf: "CNF - Confirmed",
    statusRac: "RAC - Reservation Against Cancellation",
    statusWl: "WL / GNWL - Waitlisted",
    statusTatkal: "TATKAL - Quota Ticket",
    statusGeneral: "GENERAL - Unreserved Second Class",
    statusCancelled: "CANCELLED - Void Ticket",
    checkTicketButton: "Evaluate Ticket Rules",
    checking: "Evaluating Railway Rules...",
    eligibleToBoard: "Eligible to Board",
    notEligibleToBoard: "NOT Eligible to Board",
    berthRule: "Berth Allotment Protocol",
    cancellationRule: "Cancellation & Refund Terms",
    chartingRule: "Chart Preparation Protocol",
    confirmationProbability: "Historical Confirmation Probability",
    recommendedShiftAction: "Recommended Shift Action",
    mandatoryAdvice: "Mandatory Passenger Advice",
    ruleNotice: "Official ticket rule is not legally verified. Always ask railway staff / TTE on duty.",
    networkError: "Unable to reach ShiftTrain API. Please ensure backend is running.",
    requiredFields: "Please fill in all mandatory fields.",
  },
  hi: {
    appTitle: "शिफ्टट्रेन एआई",
    appSubtitle: "अगली पीढ़ी की यात्री बुद्धिमत्ता, ट्रेन शिफ्ट सलाहकार और स्टेशन जागरूकता",
    demoBanner: "डेमो डेटा: सिमुलेटेड रेलवे सहायक",
    demoBannerSubtitle: "कोई लाइव आईआरसीटीसी कनेक्शन नहीं। आधिकारिक टिकट नियम सत्यापित नहीं हैं। हमेशा रेल कर्मचारियों से पूछें।",
    partialNotice: "शिफ्टट्रेन एआई अंग्रेजी, हिन्दी, तमिल, तेलुगु और बंगाली में पूर्ण बहुभाषी सेवा प्रदान करता है।",
    tabSearch: "ट्रेन खोजें",
    tabShift: "स्मार्ट शिफ्ट",
    tabStation: "स्टेशन जानकारी",
    tabCrowd: "भीड़ रिपोर्ट",
    tabTicket: "टिकट नियम",
    searchTitle: "ट्रेन व मार्ग खोजें",
    fromStation: "प्रस्थान स्टेशन",
    toStation: "गंतव्य स्टेशन",
    journeyDate: "यात्रा की तिथि",
    classFilter: "श्रेणी प्राथमिकता",
    allClasses: "सभी श्रेणियां",
    searchButton: "ट्रेनें खोजें",
    searching: "डेमो ट्रेनें खोजी जा रही हैं...",
    noTrainsFound: "इस मार्ग के लिए कोई डेमो ट्रेन नहीं मिली।",
    trainBadge: "डेमो डेटा",
    duration: "यात्रा समय",
    departs: "प्रस्थान",
    arrives: "आगमन",
    runsOn: "परिचालन दिन",
    availableClasses: "श्रेणियां",
    punctuality: "समयबद्धता दर",
    crowdLevelIndicator: "भीड़ का पूर्वानुमान",
    suggestedShift: "⚡ शिफ्ट विकल्प उपलब्ध",
    shiftTitle: "बुद्धिमान ट्रेन शिफ्ट सलाहकार",
    shiftSubtitle: "अत्यधिक भीड़ और अनिश्चित वेटलिस्ट से बचने के लिए एआई-सुझावित विकल्प",
    shiftCurrentTrain: "वर्तमान ट्रेन (वैकल्पिक)",
    shiftTicketStatus: "टिकट की वर्तमान स्थिति",
    shiftCurrentCoach: "वर्तमान कोच (उदा. S3, B1)",
    shiftCrowdObserved: "कोच में भीड़ का स्तर",
    calculateShiftButton: "सर्वश्रेष्ठ शिफ्ट विकल्प निकालें",
    calculatingShift: "विकल्पों व वेटलिस्ट संभावना का विश्लेषण जारी...",
    shiftScoreLabel: "शिफ्ट विश्वास स्कोर",
    confirmationBoostLabel: "कन्फर्मेशन संभावना",
    comfortGainLabel: "अनुमानित आराम वृद्धि",
    urgencyLabel: "शिफ्ट की तात्कालिकता",
    recommendedAlternatives: "अनुशंसित वैकल्पिक ट्रेनें",
    coachShiftRecommendation: "कोच स्थानांतरण सलाह",
    actionChecklist: "आवश्यक कदम",
    shiftDisclaimer: "शिफ्ट सुझाव सिमुलेटेड हैं। यात्रा से पूर्व सदैव रेलवे स्टाफ से पुष्टि करें।",
    stationTitle: "स्टेशन जागरूकता और प्लेटफॉर्म रडार",
    stationSubtitle: "लाइव प्लेटफॉर्म भीड़ घनत्व, रैंप, लिफ्ट और यात्री सुविधाएं",
    selectStation: "स्टेशन चुनें",
    platformCongestionTitle: "प्लेटफॉर्म भीड़ रडार",
    platformNumberLabel: "प्लेटफॉर्म",
    bestBoardingZoneLabel: "आदर्श बोर्डिंग जोन",
    stationFacilitiesTitle: "स्टेशन सुविधाएं व सुगमता",
    safetyGuidelinesTitle: "सुरक्षा दिशानिर्देश",
    emergencyHelplinesTitle: "आपातकालीन हेल्पलाइन नंबर",
    crowdTitle: "डिब्बों की भीड़ रिपोर्ट",
    crowdSubtitle: "अन्य यात्रियों द्वारा सत्यापित कोच भीड़ का हाल जानें और साझा करें",
    trainNumber: "ट्रेन नंबर / नाम",
    coachNumber: "कोच (उदा. S3, B1, D2)",
    crowdLevel: "भीड़ का स्तर",
    crowdLow: "कम (सीटें उपलब्ध)",
    crowdMedium: "मध्यम (खड़े होने की जगह)",
    crowdHigh: "अधिक (भारी भीड़)",
    crowdExtreme: "अत्यधिक (चढ़ना कठिन)",
    cleanliness: "स्वच्छता",
    cleanClean: "स्वच्छ",
    cleanAverage: "सामान्य",
    cleanPoor: "सफाई की आवश्यकता",
    commentLabel: "अतिरिक्त टिप्पणी (अधिकतम 500 अक्षर)",
    commentPlaceholder: "उदा., गेट 2 के पास भारी सामान की भीड़",
    submitReport: "भीड़ रिपोर्ट दर्ज करें",
    submitting: "रिपोर्ट दर्ज हो रही है...",
    recentReports: "लाइव सत्यापित रिपोर्टें",
    noReportsYet: "अभी तक कोई भीड़ रिपोर्ट नहीं है। पहली रिपोर्ट दर्ज करें!",
    reportSuccess: "भीड़ रिपोर्ट सफलतापूर्वक दर्ज कर ली गई है!",
    verifiedUpvotes: "सहायक / सत्यापित",
    verifyButton: "👍 उपयोगी",
    crowdHeatmapTitle: "कोच भीड़ हीटमैप",
    ticketTitle: "टिकट नियम जांच",
    ticketSubtitle: "बोर्डिंग पात्रता, चार्टिंग नियम और पुष्टि की संभावना जानें",
    pnrNumber: "पीएनआर नंबर (वैकल्पिक 10 अंक)",
    ticketStatus: "वर्तमान टिकट स्थिति",
    statusCnf: "CNF - कन्फर्म (पुष्टि)",
    statusRac: "RAC - रद्दीकरण के विरुद्ध आरक्षण",
    statusWl: "WL / GNWL - वेटलिस्ट (प्रतीक्षारत)",
    statusTatkal: "TATKAL - तत्काल कोटा टिकट",
    statusGeneral: "GENERAL - सामान्य अनारक्षित श्रेणी",
    statusCancelled: "CANCELLED - रद्द किया गया टिकट",
    checkTicketButton: "टिकट नियमों की जांच करें",
    checking: "रेलवे नियमों का मूल्यांकन हो रहा है...",
    eligibleToBoard: "सवार होने के पात्र हैं",
    notEligibleToBoard: "सवार होने के पात्र नहीं हैं",
    berthRule: "बर्थ आवंटन नियम",
    cancellationRule: "रद्दीकरण व रिफंड नियम",
    chartingRule: "चार्ट तैयारी नियम",
    confirmationProbability: "ऐतिहासिक पुष्टि संभावना",
    recommendedShiftAction: "सुझावित शिफ्ट कार्रवाई",
    mandatoryAdvice: "अनिवार्य यात्री सलाह",
    ruleNotice: "आधिकारिक टिकट नियम कानूनी रूप से सत्यापित नहीं हैं। हमेशा ऑन-ड्यूटी रेल कर्मियों / टीटीई से पूछें।",
    networkError: "शिफ्टट्रेन सर्वर से संपर्क नहीं हो सका। कृपया जांचें।",
    requiredFields: "कृपया सभी आवश्यक फ़ील्ड भरें।",
  },
  ta: {
    appTitle: "ShiftTrain AI",
    appSubtitle: "அடுத்த தலைமுறை ரயில் பயண நுண்ணறிவு மற்றும் நிலைய வழிகாட்டி",
    demoBanner: "மாதிரி தரவு: ரயில்வே உதவி தளம்",
    demoBannerSubtitle: "நேரடி IRCTC இணைப்பு இல்லை. அதிகாரப்பூர்வ விதிகளை ரயில்வே பணியாளர்களிடம் சரிபார்க்கவும்.",
    partialNotice: "ShiftTrain AI தமிழ், ஆங்கிலம், இந்தி, தெலுங்கு, வங்காளி ஆகிய மொழிகளில் முழு சேவை வழங்குகிறது.",
    tabSearch: "ரயில் தேடல்",
    tabShift: "ஷிப்ட் ஆலோசகர்",
    tabStation: "நிலைய தகவல்",
    tabCrowd: "கூட்ட நெரிசல்",
    tabTicket: "டிக்கெட் விதிகள்",
    searchTitle: "ரயில்களை தேடுங்கள்",
    fromStation: "புறப்படும் நிலையம்",
    toStation: "சேரும் நிலையம்",
    journeyDate: "பயண தேதி",
    classFilter: "வகுப்பு தேர்வு",
    allClasses: "அனைத்து வகுப்புகள்",
    searchButton: "ரயில் தேடுக",
    searching: "ரயில்கள் தேடப்படுகின்றன...",
    noTrainsFound: "இந்த வழித்தடத்தில் ரயில்கள் இல்லை.",
    trainBadge: "மாதிரி தரவு",
    duration: "பயண நேரம்",
    departs: "புறப்பாடு",
    arrives: "வருகை",
    runsOn: "இயங்கும் நாட்கள்",
    availableClasses: "வகுப்புகள்",
    punctuality: "நேரக்கட்டுப்பாடு",
    crowdLevelIndicator: "கூட்ட நிலவரம்",
    suggestedShift: "⚡ மாற்று ரயில் உள்ளது",
    shiftTitle: "ரயில் மாற்றியமைப்பு ஆலோசகர்",
    shiftSubtitle: "கூட்ட நெரிசல் மற்றும் காத்திருப்போர் பட்டியலை தவிர்க்க சிறந்த மாற்று ரயில்கள்",
    shiftCurrentTrain: "தற்போதைய ரயில் (விருப்பத்தேர்வு)",
    shiftTicketStatus: "டிக்கெட் நிலை",
    shiftCurrentCoach: "பெட்டி எண் (उदा. S3, B1)",
    shiftCrowdObserved: "கண்டறியப்பட்ட கூட்டம்",
    calculateShiftButton: "மாற்று ரயிலை கணக்கிடு",
    calculatingShift: "சிறந்த மாற்று ரயில்கள் ஆய்வு செய்யப்படுகின்றன...",
    shiftScoreLabel: "ஷிப்ட் நம்பிக்கை மதிப்பெண்",
    confirmationBoostLabel: "உறுதிப்படுத்தல் வாய்ப்பு",
    comfortGainLabel: "ஆறுதல் அதிகரிப்பு",
    urgencyLabel: "மாற்ற அவசரம்",
    recommendedAlternatives: "பரிந்துரைக்கப்பட்ட மாற்று ரயில்கள்",
    coachShiftRecommendation: "பெட்டி மாற்ற ஆலோசனை",
    actionChecklist: "அடுத்த நடவடிக்கைகள்",
    shiftDisclaimer: "இது ஒரு மாதிரி வழிகாட்டி மட்டுமே. புறப்படும் முன் ரயில்வே ஊழியரிடம் உறுதிப்படுத்தவும்.",
    stationTitle: "நிலைய நெரிசல் & தள தகவல்",
    stationSubtitle: "நடைமேடை கூட்டம், சாய்தளங்கள் மற்றும் வசதிகள்",
    selectStation: "நிலையத்தை தேர்ந்தெடுக்கவும்",
    platformCongestionTitle: "நடைமேடை கூட்ட ரேடார்",
    platformNumberLabel: "நடைமேடை",
    bestBoardingZoneLabel: "சிறந்த ஏறும் இடம்",
    stationFacilitiesTitle: "நிலைய வசதிகள்",
    safetyGuidelinesTitle: "பாதுகாப்பு வழிகாட்டுதல்கள்",
    emergencyHelplinesTitle: "அவசர எண்கள்",
    crowdTitle: "பயணிகள் கூட்ட நெரிசல் பதிவு",
    crowdSubtitle: "ரயில் பெட்டி கூட்ட நிலவரங்களை பகிருங்கள் மற்றும் பாருங்கள்",
    trainNumber: "ரயில் எண் / பெயர்",
    coachNumber: "பெட்டி (उदा. S3, B1)",
    crowdLevel: "கூட்ட நிலை",
    crowdLow: "குறைவு (இருக்கைகள் உள்ளன)",
    crowdMedium: "நடுத்தரம் (நிற்க மட்டுமே)",
    crowdHigh: "அதிகம் (நெரிசல்)",
    crowdExtreme: "மிக அதிகம் (ஏற கடினம்)",
    cleanliness: "தூய்மை",
    cleanClean: "தூய்மை",
    cleanAverage: "சராசரி",
    cleanPoor: "சுத்தம் தேவை",
    commentLabel: "கூடுதல் குறிப்பு (அதிகபட்சம் 500 எழுத்துகள்)",
    commentPlaceholder: "எ.கா: வாசல் அருகே அதிக லக்கேஜ் நெரிசல்",
    submitReport: "பதிவை சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கப்படுகிறது...",
    recentReports: "நேரடி தகவல்கள்",
    noReportsYet: "இன்னும் பதிவுகள் இல்லை. முதலில் பதிவு செய்யுங்கள்!",
    reportSuccess: "கூட்ட தகவல் வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
    verifiedUpvotes: "பயனுள்ளது",
    verifyButton: "👍 பயனுள்ளது",
    crowdHeatmapTitle: "பெட்டி வாரியான நெரிசல் வரைபடம்",
    ticketTitle: "டிக்கெட் விதிமுறை சரிபார்ப்பு",
    ticketSubtitle: "பயண அனுமதி மற்றும் உறுதிப்படுத்தல் விதிகள்",
    pnrNumber: "PNR எண் (10 இலக்கங்கள்)",
    ticketStatus: "டிக்கெட் நிலை",
    statusCnf: "CNF - உறுதி செய்யப்பட்டது",
    statusRac: "RAC - காத்திருப்பு இருக்கை",
    statusWl: "WL / GNWL - காத்திருப்போர் பட்டியல்",
    statusTatkal: "TATKAL - தட்கல் டிக்கெட்",
    statusGeneral: "GENERAL - பொது வகுப்பு",
    statusCancelled: "CANCELLED - ரத்து செய்யப்பட்ட டிக்கெட்",
    checkTicketButton: "விதிமுறைகளை சரிபார்க்கவும்",
    checking: "சரிபார்க்கப்படுகிறது...",
    eligibleToBoard: "ஏற தகுதி உடையது",
    notEligibleToBoard: "ஏற தகுதி அற்றது",
    berthRule: "இருக்கை ஒதுக்கீடு விதி",
    cancellationRule: "ரத்து மற்றும் திருப்பி செலுத்துதல்",
    chartingRule: "சார்ட் தயாரிப்பு விதி",
    confirmationProbability: "உறுதியாகும் வாய்ப்பு",
    recommendedShiftAction: "பரிந்துரைக்கப்பட்ட நடவடிக்கை",
    mandatoryAdvice: "கட்டாய ஆலோசனை",
    ruleNotice: "அதிகாரப்பூர்வ விதிகளை எப்போதும் TTE அல்லது ரயில்வே ஊழியரிடம் கேட்கவும்.",
    networkError: "சேவையகத்தை தொடர்பு கொள்ள முடியவில்லை.",
    requiredFields: "அனைத்து விவரங்களையும் நிரப்பவும்.",
  },
  te: {
    appTitle: "ShiftTrain AI",
    appSubtitle: "తదుపరి తరం ప్రయాణీకుల మేధస్సు మరియు స్టేషన్ సమాచార వ్యవస్థ",
    demoBanner: "డెమో డేటా: సిమ్యులేటెడ్ రైల్వే అసిస్టెంట్",
    demoBannerSubtitle: "లైవ్ IRCTC కనెక్షన్ లేదు. అధికారిక నియమాలను ఎల్లప్పుడూ రైల్వే సిబ్బందిని అడగండి.",
    partialNotice: "ShiftTrain AI తెలుగు, ఇంగ్లీష్, హిందీ, తమిళం మరియు బెంగాలీలలో పూర్తి సేవలను అందిస్తుంది.",
    tabSearch: "రైలు శోధన",
    tabShift: "షిఫ్ట్ సలహాదారు",
    tabStation: "స్టేషన్ సమాచారం",
    tabCrowd: "రద్దీ నివేదికలు",
    tabTicket: "టికెట్ నియమాలు",
    searchTitle: "రైళ్లను వెతకండి",
    fromStation: "ప్రారంభ స్టేషన్",
    toStation: "గమ్యస్థాన స్టేషన్",
    journeyDate: "ప్రయాణ తేదీ",
    classFilter: "తరగతి ప్రాధాన్యత",
    allClasses: "అన్ని తరగతులు",
    searchButton: "రైళ్లను శోధించండి",
    searching: "రైళ్లు వెతకబడుతున్నాయి...",
    noTrainsFound: "ఈ మార్గంలో రైళ్లు లేవు.",
    trainBadge: "డెమో డేటా",
    duration: "ప్రయాణ సమయం",
    departs: "బయలుదేరు సమయం",
    arrives: "చేరు సమయం",
    runsOn: "నడిచే రోజులు",
    availableClasses: "తరగతులు",
    punctuality: "సమయపాలన రేటింగ్",
    crowdLevelIndicator: "రద్దీ అంచనా",
    suggestedShift: "⚡ ప్రత్యామ్నాయ రైలు అందుబాటులో ఉంది",
    shiftTitle: "స్మార్ట్ రైలు షిఫ్ట్ సలహాదారు",
    shiftSubtitle: "విపరీతమైన రద్దీ మరియు వెయిట్‌లిస్ట్‌ను అధిగమించడానికి అనువైన రైళ్లు",
    shiftCurrentTrain: "ప్రస్తుత రైలు (ఐచ్ఛికం)",
    shiftTicketStatus: "టికెట్ స్థితి",
    shiftCurrentCoach: "ప్రస్తుత బోగీ (ఉదా. S3, B1)",
    shiftCrowdObserved: "గమనించిన రద్దీ స్థాయి",
    calculateShiftButton: "ఉత్తమ షిఫ్ట్ ఎంపికను లెక్కించండి",
    calculatingShift: "ప్రత్యామ్నాయ రైళ్ల విశ్లేషణ జరుగుతోంది...",
    shiftScoreLabel: "షిఫ్ట్ నమ్మక స్కోరు",
    confirmationBoostLabel: "కన్ఫర్మేషన్ సంభావ్యత",
    comfortGainLabel: "సౌకర్యం పెరుగుదల అంచనా",
    urgencyLabel: "షిఫ్ట్ అత్యవసరత",
    recommendedAlternatives: "సిఫార్సు చేయబడిన ప్రత్యామ్నాయ రైళ్లు",
    coachShiftRecommendation: "బోగీ మార్పు సలహా",
    actionChecklist: "తదుపరి చర్యలు",
    shiftDisclaimer: "ఇది డెమో అంచనా మాత్రమే. ప్రయాణానికి ముందు రైల్వే సిబ్బందితో ధృవీకరించుకోండి.",
    stationTitle: "స్టేషన్ అవగాహన మరియు ప్లాట్‌ఫారమ్ రాడార్",
    stationSubtitle: "ప్లాట్‌ఫారమ్ రద్దీ, ర్యాంపులు, లిఫ్టులు మరియు ప్రయాణీకుల సౌకర్యాలు",
    selectStation: "స్టేషన్‌ను ఎంచుకోండి",
    platformCongestionTitle: "ప్లాట్‌ఫారమ్ రద్దీ రాడార్",
    platformNumberLabel: "ప్లాట్‌ఫారమ్",
    bestBoardingZoneLabel: "అనువైన బోర్డింగ్ జోన్",
    stationFacilitiesTitle: "స్టేషన్ సౌకర్యాలు",
    safetyGuidelinesTitle: "భద్రతా మార్గదర్శకాలు",
    emergencyHelplinesTitle: "అత్యవసర హెల్ప్‌లైన్లు",
    crowdTitle: "రైలు బోగీల రద్దీ నివేదిక",
    crowdSubtitle: "రైలు బోగీల రద్దీ వివరాలను తోటి ప్రయాణీకులతో పంచుకోండి",
    trainNumber: "రైలు సంఖ్య / పేరు",
    coachNumber: "బోగీ (ఉదా. S3, B1, D2)",
    crowdLevel: "రద్దీ స్థాయి",
    crowdLow: "తక్కువ (సీట్లు అందుబాటులో ఉన్నాయి)",
    crowdMedium: "మధ్యస్థం (నిలబడటానికి మాత్రమే స్థలం)",
    crowdHigh: "ఎక్కువ (భారీ రద్దీ)",
    crowdExtreme: "తీవ్రం (రైలు ఎక్కడం కష్టం)",
    cleanliness: "పరిశుభ్రత",
    cleanClean: "శుభ్రం",
    cleanAverage: "సాధారణం",
    cleanPoor: "శుభ్రత అవసరం",
    commentLabel: "అదనపు సమాచారం (గరిష్టంగా 500 అక్షరాలు)",
    commentPlaceholder: "ఉదా: డోర్ వద్ద లగేజీ రద్దీ ఎక్కువగా ఉంది",
    submitReport: "నివేదికను సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    recentReports: "తాజా నివేదికలు",
    noReportsYet: "ఇంకా నివేదికలు లేవు. మొదట మీరే నమోదు చేయండి!",
    reportSuccess: "రద్దీ నివేదిక విజయవంతంగా సమర్పించబడింది!",
    verifiedUpvotes: "సహాయకరం / ధృవీకరించబడింది",
    verifyButton: "👍 ఉపయోగకరం",
    crowdHeatmapTitle: "బోగీల రద్దీ హీట్‌మ్యాప్",
    ticketTitle: "టికెట్ నిబంధనల పరిశీలన",
    ticketSubtitle: "బోర్డింగ్ అర్హత మరియు కన్ఫర్మేషన్ నియమాలు",
    pnrNumber: "PNR సంఖ్య (10 అంకెలు)",
    ticketStatus: "ప్రస్తుత టికెట్ స్థితి",
    statusCnf: "CNF - నిర్ధారించబడింది",
    statusRac: "RAC - ప్రయాణానికి సీటు కేటాయింపు",
    statusWl: "WL / GNWL - వెయిట్‌లిస్ట్",
    statusTatkal: "TATKAL - తత్కాల్ టికెట్",
    statusGeneral: "GENERAL - సాధారణ అన్‌రిజర్వ్‌డ్ తరగతి",
    statusCancelled: "CANCELLED - రద్దు చేయబడిన టికెట్",
    checkTicketButton: "నియమాలను తనిఖీ చేయండి",
    checking: "తనిఖీ జరుగుతోంది...",
    eligibleToBoard: "రైలు ఎక్కేందుకు అర్హులు",
    notEligibleToBoard: "రైలు ఎక్కేందుకు అర్హులు కారు",
    berthRule: "బెర్త్ కేటాయింపు నిబంధన",
    cancellationRule: "రద్దు మరియు వాపసు నియమాలు",
    chartingRule: "చార్ట్ తయారీ నిబంధనలు",
    confirmationProbability: "కన్ఫర్మ్ అయ్యే అవకాశం",
    recommendedShiftAction: "సిఫార్సు చేయబడిన చర్య",
    mandatoryAdvice: "తప్పనిసరి ప్రయాణీకుల సలహా",
    ruleNotice: "అధికారిక నిబంధనల కోసం ఎల్లప్పుడూ డ్యూటీలో ఉన్న TTE లేదా రైల్వే సిబ్బందిని సంప్రదించండి.",
    networkError: "సర్వర్‌తో కనెక్ట్ కాలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",
    requiredFields: "దయచేసి అన్ని వివరాలను పూరించండి.",
  },
  bn: {
    appTitle: "ShiftTrain AI",
    appSubtitle: "পরবর্তী প্রজন্মের যাত্রী বুদ্ধিমত্তা, ট্রেন শিফট উপদেষ্টা ও স্টেশন সচেতনতা",
    demoBanner: "ডেমো ডেটা: সিমুলেটেড রেলওয়ে সহকারী",
    demoBannerSubtitle: "কোনো লাইভ IRCTC সংযোগ নেই। আনুষ্ঠানিক নিয়মের জন্য রেলকর্মীদের সাথে কথা বলুন।",
    partialNotice: "ShiftTrain AI বাংলা, ইংরেজি, হিন্দি, তামিল ও তেলুগুতে পূর্ণ পরিষেবা প্রদান করে।",
    tabSearch: "ট্রেন অনুসন্ধান",
    tabShift: "শিফট উপদেষ্টা",
    tabStation: "স্টেশন তথ্য",
    tabCrowd: "ভিড়ের রিপোর্ট",
    tabTicket: "টিকিটের নিয়ম",
    searchTitle: "ট্রেন ও রুট অনুসন্ধান",
    fromStation: "উৎস স্টেশন",
    toStation: "গন্তব্য স্টেশন",
    journeyDate: "যাত্রার তারিখ",
    classFilter: "শ্রেণীর পছন্দ",
    allClasses: "সব শ্রেণী",
    searchButton: "ট্রেন খুঁজুন",
    searching: "ট্রেন খোঁজা হচ্ছে...",
    noTrainsFound: "এই রুটে কোনো ট্রেন পাওয়া যায়নি।",
    trainBadge: "ডেমো ডেটা",
    duration: "সময়সীমা",
    departs: "প্রস্থান",
    arrives: "পৌঁছানো",
    runsOn: "চলাচলের দিন",
    availableClasses: "শ্রেণীসমূহ",
    punctuality: "সময়ানুবর্তিতা রেটিং",
    crowdLevelIndicator: "ভিড়ের পূর্বাভাস",
    suggestedShift: "⚡ বিকল্প ট্রেন উপলব্ধ",
    shiftTitle: "বুদ্ধিমান ট্রেন শিফট উপদেষ্টা",
    shiftSubtitle: "অতিরিক্ত ভিড় ও অনিশ্চিত ওয়েটিং লিস্ট এড়াতে বিকল্প ট্রেন পরামর্শ",
    shiftCurrentTrain: "বর্তমান ট্রেন (ঐচ্ছিক)",
    shiftTicketStatus: "টিকিটের স্থিতি",
    shiftCurrentCoach: "বর্তমান বগি (উদাঃ S3, B1)",
    shiftCrowdObserved: "লক্ষ্য করা ভিড়",
    calculateShiftButton: "বিকল্প শিফট হিসাব করুন",
    calculatingShift: "বিকল্প ট্রেন ও নিশ্চিতকরণ সম্ভাবনা বিশ্লেষণ করা হচ্ছে...",
    shiftScoreLabel: "শিফট আস্থা স্কোর",
    confirmationBoostLabel: "নিশ্চিতকরণ সম্ভাবনা",
    comfortGainLabel: "আনুমানিক স্বাচ্ছন্দ্য বৃদ্ধি",
    urgencyLabel: "শিফট জরুরি অবস্থা",
    recommendedAlternatives: "প্রস্তাবিত বিকল্প ট্রেনসমূহ",
    coachShiftRecommendation: "বগি পরিবর্তন পরামর্শ",
    actionChecklist: "পরবর্তী পদক্ষেপ",
    shiftDisclaimer: "এটি একটি ডেমো অনুমান। ভ্রমণের পূর্বে দয়া করে রেলওয়ে কর্মীদের সাথে যাচাই করুন।",
    stationTitle: "স্টেশন সচেতনতা ও প্ল্যাটফর্ম রাডার",
    stationSubtitle: "প্ল্যাটফর্ম ভিড় রাডার, র‍্যাম্প, লিফট ও যাত্রী সুযোগ-সুবিধা",
    selectStation: "স্টেশন নির্বাচন করুন",
    platformCongestionTitle: "প্ল্যাটফর্ম ভিড় রাডার",
    platformNumberLabel: "প্ল্যাটফর্ম",
    bestBoardingZoneLabel: "আদর্শ বোর্ডিং জোন",
    stationFacilitiesTitle: "স্টেশন সুবিধাসমূহ",
    safetyGuidelinesTitle: "সুরক্ষা নির্দেশিকা",
    emergencyHelplinesTitle: "জরুরি হেল্পলাইন নম্বর",
    crowdTitle: "যাত্রীদের ভিড়ের রিপোর্ট",
    crowdSubtitle: "অন্যান্য যাত্রীদের দ্বারা যাচাইকৃত বগির ভিড়ের অবস্থা জানুন ও শেয়ার করুন",
    trainNumber: "ট্রেন নম্বর / নাম",
    coachNumber: "বগি (উদাঃ S3, B1, D2)",
    crowdLevel: "ভিড়ের স্তর",
    crowdLow: "কম (আসন উপলব্ধ)",
    crowdMedium: "মাঝারি (শুধু দাঁড়ানোর জায়গা)",
    crowdHigh: "বেশি (ভারী ভিড়)",
    crowdExtreme: "চরম (ওঠা কঠিন)",
    cleanliness: "পরিচ্ছন্নতা",
    cleanClean: "পরিষ্কার",
    cleanAverage: "সাধারণ",
    cleanPoor: "পরিষ্কার প্রয়োজন",
    commentLabel: "অতিরিক্ত মন্তব্য (সর্বোচ্চ ৫০০ অক্ষর)",
    commentPlaceholder: "যেমন: দরজার কাছে ভারী লাগেজ ভিড়",
    submitReport: "রিপোর্ট জমা দিন",
    submitting: "জমা দেওয়া হচ্ছে...",
    recentReports: "লাইভ যাচাইকৃত রিপোর্ট",
    noReportsYet: "এখনও কোনো রিপোর্ট নেই। প্রথম রিপোর্টটি আপনিই করুন!",
    reportSuccess: "ভিড়ের রিপোর্ট সফলভাবে জমা হয়েছে!",
    verifiedUpvotes: "উপকারী / যাচাইকৃত",
    verifyButton: "👍 উপকারী",
    crowdHeatmapTitle: "বগিভিত্তিক ভিড়ের হিটম্যাপ",
    ticketTitle: "টিকিট নিয়ম পরীক্ষা",
    ticketSubtitle: "যাত্রার যোগ্যতা, চার্টিং নিয়ম ও নিশ্চিতকরণ সম্ভাবনা",
    pnrNumber: "পিএনআর নম্বর (১০ ডিজিট)",
    ticketStatus: "বর্তমান টিকিট স্থিতি",
    statusCnf: "CNF - নিশ্চিত আসন",
    statusRac: "RAC - বসার আসন নিশ্চিত",
    statusWl: "WL / GNWL - ওয়েটিং লিস্ট",
    statusTatkal: "TATKAL - তৎকাল টিকিট",
    statusGeneral: "GENERAL - সাধারণ অসংরক্ষিত শ্রেণী",
    statusCancelled: "CANCELLED - বাতিলকৃত টিকিট",
    checkTicketButton: "নিয়ম পরীক্ষা করুন",
    checking: "নিয়ম যাচাই করা হচ্ছে...",
    eligibleToBoard: "ওঠার যোগ্য",
    notEligibleToBoard: "ওঠার যোগ্য নয়",
    berthRule: "আসন বরাদ্দ নিয়ম",
    cancellationRule: "বাতিল ও রিফান্ড নীতি",
    chartingRule: "চার্ট তৈরির নিয়ম",
    confirmationProbability: "নিশ্চিত হওয়ার সম্ভাবনা",
    recommendedShiftAction: "প্রস্তাবিত পদক্ষেপ",
    mandatoryAdvice: "বাধ্যতামূলক পরামর্শ",
    ruleNotice: "সবসময় অন-ডিউটি TTE বা রেলওয়ে কর্মীদের কাছ থেকে নিশ্চিত হন।",
    networkError: "সার্ভারে সংযোগ করা সম্ভব হয়নি। অনুগ্রহ করে পরে চেষ্টা করুন।",
    requiredFields: "দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন।",
  }
};
