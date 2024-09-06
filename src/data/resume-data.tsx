import {
  WHOOPLogo,
  MagsLogo,
  CipherTechLogo,
  WHOOPCoachLogo,
  PromptForgeLogo,
  SloothsLogo,
  SanzaLogo,
  CharacterAILogo,
  PhotoGalleryLogo,
} from '@/images/logos';
import { GitHubIcon, LinkedInIcon, XIcon } from '@/components/icons';

function getYearsSinceDec2017() {
  const startDate = new Date('December 1, 2017').getTime();
  const currentDate = new Date().getTime();
  const differenceInTime = currentDate - startDate;
  const differenceInYears = differenceInTime / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(differenceInYears);
}

export const RESUME_DATA = {
  name: 'Alec White',
  initials: 'AW',
  location: 'San Francisco, PST',
  locationLink: 'https://www.google.com/maps/place/SanFrancisco',
  about: 'Software Engineer, Full Stack & GenAI Application Layer',
  summary: `As a Full Stack Engineer, I have successfully taken multiple products from 0 to 1. I lead projects effectively, ensuring an environment where people can do their best work and we solve the most impactful problems. Currently, I work mostly with Python, React, Postgres, and LLMs on generative AI application layer features. I have over ${getYearsSinceDec2017()} years of experience and am looking to work on a greater scale.`,
  avatarUrl: 'https://avatars.githubusercontent.com/u/5921175?v=4',
  personalWebsiteUrl: 'https://0xffffff.codes',
  blogLink: 'https://blog.0xffffff.codes',
  contact: {
    email: 'alec@0xffffff.codes',
    tel: '14159630614',
    resume: 'https://resume-alecw.s3.amazonaws.com/Alec_White_Resume_2024.pdf',
    social: [
      {
        name: 'GitHub',
        url: 'https://github.com/alec0xffffff',
        icon: GitHubIcon,
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/alec0xffffff/',
        icon: LinkedInIcon,
      },
      {
        name: 'X',
        url: 'https://x.com/alec0xffffff',
        icon: XIcon,
      },
    ],
  },
  education: [
    {
      school: 'Wake Forest University',
      degree:
        "Bachelor's Degree in Computer Science with a minor in Entrepreneurship & Social Enterprise",
      start: '2013',
      end: '2017',
    },
  ],
  work: [
    {
      company: 'Character.AI',
      link: 'https://character.ai',
      badges: ['SF'],
      title: 'Member of the Technical Staff',
      logo: CharacterAILogo,
      start: '2024',
      end: 'current',
      description: 'Working on the Character.AI platform',
    },
    {
      company: 'WHOOP',
      link: 'https://whoop.com',
      badges: ['Boston, MA'],
      title: 'Software Engineer II',
      logo: WHOOPLogo,
      start: '2021',
      end: '2024',
      description:
        'Implemented new features, planned and designed WHOOP Coach Generative AI chat. Worked on Growth and Monetization working on full stack subscription management features. Technologies: Java, LLMs, Node, Python, React, TypeScript, Redis, REST APIs, Postgres, Stripe, Avalara, Shopify',
    },
    {
      company: 'Cipher Tech Solutions',
      link: 'https://ciphertechsolutions.com',
      badges: ['Washington, D.C.'],
      title: 'Forensic Software Developer',
      logo: CipherTechLogo,
      start: '2017',
      end: '2021',
      description:
        'Developed deadbox digital forensic software tools. Technologies: Python, Go, React, React Native',
    },
  ],
  skills: [
    'Java',
    'Python',
    'Go',
    'JavaScript',
    'TypeScript',
    'React/Next.js',
    'Remix',
    'Node.js',
    'Postgres',
    'SQL Server',
    'Redis',
    'Tailwind',
    'Prompt Engineering',
  ],
  projects: [
    {
      title: 'WHOOP Coach',
      techStack: ['Java', 'LLMs', 'Redis'],
      description:
        'The first AI powered fitness wearable coach for health and performance',
      logo: WHOOPCoachLogo,
      link: {
        label: 'WHOOP Coach blog post',
        href: 'https://www.whoop.com/us/en/thelocker/introducing-whoop-coach-powered-by-openai/',
      },
    },
    {
      title: 'Photo Gallery',
      techStack: ['Next.js', 'Tailwind CSS', 'React', 'Gemini', 'Pinecone'],
      description:
        'A film photo gallery that judges my frames and has a smart search indexing images as they are uploaded.',
      logo: PhotoGalleryLogo,
      link: {
        label: 'Photo Gallery',
        href: 'https://0xffffff.codes/photo-gallery',
      },
    },
    {
      title: 'Mags Hot Sauce',
      techStack: ['Side Project', 'Shopify'],
      description: 'Craft Hot Sauce brand sold online and in retail in SF.',
      logo: MagsLogo,
      link: {
        label: 'mags.lol',
        href: 'https://mags.lol/',
      },
    },
    {
      title: 'Sanza',
      techStack: [
        'Side Project',
        'iOS',
        'LLMs',
        'Python',
        'Remix',
        'React Native',
        'Expo',
        'Node.js',
        'PostgreSQL',
        'Stytch',
      ],
      logo: SanzaLogo,
      link: {
        label: 'Sanza',
        href: 'https://sanza.cooking/',
      },
      description: 'Modify recipes to fit your dietary restrictions',
    },
    {
      title: 'Prompt Forge',
      techStack: ['Side Project', 'LLMs', 'Remix'],
      logo: PromptForgeLogo,
      link: {
        label: 'prompt forge',
        href: 'https://promptforge.studio/',
      },
      description: 'Platform to evaluate LLM Prompts',
    },
    {
      title: 'Slooths Party',
      techStack: ['Side Project', 'LLMs', 'Remix'],
      logo: SloothsLogo,
      link: {
        label: 'slooths party',
        href: 'https://slooths.party/',
      },
      description: 'Murder mystery game generator using LLMs',
    },
    {
      title: 'Drawtf',
      techStack: ['Side Project', 'React', 'Python', 'Deprecated'],
      description: 'Remote Telestrations with gif generation from the results',
    },
    {
      title: 'Maze or Bowie',
      techStack: ['Side Project', 'React'],
      description: 'Guess that Phish song!',
      link: {
        label: 'mazeorbowie.com',
        href: 'https://mazeorbowie.com/',
      },
    },
    {
      title: 'Tribal Council',
      techStack: ['Side Project', 'React', 'Python'],
      description: 'NFL Survivor Pool Pick Ranker',
    },
    {
      title: 'Party GIF',
      techStack: ['Side Project', 'Python'],
      description: 'Turn any image into a party gif',
    },
  ],
} as const;
