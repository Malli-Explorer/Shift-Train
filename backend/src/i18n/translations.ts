export type Language = 'en' | 'hi';

export interface I18nMessages {
  rateLimitExceeded: string;
  duplicateReport: string;
  sizeLimitExceeded: string;
  invalidPayload: string;
  internalServerError: string;
  notFound: string;
  ticketCheckNotice: string;
  demoDataNotice: string;
}

export const translations: Record<Language, I18nMessages> = {
  en: {
    rateLimitExceeded: "Too many requests. Please try again after some time.",
    duplicateReport: "Duplicate report detected. Similar report was recently submitted.",
    sizeLimitExceeded: "Report content exceeds allowable size limit (max 500 characters).",
    invalidPayload: "Invalid request payload. Please verify required fields.",
    internalServerError: "An unexpected error occurred. Please try again later.",
    notFound: "Requested resource was not found.",
    ticketCheckNotice: "DEMO RULE ENGINE: No official ticket rule is verified. Always ask railway staff or TTE before boarding.",
    demoDataNotice: "DEMO DATA: Simulated data for demonstration purposes only. Not connected to live railway APIs."
  },
  hi: {
    rateLimitExceeded: "बहुत अधिक अनुरोध। कृपया कुछ समय बाद पुनः प्रयास करें।",
    duplicateReport: "डुप्लिकेट रिपोर्ट मिली। समान रिपोर्ट हाल ही में सबमिट की गई थी।",
    sizeLimitExceeded: "रिपोर्ट सामग्री अनुमत आकार सीमा से अधिक है (अधिकतम 500 वर्ण)।",
    invalidPayload: "अमान्य अनुरोध विवरण। कृपया आवश्यक फ़ील्ड सत्यापित करें।",
    internalServerError: "एक अप्रत्याशित त्रुटि उत्पन्न हुई। कृपया बाद में पुनः प्रयास करें।",
    notFound: "अनुरोधित संसाधन नहीं मिला।",
    ticketCheckNotice: "डेमो नियम इंजन: कोई आधिकारिक टिकट नियम सत्यापित नहीं है। यात्रा से पहले सदैव रेलवे कर्मचारियों या टीटीई से पूछें।",
    demoDataNotice: "डेमो डेटा: केवल प्रदर्शन के लिए कृत्रिम डेटा। लाइव रेलवे एपीआई से जुड़ा नहीं है।"
  }
};

export function getMessage(key: keyof I18nMessages, lang: string = 'en'): string {
  const normalizedLang: Language = lang && lang.toLowerCase().startsWith('hi') ? 'hi' : 'en';
  return translations[normalizedLang][key] || translations['en'][key];
}
