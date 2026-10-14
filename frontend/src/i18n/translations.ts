export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  isPartial?: boolean;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isPartial: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isPartial: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isPartial: true },
];

export interface AppTranslations {
  appTitle: string;
  appSubtitle: string;
  demoBanner: string;
  demoBannerSubtitle: string;
  partialNotice: string;
  
  // Navigation tabs
  tabSearch: string;
  tabCrowd: string;
  tabTicket: string;

  // Search tab
  searchTitle: string;
  fromStation: string;
  toStation: string;
  journeyDate: string;
  searchButton: string;
  searching: string;
  noTrainsFound: string;
  trainBadge: string;
  duration: string;
  departs: string;
  arrives: string;
  runsOn: string;
  availableClasses: string;

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
  mandatoryAdvice: string;
  ruleNotice: string;

  // Common errors
  networkError: string;
  requiredFields: string;
}

export const translations: Record<SupportedLanguage, AppTranslations> = {
  en: {
    appTitle: "ShiftTrain AI",
    appSubtitle: "Next-generation commuter intelligence & station awareness",
    demoBanner: "DEMO DATA: Simulated Railway Assistant",
    demoBannerSubtitle: "No live IRCTC connection. Official ticket rules not verified. Always ask railway staff.",
    partialNotice: "Note: Tamil, Telugu & Bengali provide partial screen coverage. Please refer to English or Hindi for authoritative demo messages.",
    tabSearch: "Train Search",
    tabCrowd: "Crowd Reports",
    tabTicket: "Ticket Check (Rules)",
    searchTitle: "Search Demo Trains",
    fromStation: "From Station",
    toStation: "To Station",
    journeyDate: "Date of Journey",
    searchButton: "Search Trains",
    searching: "Searching Demo Trains...",
    noTrainsFound: "No demo trains found for this route.",
    trainBadge: "DEMO DATA",
    duration: "Duration",
    departs: "Departs",
    arrives: "Arrives",
    runsOn: "Runs On",
    availableClasses: "Classes",
    crowdTitle: "Crowdsourced Carriage Reports",
    crowdSubtitle: "Share & view in-memory coach crowd levels (resets on restart)",
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
    recentReports: "Live In-Memory Reports",
    noReportsYet: "No crowd reports submitted yet. Be the first to report!",
    reportSuccess: "Crowd report submitted successfully!",
    ticketTitle: "Deterministic Ticket Rule Check",
    ticketSubtitle: "Inspect boarding logic and unverified rules",
    pnrNumber: "PNR Number (Optional)",
    ticketStatus: "Current Ticket Status",
    statusCnf: "CNF - Confirmed",
    statusRac: "RAC - Reservation Against Cancellation",
    statusWl: "WL / GNWL - Waitlisted",
    statusTatkal: "Tatkal",
    statusGeneral: "General / Unreserved",
    statusCancelled: "Cancelled",
    checkTicketButton: "Evaluate Ticket Rules",
    checking: "Evaluating Rules...",
    eligibleToBoard: "Eligible to Board Coach",
    notEligibleToBoard: "Not Eligible to Board Reserved Coach",
    berthRule: "Berth Allocation Rule",
    cancellationRule: "Cancellation / Refund Rule",
    mandatoryAdvice: "Official Advice",
    ruleNotice: "DEMO RULE ENGINE: No official ticket rule is verified. Always ask railway staff.",
    networkError: "Could not connect to backend server. Make sure API is running.",
    requiredFields: "Please fill in all mandatory fields."
  },
  hi: {
    appTitle: "शिफ्टट्रेन एआई",
    appSubtitle: "यात्री सुविधा और स्टेशन जागरूकता मंच",
    demoBanner: "डेमो डेटा: सिमुलेटेड रेलवे सहायक",
    demoBannerSubtitle: "कोई लाइव आईआरसीटीसी कनेक्शन नहीं। कोई आधिकारिक नियम सत्यापित नहीं। सदैव रेलवे कर्मचारियों से पूछें।",
    partialNotice: "सूचना: हिन्दी अनुवाद पूर्ण है। अन्य भाषाओं में आंशिक अनुवाद है।",
    tabSearch: "ट्रेन खोजें",
    tabCrowd: "भीड़ रिपोर्ट",
    tabTicket: "टिकट नियम जांच",
    searchTitle: "डेमो ट्रेनें खोजें",
    fromStation: "प्रस्थान स्टेशन",
    toStation: "गंतव्य स्टेशन",
    journeyDate: "यात्रा की तिथि",
    searchButton: "ट्रेनें खोजें",
    searching: "डेमो ट्रेनें खोजी जा रही हैं...",
    noTrainsFound: "इस मार्ग के लिए कोई डेमो ट्रेन नहीं मिली।",
    trainBadge: "डेमो डेटा",
    duration: "समय अवधि",
    departs: "प्रस्थान",
    arrives: "आगमन",
    runsOn: "चलने के दिन",
    availableClasses: "श्रेणी",
    crowdTitle: "यात्री भीड़ रिपोर्ट",
    crowdSubtitle: "कोच की वास्तविक भीड़ साझा करें (रीस्टार्ट पर रीसेट)",
    trainNumber: "ट्रेन संख्या / नाम",
    coachNumber: "कोच (जैसे S3, B1, D2)",
    crowdLevel: "भीड़ का स्तर",
    crowdLow: "कम (सीटें उपलब्ध)",
    crowdMedium: "मध्यम (खड़े होने की जगह)",
    crowdHigh: "अधिक (भारी भीड़)",
    crowdExtreme: "अत्यधिक (चढ़ना कठिन)",
    cleanliness: "स्वच्छता",
    cleanClean: "साफ",
    cleanAverage: "सामान्य",
    cleanPoor: "सफाई आवश्यक",
    commentLabel: "अतिरिक्त टिप्पणी (अधिकतम 500 वर्ण)",
    commentPlaceholder: "उदा., गेट के पास सामान की भीड़ है",
    submitReport: "भीड़ रिपोर्ट दर्ज करें",
    submitting: "रिपोर्ट दर्ज की जा रही है...",
    recentReports: "हाल की भीड़ रिपोर्टें",
    noReportsYet: "अभी तक कोई भीड़ रिपोर्ट दर्ज नहीं की गई है।",
    reportSuccess: "भीड़ रिपोर्ट सफलतापूर्वक सबमिट हो गई!",
    ticketTitle: "टिकट नियम जांच इंजन",
    ticketSubtitle: "बोर्डिंग पात्रता और नियमों की जांच करें",
    pnrNumber: "पीएनआर नंबर (वैकल्पिक)",
    ticketStatus: "वर्तमान टिकट स्थिति",
    statusCnf: "CNF - कन्फर्म्ड",
    statusRac: "RAC - आरएसी",
    statusWl: "WL / GNWL - वेटिंग लिस्ट",
    statusTatkal: "तत्काल",
    statusGeneral: "जनरल / अनारक्षित",
    statusCancelled: "रद्द (Cancelled)",
    checkTicketButton: "नियमों का मूल्यांकन करें",
    checking: "मूल्यांकन जारी है...",
    eligibleToBoard: "कोच में चढ़ने के लिए पात्र",
    notEligibleToBoard: "आरक्षित कोच में चढ़ने के लिए पात्र नहीं",
    berthRule: "बर्थ आवंटन नियम",
    cancellationRule: "रद्दीकरण / धनवापसी नियम",
    mandatoryAdvice: "आधिकारिक सलाह",
    ruleNotice: "डेमो नियम: कोई आधिकारिक टिकट नियम सत्यापित नहीं है। सदैव रेलवे कर्मचारियों से पूछें।",
    networkError: "बैकएंड सर्वर से संपर्क नहीं हो सका।",
    requiredFields: "कृपया सभी आवश्यक फ़ील्ड भरें।"
  },
  ta: {
    appTitle: "ஷிப்ட்ரெய்ன் AI (ShiftTrain AI)",
    appSubtitle: "ரயில் பயண நுண்ணறிவு தளம்",
    demoBanner: "டெமோ தரவு: மாதிரி ரயில் உதவி சேவை",
    demoBannerSubtitle: "நேரடி IRCTC இணைப்பு இல்லை. அதிகாரப்பூர்வ விதிகளுக்கு ரயில்வே ஊழியர்களை அணுகவும்.",
    partialNotice: "Partial translation: Tamil covers main screens only and has not been reviewed by a native speaker. Please refer to English or Hindi.",
    tabSearch: "ரயில் தேடல்",
    tabCrowd: "கூட்ட நெரிசல் தகவல்",
    tabTicket: "டிக்கெட் விதி சரிபார்ப்பு",
    searchTitle: "மாதிரி ரயில்களைத் தேடுங்கள்",
    fromStation: "புறப்படும் நிலையம்",
    toStation: "சேரும் நிலையம்",
    journeyDate: "பயணத் தேதி",
    searchButton: "ரயில்களைத் தேடு",
    searching: "தேடப்படுகிறது...",
    noTrainsFound: "ரயில்கள் எதுவும் கிடைக்கவில்லை.",
    trainBadge: "DEMO DATA",
    duration: "பயண நேரம்",
    departs: "புறப்பாடு",
    arrives: "வருகை",
    runsOn: "இயங்கும் நாட்கள்",
    availableClasses: "வகுப்புகள்",
    crowdTitle: "பயணிகள் கூட்ட நெரிசல் பதிவு",
    crowdSubtitle: "பெட்டிகளின் கூட்ட நிலையை பகிரவும்",
    trainNumber: "ரயில் எண்",
    coachNumber: "பெட்டி எண் (S3, B1)",
    crowdLevel: "கூட்ட நிலை",
    crowdLow: "குறைவு (இருக்கைகள் உள்ளன)",
    crowdMedium: "நடுத்தரம்",
    crowdHigh: "அதிக நெரிசல்",
    crowdExtreme: "மிக அதிக நெரிசல்",
    cleanliness: "தூய்மை",
    cleanClean: "சுத்தம்",
    cleanAverage: "சராசரி",
    cleanPoor: "மோசம்",
    commentLabel: "கூடுதல் தகவல்",
    commentPlaceholder: "விவரங்களை உள்ளிடவும்",
    submitReport: "பதிவு செய்க",
    submitting: "பதிவாகிறது...",
    recentReports: "சமீபத்திய பதிவுகள்",
    noReportsYet: "பதிவுகள் எதுவும் இல்லை.",
    reportSuccess: "வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
    ticketTitle: "டிக்கெட் விதி சரிபார்ப்பு",
    ticketSubtitle: "பயண விதிகள் & வழிகாட்டுதல்",
    pnrNumber: "PNR எண்",
    ticketStatus: "டிக்கெட் நிலை",
    statusCnf: "CNF - உறுதி செய்யப்பட்டது",
    statusRac: "RAC - இருக்கை மட்டும்",
    statusWl: "WL - காத்திருப்பு பட்டியல்",
    statusTatkal: "தட்கல் (Tatkal)",
    statusGeneral: "பொது வகுப்பு (General)",
    statusCancelled: "ரத்து செய்யப்பட்டது",
    checkTicketButton: "விதிகளை சரிபார்க்கவும்",
    checking: "சரிபார்க்கப்படுகிறது...",
    eligibleToBoard: "பயணிக்க தகுதியானது",
    notEligibleToBoard: "முன்பதிவு பெட்டியில் ஏற அனுமதியில்லை",
    berthRule: "இருக்கை ஒதுக்கீடு விதி",
    cancellationRule: "ரத்து செய்யும் விதி",
    mandatoryAdvice: "கட்டாய ஆலோசனை",
    ruleNotice: "விதிகள் சரிபார்க்கப்படவில்லை. எப்போதும் ரயில்வே ஊழியர்களிடம் கேட்கவும்.",
    networkError: "சேவையகத்தை இணைக்க முடியவில்லை.",
    requiredFields: "தேவையான புலங்களை நிரப்பவும்."
  },
  te: {
    appTitle: "షిఫ్ట్‌ట్రైన్ AI (ShiftTrain AI)",
    appSubtitle: "రైల్వే ప్రయాణ సమాచార వేదిక",
    demoBanner: "డెమో డేటా: నమూనా రైలు సహాయకుడు",
    demoBannerSubtitle: "లైవ్ IRCTC కనెక్షన్ లేదు. ఎల్లప్పుడూ రైల్వే సిబ్బందిని సంప్రదించండి.",
    partialNotice: "Partial translation: Telugu covers main screens only and has not been reviewed by a native speaker. Please refer to English or Hindi.",
    tabSearch: "రైలు శోధన",
    tabCrowd: "రద్దీ నివేదికలు",
    tabTicket: "టికెట్ నిబంధనల తనిఖీ",
    searchTitle: "డెమో రైళ్లను శోధించండి",
    fromStation: "ప్రారంభ స్టేషన్",
    toStation: "గమ్యస్థాన స్టేషన్",
    journeyDate: "ప్రయాణ తేదీ",
    searchButton: "రైళ్లను వెతకండి",
    searching: "శోధిస్తోంది...",
    noTrainsFound: "రైళ్లు కనుగొనబడలేదు.",
    trainBadge: "DEMO DATA",
    duration: "సమయం",
    departs: "బయలుదేరు సమయం",
    arrives: "చేరుకునే సమయం",
    runsOn: "నడిచే రోజులు",
    availableClasses: "తరగతులు",
    crowdTitle: "బోగీ రద్దీ నివేదికలు",
    crowdSubtitle: "రద్దీ సమాచారాన్ని పంచుకోండి",
    trainNumber: "రైలు నంబర్",
    coachNumber: "కోచ్ (ఉదా. S3, B1)",
    crowdLevel: "రద్దీ స్థాయి",
    crowdLow: "తక్కువ (సీట్లు ఉన్నాయి)",
    crowdMedium: "మధ్యస్థం",
    crowdHigh: "ఎక్కువ రద్దీ",
    crowdExtreme: "విపరీతమైన రద్దీ",
    cleanliness: "పరిశుభ్రత",
    cleanClean: "శుభ్రంగా ఉంది",
    cleanAverage: "సాధారణం",
    cleanPoor: "శుభ్రత అవసరం",
    commentLabel: "అదనపు గమనిక",
    commentPlaceholder: "వివరాలు నమోదు చేయండి",
    submitReport: "నివేదిక సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    recentReports: "ఇటీవలి నివేదికలు",
    noReportsYet: "ఇంకా నివేదికలు లేవు.",
    reportSuccess: "నివేదిక విజయవంతంగా సమర్పించబడింది!",
    ticketTitle: "టికెట్ నిబంధనల పరిశీలన",
    ticketSubtitle: "బోర్డింగ్ నియమాలు",
    pnrNumber: "PNR నంబర్",
    ticketStatus: "టికెట్ స్థితి",
    statusCnf: "CNF - కన్ఫర్మ్ చేయబడింది",
    statusRac: "RAC - ఆర్ఏసీ",
    statusWl: "WL - వెయిటింగ్ లిస్ట్",
    statusTatkal: "తత్కాల్",
    statusGeneral: "జనరల్ / అన్‌రిజర్వ్‌డ్",
    statusCancelled: "రద్దు చేయబడింది",
    checkTicketButton: "నిబంధనలు తనిఖీ చేయండి",
    checking: "తనిఖీ చేస్తోంది...",
    eligibleToBoard: "బోర్డింగ్ అర్హత ఉంది",
    notEligibleToBoard: "రిజర్వ్డ్ కోచ్‌లో ప్రవేశం లేదు",
    berthRule: "బెర్త్ కేటాయింపు నియమం",
    cancellationRule: "రద్దు / వాపసు నియమం",
    mandatoryAdvice: "ముఖ్యమైన సలహా",
    ruleNotice: "నియమాలు ధృవీకరించబడలేదు. ఎల్లప్పుడూ రైల్వే సిబ్బందిని అడగండి.",
    networkError: "సర్వర్‌తో కనెక్ట్ కాలేకపోయాము.",
    requiredFields: "దయచేసి అవసరమైన వివరాలను నమోదు చేయండి."
  },
  bn: {
    appTitle: "শিফটট্রেন এআই (ShiftTrain AI)",
    appSubtitle: "রেলওয়ে যাত্রী তথ্য ও সহায়তা প্ল্যাটফর্ম",
    demoBanner: "ডেমো ডেটা: সিমুলেটেড রেলওয়ে সহকারী",
    demoBannerSubtitle: "কোনো লাইভ IRCTC সংযোগ নেই। সর্বদা রেলওয়ে কর্মীদের সাথে যোগাযোগ করুন।",
    partialNotice: "Partial translation: Bengali covers main screens only and has not been reviewed by a native speaker. Please refer to English or Hindi.",
    tabSearch: "ট্রেন অনুসন্ধান",
    tabCrowd: "ভিড় রিপোর্ট",
    tabTicket: "টিকিট নিয়ম পরীক্ষা",
    searchTitle: "ডেমো ট্রেন অনুসন্ধান করুন",
    fromStation: "যাত্রা শুরু",
    toStation: "গন্তব্য",
    journeyDate: "যাত্রার তারিখ",
    searchButton: "ট্রেন খুঁজুন",
    searching: "অনুসন্ধান চলছে...",
    noTrainsFound: "কোনো ট্রেন পাওয়া যায়নি।",
    trainBadge: "DEMO DATA",
    duration: "সময়কাল",
    departs: "প্রস্থান",
    arrives: "পৌঁছানো",
    runsOn: "চলাচলের দিন",
    availableClasses: "শ্রেণী",
    crowdTitle: "যাত্রী ভিড় রিপোর্ট",
    crowdSubtitle: "বগির ভিড়ের অবস্থা শেয়ার করুন",
    trainNumber: "ট্রেন নম্বর",
    coachNumber: "বগি (যেমন S3, B1)",
    crowdLevel: "ভিড়ের মাত্রা",
    crowdLow: "কম (আসন উপলব্ধ)",
    crowdMedium: "মাঝারি",
    crowdHigh: "বেশি ভিড়",
    crowdExtreme: "অত্যধিক ভিড়",
    cleanliness: "পরিচ্ছন্নতা",
    cleanClean: "পরিষ্কার",
    cleanAverage: "মোটামুটি",
    cleanPoor: "অপরিচ্ছন্ন",
    commentLabel: "অতিরিক্ত মন্তব্য",
    commentPlaceholder: "বিস্তারিত লিখুন",
    submitReport: "রিপোর্ট জমা দিন",
    submitting: "জমা হচ্ছে...",
    recentReports: "সাম্প্রতিক রিপোর্ট",
    noReportsYet: "এখনও কোনো রিপোর্ট জমা হয়নি।",
    reportSuccess: "রিপোর্ট সফলভাবে জমা হয়েছে!",
    ticketTitle: "টিকিট নিয়ম যাচাই ইঞ্জিন",
    ticketSubtitle: "বোর্ডিং যোগ্যতা এবং নিয়ম",
    pnrNumber: "PNR নম্বর",
    ticketStatus: "বর্তমান টিকিট স্ট্যাটাস",
    statusCnf: "CNF - নিশ্চিত",
    statusRac: "RAC - আরএসি",
    statusWl: "WL - ওয়েটিং লিস্ট",
    statusTatkal: "তাত্কাল",
    statusGeneral: "সাধারণ / অসংরক্ষিত",
    statusCancelled: "বাতিল (Cancelled)",
    checkTicketButton: "নিয়ম পরীক্ষা করুন",
    checking: "পরীক্ষা চলছে...",
    eligibleToBoard: "বগিতে ওঠার যোগ্য",
    notEligibleToBoard: "সংরক্ষিত বগিতে ওঠার অনুমতি নেই",
    berthRule: "বার্থ বরাদ্দের নিয়ম",
    cancellationRule: "বাতিলকরণ / রিফান্ড নিয়ম",
    mandatoryAdvice: "জরুরি পরামর্শ",
    ruleNotice: "নিয়মগুলো যাচাইকৃত নয়। সর্বদা রেলওয়ে কর্মীদের সাথে কথা বলুন।",
    networkError: "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।",
    requiredFields: "অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন।"
  }
};
