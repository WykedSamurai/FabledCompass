export type FireRoom = {
  slug: string;
  name: string;
  description: string;
  travelers: number;
  keeperPresent: boolean;
  mentorPresent: boolean;
  welcome: string;
  prompt: string;
  activeTopics: string[];
  travelerVoices: { name: string; role: string; message: string }[];
};

export const fires: FireRoom[] = [
  {
    slug: "great-hall",
    name: "Great Hall",
    description: "Daily guild chatter, introductions, and cross-path support.",
    travelers: 34,
    keeperPresent: true,
    mentorPresent: true,
    welcome: "The Great Hall is the shared hearth of the realm, where Travelers introduce themselves, trade lessons, and ask for direction.",
    prompt: "What is one win from your journey this week, no matter how small?",
    activeTopics: ["Introductions", "Weekly wins", "Career crossroads"],
    travelerVoices: [
      { name: "Lena", role: "Traveler", message: "I rewrote my resume summary and finally feel like it sounds like me." },
      { name: "Keeper Rowan", role: "Keeper", message: "When you ask for guidance, include the evidence you already have. It helps others guide you well." },
      { name: "Mentor Ash", role: "Mentor", message: "Your next role rarely appears fully formed. Often you build toward it one proof point at a time." }
    ]
  },
  {
    slug: "hr-fire",
    name: "HR Fire",
    description: "Hiring rituals, interview prep, and workplace policy navigation.",
    travelers: 22,
    keeperPresent: true,
    mentorPresent: false,
    welcome: "A focused fire for interview etiquette, workplace expectations, and people-ops wisdom.",
    prompt: "What interview question always catches you off guard?",
    activeTopics: ["Interview rituals", "Offer questions", "Policy language"],
    travelerVoices: [
      { name: "Mara", role: "Traveler", message: "I want help answering the 'tell me about yourself' question without sounding scripted." },
      { name: "Keeper Vale", role: "Keeper", message: "Strong answers sound grounded in evidence, not rehearsed perfection." }
    ]
  },
  {
    slug: "technology-fire",
    name: "Technology Fire",
    description: "Tech careers, portfolio builds, and practical implementation tips.",
    travelers: 29,
    keeperPresent: false,
    mentorPresent: true,
    welcome: "Trade implementation notes, portfolio advice, and technical career strategy with other builders.",
    prompt: "What are you building right now that proves your skills better than a claim on a resume?",
    activeTopics: ["Portfolio projects", "Role transitions", "Implementation advice"],
    travelerVoices: [
      { name: "Jules", role: "Traveler", message: "I have projects, but I need help explaining what they demonstrate." },
      { name: "Mentor Quill", role: "Mentor", message: "Show decisions, tradeoffs, and outcomes. That is often more powerful than the code alone." }
    ]
  },
  {
    slug: "hospitality-fire",
    name: "Hospitality Fire",
    description: "Service leadership, guest recovery, and frontline growth stories.",
    travelers: 18,
    keeperPresent: true,
    mentorPresent: false,
    welcome: "A gathering place for service-minded Travelers working on poise, recovery, and high-pressure professionalism.",
    prompt: "What is the hardest guest-facing moment you have handled well?",
    activeTopics: ["Guest recovery", "Frontline leadership", "Pressure moments"],
    travelerVoices: [
      { name: "Tessa", role: "Traveler", message: "I stayed calm through a complaint, but I am not sure how to describe it as leadership evidence." },
      { name: "Keeper Holt", role: "Keeper", message: "If you protected trust, solved the issue, and stabilized the moment, that is leadership." }
    ]
  },
  {
    slug: "education-fire",
    name: "Education Fire",
    description: "Learning pathways, certification planning, and training strategy.",
    travelers: 16,
    keeperPresent: false,
    mentorPresent: true,
    welcome: "Map learning paths, compare certifications, and turn study effort into visible growth signals.",
    prompt: "What skill are you actively studying, and how will you prove it?",
    activeTopics: ["Learning plans", "Certifications", "Study accountability"],
    travelerVoices: [
      { name: "Nico", role: "Traveler", message: "I keep taking courses but never turn them into portfolio evidence." },
      { name: "Mentor Sable", role: "Mentor", message: "Complete one applied artifact per course. Learning becomes real when it leaves the notebook." }
    ]
  },
  {
    slug: "career-changers",
    name: "Career Changers",
    description: "Role pivots, transferable skills, and transition support.",
    travelers: 27,
    keeperPresent: true,
    mentorPresent: true,
    welcome: "A fire for Travelers crossing from one path to another and learning how to translate past proof into future fit.",
    prompt: "Which past skill do you think recruiters undervalue in your current story?",
    activeTopics: ["Transferable skills", "Pivots", "Story reframing"],
    travelerVoices: [
      { name: "Owen", role: "Traveler", message: "I have years of experience, but it feels invisible because it was in another field." },
      { name: "Keeper Rowan", role: "Keeper", message: "Experience is not lost because the title changed. Translate the proof, not the label." },
      { name: "Mentor Ash", role: "Mentor", message: "Transitions work best when you anchor them in outcomes, not just intent." }
    ]
  },
  {
    slug: "student-commons",
    name: "Student Commons",
    description: "Early-career guidance, internships, and starter portfolio help.",
    travelers: 20,
    keeperPresent: false,
    mentorPresent: true,
    welcome: "A lighter fire for early-path Travelers building their first proofs, stories, and professional habits.",
    prompt: "What is the first real proof you want on your Chronicle?",
    activeTopics: ["First portfolio pieces", "Internships", "Starter evidence"],
    travelerVoices: [
      { name: "Iris", role: "Traveler", message: "I do not have work experience yet, so I am trying to figure out what counts." },
      { name: "Mentor Quill", role: "Mentor", message: "Projects, reflections, volunteer work, and roleplay outcomes all count when they show growth." }
    ]
  },
  {
    slug: "mentor-pavilion",
    name: "Mentor Pavilion",
    description: "High-signal coaching office hours and evidence-first feedback.",
    travelers: 12,
    keeperPresent: true,
    mentorPresent: true,
    welcome: "A quieter pavilion where Travelers seek focused guidance from Keepers and Mentors.",
    prompt: "What is the one question that would help you move forward today?",
    activeTopics: ["Career guidance", "Evidence review", "Next-step coaching"],
    travelerVoices: [
      { name: "Samir", role: "Traveler", message: "I want to know whether my next best move is more proof, more networking, or more applications." },
      { name: "Mentor Ash", role: "Mentor", message: "When in doubt, strengthen the proof that makes your next application easier to believe." }
    ]
  }
];

export const commonsPrinciples = [
  "Be respectful.",
  "Share knowledge freely.",
  "Support evidence-based advice.",
  "Help Travelers grow.",
  "Leave the Commons better than you found it."
];

export const commonsComingLater = [
  "Live text chat",
  "Temporary Campfires",
  "Guild Halls",
  "Mentor Q&A",
  "Library summaries"
];

export function getFire(slug: string) {
  return fires.find((fire) => fire.slug === slug);
}
