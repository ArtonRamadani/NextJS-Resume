import {
  AcademicCapIcon,
  ArrowDownIcon,
  BuildingOffice2Icon,
  FlagIcon,
  MapIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {FC, ForwardRefExoticComponent, SVGProps} from 'react';

import GithubIcon from '../components/Icon/GithubIcon';
import InstagramIcon from '../components/Icon/InstagramIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
import TwitterIcon from '../components/Icon/TwitterIcon';
import heroImage from '../images/header-background.webp';
import profilepic from '../images/profilepic.jpg';
import testimonialImage from '../images/testimonial.webp';
import {
  About,
  ContactSection,
  ContactType,
  Hero,
  HomepageMeta,
  PortfolioItem,
  SkillGroup,
  Social,
  TestimonialSection,
  TimelineItem,
} from './dataDef';
import portfolioData from './portfolioData.json';

// ─── Icon Maps ───────────────────────────────────────────
const aboutIconMap: Record<string, ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, 'ref'>>> = {
  MapIcon,
  FlagIcon,
  SparklesIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
};

const socialIconMap: Record<string, FC<{className?: string}>> = {
  LinkedInIcon,
  GithubIcon,
  InstagramIcon,
  TwitterIcon,
};

/**
 * Page meta data
 */
export const homePageMeta: HomepageMeta = {
  title: portfolioData.meta.title,
  description: portfolioData.meta.description,
};

/**
 * Section definition
 */
export const SectionId = {
  Hero: 'hero',
  About: 'about',
  Contact: 'contact',
  Portfolio: 'portfolio',
  Resume: 'resume',
  Skills: 'skills',
  Stats: 'stats',
  Testimonials: 'testimonials',
} as const;

export type SectionId = (typeof SectionId)[keyof typeof SectionId];

/**
 * Hero section
 */
export const heroData: Hero = {
  imageSrc: heroImage,
  name: portfolioData.hero.name,
  nameColor: portfolioData.hero.nameColor || '#ffffff',
  description: (
    <div dangerouslySetInnerHTML={{__html: portfolioData.hero.descriptionHtml}} />
  ),
  actions: [
    {
      href: portfolioData.hero.buttonLink || `#${SectionId.Contact}`,
      text: portfolioData.hero.buttonText || 'Contact',
      primary: false,
      Icon: ArrowDownIcon,
    },
  ],
};

/**
 * About section
 */
export const aboutData: About = {
  profileImageSrc: portfolioData.about.profileImage || profilepic,
  description: portfolioData.about.description,
  aboutItems: portfolioData.about.aboutItems.map(item => ({
    label: item.label,
    text: item.text,
    Icon: aboutIconMap[item.icon],
  })),
};

/**
 * Skills section
 */
export const skills: SkillGroup[] = portfolioData.skills.map(group => ({
  name: group.name,
  skills: group.skills.map(s => ({name: s.name, level: s.level})),
}));

/**
 * Portfolio section
 */
export const freelancePortfolioItems: PortfolioItem[] = portfolioData.freelancePortfolio.map(item => ({
  title: item.title,
  description: item.description,
  url: item.url,
  blur: item.blur,
  background: item.background,
  image: item.image,
}));

export const portfolioItems: PortfolioItem[] = portfolioData.portfolio.map(item => ({
  title: item.title,
  description: item.description,
  url: item.url,
  blur: item.blur,
  background: item.background,
  image: item.image,
}));

/**
 * Resume section
 */
export const education: TimelineItem[] = portfolioData.education.map(item => ({
  date: item.date,
  location: item.location,
  title: item.title,
  content: <div dangerouslySetInnerHTML={{__html: item.content}} />,
}));

export const training: TimelineItem[] = portfolioData.training.map(item => ({
  date: item.date,
  location: item.location,
  title: item.title,
  content: <div dangerouslySetInnerHTML={{__html: item.content}} />,
}));

export const experience: TimelineItem[] = portfolioData.experience.map(item => ({
  date: item.date,
  location: item.location,
  title: item.title,
  content: <div dangerouslySetInnerHTML={{__html: item.content}} />,
}));

/**
 * Testimonials section
 */
export const testimonial: TestimonialSection = {
  imageSrc: testimonialImage,
  testimonials: portfolioData.testimonials.map(t => ({
    name: t.name,
    text: t.text,
    image: t.image,
  })),
};

/**
 * Contact section
 */
export const contact: ContactSection = {
  headerText: portfolioData.contact.headerText,
  description: portfolioData.contact.description,
  items: portfolioData.contact.items.map(item => ({
    type: ContactType[item.type as keyof typeof ContactType],
    text: item.text,
    href: item.href,
  })),
};

/**
 * Social items
 */
export const socialLinks: Social[] = portfolioData.socialLinks
  .filter(link => socialIconMap[link.icon])
  .map(link => ({
    label: link.label,
    Icon: socialIconMap[link.icon] as FC<{className?: string}>,
    href: link.href,
  }));
