export interface Benefit {
  icon: string;
  title: string;
  description: string;
  tamilTitle: string;
  tamilDescription: string;
}

export interface CraftTool {
  id: string;
  name: string;
  tamilName: string;
  subtitle: string;
  image: string;
  description: string;
  tamilDescription: string;
  benefits: Benefit[];
  funFact: string;
  tamilFunFact: string;
  color: string;
  gradient: string;
}

export interface ComparisonItem {
  label: string;
  stone: number;
  machine: number;
}

export const CRAFT_TOOLS: CraftTool[] = [
  {
    id: 'ammikall',
    name: 'Ammikall',
    tamilName: 'அம்மிக்கல்',
    subtitle: 'The Flat Stone Grinder',
    image: '/images/benefits/ammikall.png',
    description:
      'The Ammikall is a flat granite slab paired with a cylindrical stone roller. For centuries, Tamil households have used it to grind wet pastes — chutneys, masalas, and curry bases — preserving every drop of essential oil.',
    tamilDescription:
      'பாரம்பரிய முறையில் கருங்கல்லால் செய்யப்பட்ட அம்மிக்கல்லைப் பயன்படுத்துவது சமையலில் சுவையை அதிகரிப்பதோடு மட்டுமல்லாமல், சிறந்த உடல் ஆரோக்கியத்தையும் தருகிறது. இது உணவின் இயற்கையான சத்துக்களைப் பாதுகாத்து, உடற்பயிற்சியாகவும் செயல்படுகிறது.',
    benefits: [
      {
        icon: '🌿',
        title: 'Cold Grinding Process',
        tamilTitle: 'குளிர் அரைத்தல் முறை',
        description:
          'Unlike electric grinders that generate heat and destroy volatile oils, the Ammikall works at ambient temperature, keeping every aromatic compound intact.',
        tamilDescription:
          'மின்சார மிக்சிகள் போல வெப்பத்தை உருவாக்காமல், அம்மிக்கல் இயற்கையான வெப்பநிலையில் அரைப்பதால் மசாலாவின் வாசனை எண்ணெய்கள் அப்படியே பாதுகாக்கப்படுகின்றன.'
      },
      {
        icon: '💎',
        title: 'Nutrient Preservation',
        tamilTitle: 'ஊட்டச்சத்து பாதுகாப்பு',
        description:
          'The slow crushing action preserves vitamins, minerals, and antioxidants that are otherwise degraded by high-speed blades and friction heat.',
        tamilDescription:
          'மெதுவான அழுத்த அரைப்பு முறை வைட்டமின்கள், தாதுக்கள் மற்றும் ஆன்டி-ஆக்ஸிடன்ட்களை சிதைக்காமல் அப்படியே உணவில் சேர்க்கிறது.'
      },
      {
        icon: '✨',
        title: 'Superior Texture',
        tamilTitle: 'சிறந்த பக்குவம்',
        description:
          'Produces a coarse, uneven grind that traps air pockets — this is what gives stone-ground chutneys their signature creamy-yet-rustic mouthfeel.',
        tamilDescription:
          'உணவின் தனித்துவமான சுவை மற்றும் கெட்டித்தன்மையை அம்மிக்கல்லின் அரைப்பு முறை மட்டுமே தருகிறது. இது பாரம்பரிய பக்குவத்தை அளிக்கிறது.'
      },
      {
        icon: '🔬',
        title: 'No Metal Contamination',
        tamilTitle: 'உலோகக் கலப்பற்றது',
        description:
          'Granite-on-granite contact means zero metal leaching. Machine blades shed micro-particles over time that end up in your food.',
        tamilDescription:
          'கல் மீது கல் தேய்வதால் எவ்வித உலோகத் துகள்களும் உணவில் கலப்பதில்லை. இது உடலுக்கு முற்றிலும் ஆரோக்கியமானது.'
      }
    ],
    funFact:
      'An Ammikall gifted during a Tamil wedding is considered a blessing for a lifetime of wholesome home cooking.',
    tamilFunFact:
      'தமிழ் திருமணங்களின் போது அம்மி மிதித்து அருந்ததி பார்க்கும் சடங்கு, வாழ்நாள் முழுமைக்கும் ஆரோக்கியமான வாழ்விற்கான ஆசியாகக் கருதப்படுகிறது.',
    color: '#8B1E1E',
    gradient: 'from-[#8B1E1E] to-[#6B1616]',
  },
  {
    id: 'aatukal',
    name: 'Aatukal',
    tamilName: 'ஆட்டுக்கல்',
    subtitle: 'The Stone Mortar & Pestle',
    image: '/images/benefits/aatukal.png',
    description:
      'The Aatukal is a heavy granite mortar and pestle used to pound whole spices into coarse or fine powders. The impact-based grinding is what unlocks the deepest layers of flavour in every seed and bark.',
    tamilDescription:
      'உரலும் உலக்கையும் கொண்டு தானியங்களையும் மசாலாக்களையும் இடிப்பது பாரம்பரிய சமையலின் ஒரு முக்கிய அங்கமாகும். இது வாசனைப் பொருட்களை நசுக்கி அதன் அசல் மணத்தை வெளிக்கொணர உதவுகிறது.',
    benefits: [
      {
        icon: '💥',
        title: 'Impact Grinding',
        tamilTitle: 'இடித்தல் முறை',
        description:
          'Pounding cracks open spice cells with force, releasing essential oils in a burst — creating an intensity of aroma that blade-cutting simply misses.',
        tamilDescription:
          'உரலில் இடிப்பதால் மசாலாக்களின் செல்கள் உடைக்கப்பட்டு வாசனை எண்ணெய்கள் முழுமையாக வெளிப்பட்டு, உணவின் மணத்தை இருமடங்கு கூட்டுகிறது.'
      },
      {
        icon: '🌡️',
        title: 'Heat-Free Processing',
        tamilTitle: 'வெப்பமில்லா செயல்முறை',
        description:
          'The brief impact produces negligible heat compared to continuous friction in electric grinders, preserving heat-sensitive compounds like curcumin.',
        tamilDescription:
          'இடிக்கும் போது வெப்பம் உருவாகாததால் மஞ்சளின் குர்குமின் போன்ற உடலுக்கு நன்மை பயக்கும் சத்துக்கள் வீணாவதில்லை.'
      },
      {
        icon: '🎨',
        title: 'Natural Colour Retention',
        tamilTitle: 'இயற்கை நிறம்',
        description:
          'Spices retain their vibrant natural colours — turmeric stays golden, chili stays deep red — because pigments are not oxidized by heat.',
        tamilDescription:
          'மசாலாக்கள் அவற்றின் அசல் நிறம் மாறாமல் சமையலை அழகாகவும் சுவையாகவும் மாற்றுகிறது.'
      }
    ],
    funFact:
      'In Chettinad tradition, the sound of the Aatukal early in the morning signals the start of a feast day.',
    tamilFunFact:
      'செட்டிநாடு பாரம்பரியத்தில், அதிகாலையில் கேட்கும் ஆட்டுக்கல்லின் ஓசை விழா மற்றும் விருந்து நாட்களின் தொடக்கத்தை அறிவிக்கிறது.',
    color: '#5C4033',
    gradient: 'from-[#5C4033] to-[#3E2A1E]',
  },
  {
    id: 'chakki',
    name: 'Chakki',
    tamilName: 'சக்கி (திருவை)',
    subtitle: 'The Rotary Stone Mill',
    image: '/images/benefits/chakki.png',
    description:
      'The Chakki consists of two circular stones — a stationary base and a rotating top stone turned by hand. It is the original flour mill, producing atta and spice powders with an incomparable wholesome quality.',
    tamilDescription:
      'திருவை என்பது இரு வட்ட வடிவ கற்களைக் கொண்டு தானியங்களை மாவாக அரைக்கும் பாரம்பரிய கருவியாகும். இது தானியங்களின் சத்துக்கள் வீணாகாமல் மாவாக்க உதவுகிறது.',
    benefits: [
      {
        icon: '🌾',
        title: 'Whole Grain Integrity',
        tamilTitle: 'முழு தானிய சத்துக்கள்',
        description:
          'The slow rotation keeps the bran, germ, and endosperm evenly distributed, unlike roller mills that separate and discard the most nutritious parts.',
        tamilDescription:
          'மெதுவாக சுழலும் கற்கள் தவிடு மற்றும் தானியத்தின் சத்துக்களை பிரிக்காமல் மாவோடு சேர்த்து அரைக்கின்றன.'
      },
      {
        icon: '🔥',
        title: 'Low-Temperature Milling',
        tamilTitle: 'குறைந்த வெப்ப அரைப்பு',
        description:
          'Chakki grinding stays below 40°C, preserving wheat germ oil, B-vitamins, and natural enzymes that are destroyed at higher temperatures.',
        tamilDescription:
          'அரைக்கும் போது மாவு சூடாகாமல் 40°C-க்கு கீழ் இருப்பதால், மாவின் தரம் மற்றும் மாவுச்சத்தின் இயற்கை தன்மை மாறாமல் பாதுகாக்கப்படுகிறது.'
      },
      {
        icon: '🫗',
        title: 'Better Dough Quality',
        tamilTitle: 'மிருதுவான தரம்',
        description:
          'Chakki-ground flour absorbs more water and produces softer, fluffier rotis because the starch granules are gently crushed, not shattered.',
        tamilDescription:
          'இம்முறையில் அரைக்கப்படும் மாவு அதிக நீரை உறிஞ்சி, மிகவும் மிருதுவான மற்றும் சத்தான சப்பாத்திகளைத் தருகிறது.'
      },
      {
        icon: '🌍',
        title: 'Eco-Friendly Heritage',
        tamilTitle: 'சுற்றுச்சூழல் பாதுகாப்பு',
        description:
          'A hand-cranked Chakki has zero carbon footprint. It connects us to 5,000 years of Indus Valley milling tradition.',
        tamilDescription:
          'மின்சாரம் இல்லாத, 5000 ஆண்டுகள் பழமையான பாரம்பரிய சுற்றுச்சூழல் நட்பு முறையில் அரைக்கப்படும் மாவு.'
      }
    ],
    funFact:
      'Ancient Chakkis discovered at Harappan sites prove that stone milling has been part of Indian life for over 5,000 years.',
    tamilFunFact:
      'ஹரப்பா அகழ்வாராய்ச்சியில் கண்டெடுக்கப்பட்ட கல் திருவைகள், இந்தியாவில் 5000 ஆண்டுகளுக்கும் மேலாக இந்த பாரம்பரியம் உள்ளதை நிரூபிக்கின்றன.',
    color: '#6B5B3E',
    gradient: 'from-[#6B5B3E] to-[#4A3F2B]',
  },
];

export const COMPARISON_DATA: ComparisonItem[] = [
  { label: 'Nutrient Retention', stone: 95, machine: 55 },
  { label: 'Aroma Preservation', stone: 98, machine: 40 },
  { label: 'Natural Oil Content', stone: 92, machine: 35 },
  { label: 'Shelf Life', stone: 88, machine: 60 },
  { label: 'Flavour Depth', stone: 96, machine: 45 },
  { label: 'Colour Vibrancy', stone: 90, machine: 50 },
];
