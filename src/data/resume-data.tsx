import {
  WHOOPLogo,
  MagsLogo,
  CipherTechLogo,
  WHOOPCoachLogo,
  PromptForgeLogo,
  SloothsLogo
} from "@/images/logos";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

export const RESUME_DATA = {
  name: "Alec White",
  initials: "AW",
  location: "San Francisco, PST",
  locationLink: "https://www.google.com/maps/place/SanFrancisco",
  about:
    "Software Engineer, Full Stack & GenAI Application Layer",
  summary:
    "As a Full Stack Engineer, I have successfully taken multiple products from 0 to 1. I lead projects effectively, ensuring an environment where people can do their best work and we solve the most impactful problems. Currently, I work mostly with Java, Postgres, and LLMs on generative AI application layer features. I have over 6 years of experience and am looking to work on a greater scale.",
  avatarUrl: "https://avatars.githubusercontent.com/u/5921175?v=4",
  personalWebsiteUrl: "https://0xffffff.codes",
  blogLink: "https://blog.0xffffff.codes",
  contact: {
    email: "alec@0xffffff.codes",
    tel: "14159630614",
    resume: "https://resume-alecw.s3.amazonaws.com/Alec_White_Resume_2024.pdf",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/alec0xffffff",
        icon: GitHubIcon,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/alec0xffffff/",
        icon: LinkedInIcon,
      },
      {
        name: "X",
        url: "https://x.com/alec0xffffff",
        icon: XIcon,
      },
    ],
  },
  education: [
    {
      school: "Wake Forest University",
      degree: "Bachelor's Degree in Computer Science with a minor in Entrepreneurship & Social Enterprise",
      start: "2013",
      end: "2017",
    },
  ],
  work: [
    {
      company: "WHOOP",
      link: "https://whoop.com",
      badges: ["Boston, MA"],
      title: "Software Engineer II",
      logo: WHOOPLogo,
      start: "2021",
      end: "current",
      description:
        "Implemented new features, planned and designed WHOOP Coach Generative AI chat. Worked on Growth and Monetization working on full stack subscription management features. Technologies: Java, LLMs, Node, Python, React, TypeScript, Redis, REST APIs, Postgres, Stripe, Avalara, Shopify",
    },
    {
      company: "Cipher Tech Solutions",
      link: "https://ciphertechsolutions.com",
      badges: ["Washington, D.C."],
      title: "Forensic Software Developer",
      logo: CipherTechLogo,
      start: "2017",
      end: "2021",
      description:
        "Developed deadbox digital forensic software tools. Technologies: Python, Go, React, React Native",
    },
  ],
  skills: [
    "Java",
    "Python",
    "Go",
    "JavaScript",
    "TypeScript",
    "React/Next.js",
    "Remix",
    "Node.js",
    "Postgres",
    "SQL Server",
    "Redis"
  ],
  projects: [
    {
      title: "WHOOP Coach",
      techStack: [
        "Java", "LLMs", "Redis",
      ],
      description: "A platform to build and grow your online business",
      logo: WHOOPCoachLogo,
      link: {
        label: "WHOOP Coach blog post",
        href: "https://www.whoop.com/us/en/thelocker/introducing-whoop-coach-powered-by-openai/",
      },
    },
    {
      title: "Mags Hot Sauce",
      techStack: ["Side Project", "Shopify"],
      description:
        "Craft Hot Sauce brand sold online and in retail in SF.",
      logo: MagsLogo,
      link: {
        label: "mags.lol",
        href: "https://mags.lol/",
      },
    },
    {
      title: "Prompt Forge",
      techStack: [
        "Side Project", "LLMs", "Remix"
      ],
      logo: PromptForgeLogo,
      link: {
        label: "prompt forge",
        href: "https://promptforge.studio/",
      },
      description: "Platform to evaluate LLM Prompts",
    },
    {
      title: "Slooths Party",
      techStack: [
        "Side Project", "LLMs", "Remix"
      ],
      logo: SloothsLogo,
      link: {
        label: "slooths party",
        href: "https://slooths.party/",
      },
      description: "Murder mystery game generator using LLMs",
    },
    {
      title: "Sous.AI",
      techStack: [
        "Side Project", "iOS", "LLMs", "Python"
      ],
      description: "A platform to talk through recipes via LLM",
    },
    {
      title: "Drawtf",
      techStack: ["Side Project", "React", "Python", "Deprecated"],
      description:
        "Remote Telestrations with gif generation from the results",
    },
    {
      title: "Maze or Bowie",
      techStack: ["Side Project", "React"],
      description:
        "Guess that Phish song!",
      link: {
        label: "mazeorbowie.com",
        href: "https://mazeorbowie.com/",
      },
    },
    {
      title: "Tribal Council",
      techStack: ["Side Project", "React", "Python"],
      description:
        "NFL Survivor Pool Pick Ranker",
    },
    {
      title: "Party GIF",
      techStack: ["Side Project", "Python"],
      description:
        "Turn any image into a party gif",
    },
  ],
} as const;
