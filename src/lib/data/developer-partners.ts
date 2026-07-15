export interface DeveloperPartner {
  name: string;
  src: string;
  width: number;
  height: number;
  projectNames?: string[];
}

export const DEVELOPER_PARTNERS: DeveloperPartner[] = [
  { name: "Adani Realty", src: "/partners/adani.png", width: 700, height: 140 },
  { name: "A. Shridhar", src: "/partners/ashridhar.png", width: 600, height: 137 },
  { name: "The Capstone Developers", src: "/partners/capstone.png", width: 300, height: 107, projectNames: ["Capstone"] },
  { name: "Constera Realty", src: "/partners/constera.png", width: 222, height: 50 },
  { name: "Gala Group", src: "/partners/gala.png", width: 100, height: 133 },
  { name: "Godrej Properties", src: "/partners/godrej.png", width: 1783, height: 854 },
  { name: "Goyal & Co.", src: "/partners/goyal.png", width: 139, height: 68 },
  { name: "HN Safal", src: "/partners/hnsafal-dark.png", width: 300, height: 165 },
  { name: "Maruti Group", src: "/partners/maruti-dark.png", width: 200, height: 52, projectNames: ["Maruti 360"] },
  { name: "Ravi Desai Group", src: "/partners/ravidesai.png", width: 2640, height: 733 },
  { name: "Satyamev Group", src: "/partners/satyamev.png", width: 500, height: 129 },
  { name: "Shaligram Group", src: "/partners/shaligram.png", width: 600, height: 301, projectNames: ["Shaligram Luxuria"] },
  { name: "Sun Builders", src: "/partners/sun.png", width: 1200, height: 1314 },
  { name: "Swati Procon", src: "/partners/swati.png", width: 1080, height: 142, projectNames: ["Swati Senor"] },
  { name: "Triveni Group", src: "/partners/triveni.png", width: 250, height: 139, projectNames: ["Triveni 84"] },
  { name: "Venus Infrastructure", src: "/partners/venus.png", width: 1418, height: 303 },
];

export const PORTFOLIO_PROJECT_NAMES = [
  "Ikebana",
  "Maruti 360",
  "Pashmina",
  "Swati Senor",
  "Anurita",
  "Belagio",
  "Anamika",
  "Triveni 84",
  "Avant",
  "Capstone",
  "Eminence 96",
  "Belrosa",
  "Rashmi",
  "Vaikunth",
  "Northpark",
  "Kalrav Alpines",
  "Westpark",
  "Atman",
  "Shaligram Luxuria",
  "Kimana",
  "Nehru Nagar Project",
  "Vastrapur Project",
];

const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

export const PARTNER_DEVELOPER_NAMES = DEVELOPER_PARTNERS.map((partner) => partner.name);

export const PARTNER_METADATA_KEYWORDS = unique([
  ...PARTNER_DEVELOPER_NAMES,
  ...PORTFOLIO_PROJECT_NAMES,
  "Ahmedabad developer projects",
  "Ahmedabad luxury developer projects",
  "premium real estate developers Ahmedabad",
  "luxury residential projects Ahmedabad",
  "trusted builder projects Ahmedabad",
]);

export const PARTNER_SCHEMA_KNOWS_ABOUT = unique([
  ...PARTNER_DEVELOPER_NAMES,
  ...PORTFOLIO_PROJECT_NAMES,
  ...PARTNER_DEVELOPER_NAMES.map((name) => `${name} luxury projects Ahmedabad`),
  ...PARTNER_DEVELOPER_NAMES.map((name) => `${name} residential projects Ahmedabad`),
  ...PORTFOLIO_PROJECT_NAMES.map((name) => `${name} Ahmedabad`),
]);

export const PARTNER_SEARCH_PHRASES = unique([
  ...PARTNER_SCHEMA_KNOWS_ABOUT,
  ...PARTNER_DEVELOPER_NAMES.map((name) => `${name} property Ahmedabad`),
  ...PARTNER_DEVELOPER_NAMES.map((name) => `${name} real estate Ahmedabad`),
  ...PARTNER_DEVELOPER_NAMES.map((name) => `${name} new project Ahmedabad`),
  ...PORTFOLIO_PROJECT_NAMES.map((name) => `${name} luxury property Ahmedabad`),
  ...PORTFOLIO_PROJECT_NAMES.map((name) => `${name} PIKORUA Realty`),
]);
