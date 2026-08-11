// Single source of truth for company facts, drawn from the Ntarakwai
// Beekeeping Limited business overview. Do not invent figures here.

export const BRAND = {
  name: "Ntarakwai",
  legalName: "Ntarakwai Beekeeping Limited",
  tagline: "Honey with a homeland.",
  registered: "June 2026",
  shop: "Gatab, Mt. Kulal",
  location: "Mt. Kulal, Loiyangalani Ward, Marsabit County, Kenya",
  founder: "Ledany Timothy",
  phone: "+254 711 856 795",
  phoneHref: "tel:+254711856795",
  phoneDisplay: "0711 856 795",
  email: "ntarakwaibeekeeping@gmail.com",
} as const;

export const FACTS = [
  { value: "55", label: "Beehives under management", note: "Across two apiaries on Mt. Kulal" },
  { value: "30+", label: "Local beekeepers supplied", note: "Independent gatherers we buy from" },
  { value: "2", label: "Apiaries", note: "Sited in Mt. Kulal's forest belt" },
  { value: "1", label: "Honey shop", note: "Gatab, Mt. Kulal" },
] as const;

export const VALUES = [
  { title: "Authenticity", body: "What is on the label is what is in the jar. Nothing added, nothing hidden." },
  { title: "Pure natural products", body: "Raw honey and beeswax, handled gently so the mountain's character survives the journey." },
  { title: "Environmental conservation", body: "Bees only thrive where the forest does. Protecting Mt. Kulal's ecosystem is part of the work." },
  { title: "Community empowerment", body: "A structured, reliable market for gatherers who previously had none." },
  { title: "Transparency", body: "Open about where honey comes from, who harvested it, and what we paid." },
  { title: "Sustainability", body: "Harvesting only surplus, so colonies and the landscape keep giving." },
  { title: "Quality", body: "Careful processing, packaging standards and food safety discipline on every batch." },
  { title: "Youth employment", body: "Work and training for young people from Loiyangalani and the wider ward." },
  { title: "Responsible growth", body: "Growing at the pace the mountain, the bees and the community can carry." },
] as const;

export const TEAM = [
  {
    name: "Ledany Timothy",
    role: "Founder & Director",
    expertise: "Leadership, strategy & community beekeeping",
    bio: "Ledany's passion for beekeeping began at fifteen, on the slopes he grew up on. He founded Ntarakwai to give Mt. Kulal's honey gatherers a market worthy of their harvest, and leads the company's strategic direction, partnerships and community engagement.",
    duties: ["Overall leadership and strategy", "Partnerships and company management", "Community engagement", "Beekeeping initiatives"],
    initials: "LT",
  },
  {
    name: "Leorian Ledany",
    role: "Field & Apiary Supervisor",
    expertise: "Apiary operations & colony health",
    bio: "Leorian runs everything that happens on the mountain — where hives sit, how colonies are faring, and when a harvest is genuinely ready. He leads the field teams through inspection, harvesting and hive maintenance.",
    duties: ["Apiary operations", "Hive management and colony health", "Harvesting activities", "Field team leadership"],
    initials: "LL",
    phone: "0718 572 756",
    phoneHref: "tel:+254718572756",
  },
  {
    name: "John Lelerai",
    role: "Processing & Quality Control Officer",
    expertise: "Processing, quality assurance & food safety",
    bio: "John oversees the quiet, unglamorous work that protects the honey: settling, straining, packaging standards and food safety compliance. Nothing leaves Gatab without passing his bench.",
    duties: ["Honey processing", "Quality assurance", "Packaging standards", "Food safety compliance"],
    initials: "JL",
    phone: "0732 463 008",
    phoneHref: "tel:+254732463008",
  },
  {
    name: "Leah Susana Lemosor",
    role: "Marketing & Sales Officer",
    expertise: "Brand, customers & market growth",
    bio: "Leah carries the story of Mt. Kulal to the rest of Kenya — building the brand, winning customers and partners, and making sure the growth reaching the mountain is real and sustained.",
    duties: ["Marketing and branding", "Customer acquisition", "Partnerships", "Sales growth"],
    initials: "LS",
    phone: "0713 976 081",
    phoneHref: "tel:+254713976081",
  },
  {
    name: "Nicholas Leparie",
    role: "Monitoring & Evaluation Officer",
    expertise: "Monitoring, evaluation & data systems",
    bio: "Nicholas helps keep the work measurable and accountable, tracking progress, learning and evidence so the team can make informed decisions.",
    duties: ["Monitoring and evaluation", "Data collection and reporting", "Progress tracking", "Learning and improvement"],
    initials: "NL",
    phone: "0746 828 483",
    phoneHref: "tel:+254746828483",
  },
] as const;

export const SUPPORT_ROLES = [
  { title: "Honey Processing & Packaging Assistant", note: "Casual role supporting the processing bench in Gatab." },
  { title: "Office Cleaner", note: "Keeping the shop and workspace to food-safe standards." },
] as const;

export const JOURNEY = [
  {
    step: "01",
    title: "The forest",
    body: "Mt. Kulal's cloud forest and thorn-scrub carry a wild, unfarmed floral mix. No monoculture, no sprayed fields — the bees forage on whatever the mountain is flowering that season.",
  },
  {
    step: "02",
    title: "The hives",
    body: "Fifty-five hives across two apiaries, sited where forage and water allow colonies to build strength. New hives are colonised naturally, not forced.",
  },
  {
    step: "03",
    title: "The gatherers",
    body: "Alongside our own harvest, we buy from more than thirty independent beekeepers around Mt. Kulal — the same people who previously had nowhere reliable to sell.",
  },
  {
    step: "04",
    title: "The bench at Gatab",
    body: "Combs are handled at our honey shop in Gatab: strained, settled, checked and packed under food-safety discipline. Raw, never overheated.",
  },
  {
    step: "05",
    title: "The road",
    body: "From Marsabit County the honey travels out by courier, dispatched to customers and stockists across Kenya.",
  },
  {
    step: "06",
    title: "Your table",
    body: "A jar that carries a mountain, a forest, and the livelihoods of the people who keep both standing.",
  },
] as const;

export const AMBITIONS = [
  { title: "A recognised premium brand", body: "Build Ntarakwai into a nationally recognised premium honey brand carrying the name of Mt. Kulal." },
  { title: "More hives, more colonies", body: "Grow production steadily as more hives become colonised across the apiaries." },
  { title: "A wider gatherer network", body: "Extend structured market access and training beyond the current thirty-plus beekeepers." },
  { title: "Eco-tourism on the mountain", body: "Open Mt. Kulal to visitors who want to see conservation-driven beekeeping first-hand." },
  { title: "A centre for research", body: "Make Mt. Kulal a recognised centre for sustainable beekeeping, conservation and research." },
  { title: "Employment for local youth", body: "Turn a growing operation into steady, skilled work for young people in Loiyangalani Ward." },
] as const;
