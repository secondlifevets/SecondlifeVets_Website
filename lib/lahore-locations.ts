export interface LahoreLocation {
  id: string;
  name: string;
  short: string;
  description: string;
  lat: number;
  lng: number;
}

export const lahoreLocations: LahoreLocation[] = [
  {
    id: "dha-lahore",
    name: "DHA Lahore",
    short: "DHA",
    description: "Defence Housing Authority, one of Lahore's most sought-after residential communities.",
    lat: 31.4697,
    lng: 74.4025,
  },
  {
    id: "bahria-town-lahore",
    name: "Bahria Town Lahore",
    short: "Bahria Town",
    description: "Pakistan's largest private housing society, located on the outskirts of Lahore.",
    lat: 31.3636,
    lng: 74.1842,
  },
  {
    id: "johar-town-lahore",
    name: "Johar Town Lahore",
    short: "Johar Town",
    description: "A major residential and commercial area in central Lahore.",
    lat: 31.4638,
    lng: 74.2690,
  },
  {
    id: "gulberg-lahore",
    name: "Gulberg Lahore",
    short: "Gulberg",
    description: "Lahore's upscale commercial and residential hub, home to embassies, restaurants, and luxury apartments.",
    lat: 31.5127,
    lng: 74.3392,
  },
  {
    id: "model-town-lahore",
    name: "Model Town Lahore",
    short: "Model Town",
    description: "A planned residential society and one of Lahore's most prestigious neighborhoods.",
    lat: 31.4818,
    lng: 74.3127,
  },
  {
    id: "wapda-town-lahore",
    name: "Wapda Town Lahore",
    short: "Wapda Town",
    description: "A well-established residential colony in the Johar Town area of Lahore.",
    lat: 31.4595,
    lng: 74.2491,
  },
  {
    id: "iqbal-town-lahore",
    name: "Allama Iqbal Town",
    short: "Iqbal Town",
    description: "One of Lahore's largest and most densely populated residential areas.",
    lat: 31.4906,
    lng: 74.2813,
  },
  {
    id: "faisal-town-lahore",
    name: "Faisal Town Lahore",
    short: "Faisal Town",
    description: "A prime residential colony in central Lahore, close to Johar Town and Gulberg.",
    lat: 31.4831,
    lng: 74.2956,
  },
  {
    id: "lahore-cantt",
    name: "Lahore Cantt",
    short: "Cantt",
    description: "Lahore Cantonment — a prestigious military and civilian residential area in eastern Lahore.",
    lat: 31.5492,
    lng: 74.4068,
  },
  {
    id: "askari-lahore",
    name: "Askari Lahore",
    short: "Askari",
    description: "Askari housing schemes in Lahore, serving military and civilian residents.",
    lat: 31.5283,
    lng: 74.4156,
  },
  {
    id: "lake-city-lahore",
    name: "Lake City Lahore",
    short: "Lake City",
    description: "A gated community in Raiwind Road, Lahore, featuring a golf course and lake views.",
    lat: 31.4145,
    lng: 74.3411,
  },
  {
    id: "valencia-town-lahore",
    name: "Valencia Town Lahore",
    short: "Valencia",
    description: "A modern residential community in the Lahore Ring Road area.",
    lat: 31.5448,
    lng: 74.2539,
  },
  {
    id: "township-lahore",
    name: "Township Lahore",
    short: "Township",
    description: "A large residential area in southwest Lahore, well-connected to the city center.",
    lat: 31.4672,
    lng: 74.2358,
  },
  {
    id: "garden-town-lahore",
    name: "Garden Town Lahore",
    short: "Garden Town",
    description: "An upscale residential area adjacent to Gulberg, known for its tree-lined streets.",
    lat: 31.5011,
    lng: 74.3218,
  },
  {
    id: "cavalry-ground-lahore",
    name: "Cavalry Ground Lahore",
    short: "Cavalry Ground",
    description: "A prestigious residential area adjacent to Lahore Cantt, popular with military families.",
    lat: 31.5355,
    lng: 74.3884,
  },
  {
    id: "paragon-city-lahore",
    name: "Paragon City Lahore",
    short: "Paragon City",
    description: "A gated residential community off Barki Road in eastern Lahore.",
    lat: 31.4896,
    lng: 74.3843,
  },
  {
    id: "eme-society-lahore",
    name: "DHA EME Society",
    short: "EME Society",
    description: "EME Housing Society, a cooperative housing project for army engineers in DHA Lahore.",
    lat: 31.4552,
    lng: 74.3897,
  },
  {
    id: "canal-view-lahore",
    name: "Canal View Society",
    short: "Canal View",
    description: "A serene residential society along the Lahore Canal, offering beautiful green surroundings.",
    lat: 31.4716,
    lng: 74.3243,
  },
  {
    id: "sabzazar-lahore",
    name: "Sabzazar Scheme",
    short: "Sabzazar",
    description: "Sabzazar Housing Scheme, a well-connected residential area in north Lahore.",
    lat: 31.5511,
    lng: 74.3062,
  },
  {
    id: "samanabad-lahore",
    name: "Samanabad Lahore",
    short: "Samanabad",
    description: "A busy residential and commercial area in central north Lahore.",
    lat: 31.5489,
    lng: 74.3243,
  },
  {
    id: "shadman-lahore",
    name: "Shadman Lahore",
    short: "Shadman",
    description: "An established residential area close to Mall Road in central Lahore.",
    lat: 31.5312,
    lng: 74.3318,
  },
];

export function getLocationById(id: string): LahoreLocation | undefined {
  return lahoreLocations.find((loc) => loc.id === id);
}
