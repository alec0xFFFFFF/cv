import {
  WHOOPLogo,
  MagsLogo,
  CipherTechLogo,
  WHOOPCoachLogo
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
    "As a Full Stack Engineer, I have successfully taken multiple products from 0 to 1. I lead teams effectively, ensuring an environment where people can do their best work. Currently, I work mostly with TypeScript, React, Node.js, and GraphQL. I have over 8 years of experience in working remotely with companies all around the world.",
  avatarUrl: "https://avatars.githubusercontent.com/u/5921175?v=4",
  personalWebsiteUrl: "https://0xffffff.codes",
  contact: {
    email: "alec@0xffffff.codes",
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
        "Implemented new features, led squad, worked on improving the way developers ship the code, started migration from Emotion to Tailwind CSS and more. Technologies: React, TypeScript, GraphQL",
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
        "Created Android mobile apps and led teams for companies like Vision Media, DKMS, or AAA. Built live streaming application for Evercast from scratch. Technologies: Android, Kotlin, React, TypeScript, GraphQL",
    },
  ],
  skills: [
    "Java",
    "Python",
    "Go",
    "JavaScript",
    "TypeScript",
    "React/Next.js",
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
      title: "Sous.AI",
      techStack: [
        "Side Project", "iOS", "LLMs", "Python"
      ],
      description: "A platform to talk through recipes via LLM",
    },
    {
      title: "Murder Mystery Generator",
      techStack: [
        "Side Project", "LLMs", "Python"
      ],
      description: "Murder mystery game generator using LLMs",
    },
    {
      title: "Drawtf",
      techStack: ["Side Project", "React", "Python", "Deprecated"],
      description:
        "Online Telestrations",
      link: {
        label: "github.com",
        href: "https://jarocki.me/",
      },
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
