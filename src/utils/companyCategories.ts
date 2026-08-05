export interface CompanyCategory {
  category: string;
  companies: string[];
}

export const COMPANY_CATEGORIES: CompanyCategory[] = [
  {
    category: "Tech Giants",
    companies: [
      "Google",
      "Microsoft",
      "Amazon",
      "Apple",
      "Meta",
      "Adobe",
      "Oracle",
      "Cisco",
      "Salesforce",
      "Nvidia",
    ],
  },
  {
    category: "Product Leaders",
    companies: [
      "Atlassian",
      "Uber",
      "Airbnb",
      "Stripe",
      "Spotify",
      "LinkedIn",
      "Dropbox",
    ],
  },
  {
    category: "Indian Product Majors",
    companies: [
      "Zoho",
      "Freshworks",
      "Razorpay",
      "PhonePe",
      "Swiggy",
      "Zomato",
      "Flipkart",
      "Meesho",
      "Groww",
    ],
  },
  {
    category: "Global Tech Services",
    companies: [
      "TCS",
      "Infosys",
      "Wipro",
      "Accenture",
      "Cognizant",
      "Capgemini",
      "Deloitte",
      "EY",
    ],
  },
  {
    category: "High-Growth Startups",
    companies: [
      "High-Growth Series A/B Startup",
      "Early-Stage Tech Startup",
      "Custom Enterprise",
    ],
  },
];
