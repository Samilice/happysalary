export const SITE_NAME = "HappySalary";
export const SITE_URL = "https://happysalary.ch";
export const CONTACT_EMAIL = "info@happysalary.ch";

export const STATS = {
  householdsWithEmployees: 250000,
  undeclaredPercent: 75,
  savingsPercent: 40,
  cantonsCovered: 26,
} as const;

export const NAV_LINKS = [
  { key: "services", href: "#" },
  { key: "pricing", href: "/pricing" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "about", href: "/about" },
  { key: "faq", href: "/faq" },
] as const;

export const SERVICE_PAGES = [
  { key: "cleaningLady", href: "/services/cleaning-lady" },
  { key: "nanny", href: "/services/nanny" },
  { key: "auPair", href: "/services/au-pair" },
  { key: "elderlyCare", href: "/services/elderly-care" },
  { key: "gardener", href: "/services/gardener" },
] as const;

export const FEATURE_PAGES = [
  { key: "payroll", href: "/features/payroll" },
  { key: "socialContributions", href: "/features/social-contributions" },
  { key: "accidentInsurance", href: "/features/accident-insurance" },
  { key: "employmentContracts", href: "/features/employment-contracts" },
  { key: "payslips", href: "/features/payslips" },
] as const;

export const TESTIMONIALS = [
  {
    id: 1,
    nameKey: "marie",
    image: "/images/testimonials/marie-l.webp",
    role: "employerCleaning",
    location: "Lausanne",
    rating: 5,
  },
  {
    id: 2,
    nameKey: "thomas",
    image: "/images/testimonials/thomas-m.webp",
    role: "employerNanny",
    location: "Zurich",
    rating: 5,
  },
  {
    id: 3,
    nameKey: "anna",
    image: "/images/testimonials/anna-s.webp",
    role: "employerAuPair",
    location: "Bern",
    rating: 5,
  },
  {
    id: 4,
    nameKey: "peter",
    image: "/images/testimonials/peter-w.webp",
    role: "employerElderlyCare",
    location: "Basel",
    rating: 4,
  },
  {
    id: 5,
    nameKey: "sophie",
    image: "/images/testimonials/sophie-b.webp",
    role: "employerCleaning",
    location: "Geneva",
    rating: 5,
  },
  {
    id: 6,
    nameKey: "marco",
    image: "/images/testimonials/marco-r.webp",
    role: "employerGardener",
    location: "Lugano",
    rating: 5,
  },
] as const;
