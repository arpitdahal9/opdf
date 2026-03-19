import type { LanguageCode } from "@/lib/language";

type I18nKey =
  | "language"
  | "pdfTools"
  | "pdfConverter"
  | "editAndOrganize"
  | "convertAndCompress"
  | "pricing"
  | "about"
  | "allTools"
  | "login"
  | "signup"
  | "menu"
  | "footerPdfTools"
  | "footerConvert"
  | "footerCompany"
  | "footerCompare"
  | "converterHub"
  | "blog"
  | "privacyPolicy"
  | "termsOfService"
  | "vsILovePDF"
  | "vsSmallPDF"
  | "ilovepdfAlternatives";

const DICT: Record<LanguageCode, Record<I18nKey, string>> = {
  en: {
    language: "Language",
    pdfTools: "PDF Tools",
    pdfConverter: "PDF Converter",
    editAndOrganize: "Edit & organize",
    convertAndCompress: "Convert & compress",
    pricing: "Pricing",
    about: "About",
    allTools: "All tools",
    login: "Log in",
    signup: "Sign up",
    menu: "Menu",
    footerPdfTools: "PDF tools",
    footerConvert: "Convert",
    footerCompany: "Company",
    footerCompare: "Compare",
    converterHub: "Converter hub",
    blog: "Blog",
    privacyPolicy: "Privacy policy",
    termsOfService: "Terms of service",
    vsILovePDF: "vs iLovePDF",
    vsSmallPDF: "vs SmallPDF",
    ilovepdfAlternatives: "iLovePDF alternatives",
  },
  hi: {
    language: "भाषा",
    pdfTools: "PDF टूल्स",
    pdfConverter: "PDF कन्वर्टर",
    editAndOrganize: "एडिट और व्यवस्थित करें",
    convertAndCompress: "कन्वर्ट और कंप्रेस",
    pricing: "मूल्य",
    about: "परिचय",
    allTools: "सभी टूल्स",
    login: "लॉग इन",
    signup: "साइन अप",
    menu: "मेनू",
    footerPdfTools: "PDF टूल्स",
    footerConvert: "कन्वर्ट",
    footerCompany: "कंपनी",
    footerCompare: "तुलना",
    converterHub: "कन्वर्टर हब",
    blog: "ब्लॉग",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    vsILovePDF: "iLovePDF बनाम",
    vsSmallPDF: "SmallPDF बनाम",
    ilovepdfAlternatives: "iLovePDF के विकल्प",
  },
  ne: {
    language: "भाषा",
    pdfTools: "PDF उपकरणहरू",
    pdfConverter: "PDF कनभर्टर",
    editAndOrganize: "सम्पादन र व्यवस्थापन",
    convertAndCompress: "कनभर्ट र कम्प्रेस",
    pricing: "मूल्य",
    about: "बारेमा",
    allTools: "सबै उपकरण",
    login: "लग इन",
    signup: "साइन अप",
    menu: "मेनु",
    footerPdfTools: "PDF उपकरणहरू",
    footerConvert: "कनभर्ट",
    footerCompany: "कम्पनी",
    footerCompare: "तुलना",
    converterHub: "कनभर्टर हब",
    blog: "ब्लग",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा सर्तहरू",
    vsILovePDF: "iLovePDF सँग तुलना",
    vsSmallPDF: "SmallPDF सँग तुलना",
    ilovepdfAlternatives: "iLovePDF विकल्पहरू",
  },
  zh: {
    language: "语言",
    pdfTools: "PDF 工具",
    pdfConverter: "PDF 转换",
    editAndOrganize: "编辑与整理",
    convertAndCompress: "转换与压缩",
    pricing: "价格",
    about: "关于",
    allTools: "全部工具",
    login: "登录",
    signup: "注册",
    menu: "菜单",
    footerPdfTools: "PDF 工具",
    footerConvert: "转换",
    footerCompany: "公司",
    footerCompare: "对比",
    converterHub: "转换中心",
    blog: "博客",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    vsILovePDF: "对比 iLovePDF",
    vsSmallPDF: "对比 SmallPDF",
    ilovepdfAlternatives: "iLovePDF 替代方案",
  },
};

export function t(lang: LanguageCode, key: I18nKey): string {
  return DICT[lang]?.[key] ?? DICT.en[key];
}

