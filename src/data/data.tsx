import {
  AcademicCapIcon,
  ArrowDownTrayIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  FlagIcon,
  MapIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

import GithubIcon from '../components/Icon/GithubIcon';
import InstagramIcon from '../components/Icon/InstagramIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
// import StackOverflowIcon from '../components/Icon/StackOverflowIcon';
// import TwitterIcon from '../components/Icon/TwitterIcon';
import heroImage from '../images/header-background.webp';
// import porfolioImage7 from '../images/portfolio/portfolio-7.jpg';
// import porfolioImage8 from '../images/portfolio/portfolio-8.jpg';
// import porfolioImage9 from '../images/portfolio/portfolio-9.jpg';
// import porfolioImage10 from '../images/portfolio/portfolio-10.jpg';
// import porfolioImage11 from '../images/portfolio/portfolio-11.jpg';
import eSim from '../images/portfolio/esim.jpg';
import porfolioImage4 from '../images/portfolio/furnishHomeKS.jpg';
import porfolioImage1 from '../images/portfolio/m-technologie.png';
// import porfolioImage2 from '../images/portfolio/portfolio-2.jpg';
import porfolioImage3 from '../images/portfolio/portfolio-3.jpg';
import porfolioImage5 from '../images/portfolio/shqip-fit.svg';
import porfolioImage6 from '../images/portfolio/termini_beauty-logo.webp';
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

/**
 * Page meta data
 */
export const homePageMeta: HomepageMeta = {
  title: "Artons' Portfolio",
  description: "Artons' Portfolio",
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
  name: `I'm Arton Ramadani.`,
  description: (
    <>
      <p className="prose-sm text-stone-200 sm:prose-base lg:prose-lg">
        I'm a <strong className="text-stone-100">Full Stack Software Engineer</strong>, currently working at{' '}
        <strong className="text-stone-100">Harrisia</strong> helping build a modern, mobile-first, pixel perfect web
        app's.
      </p>
      <p className="prose-sm text-stone-200 sm:prose-base lg:prose-lg">
        In my free time time, you can catch me either training at the <strong className="text-stone-100">Gym</strong>,
        <strong className="text-stone-100"> Coding</strong> or{' '}
        <strong className="text-stone-100">Reading a book</strong>.
      </p>
    </>
  ),
  actions: [
    {
      href: '/assets/resume.pdf',
      text: 'Resume',
      primary: true,
      Icon: ArrowDownTrayIcon,
    },
    {
      href: `#${SectionId.Contact}`,
      text: 'Contact',
      primary: false,
    },
  ],
};

/**
 * About section
 */
const currentDate = new Date();
const birthDate = new Date('1999-09-25');
const age = currentDate?.getFullYear() - birthDate?.getFullYear();

export const aboutData: About = {
  profileImageSrc: profilepic,
  description: `Use this bio section as your way of describing yourself and saying what you do, what technologies you like
  to use or feel most comfortable with, describing your personality, or whatever else you feel like throwing
  in.`,
  aboutItems: [
    {label: 'Location', text: 'Kosova, XK', Icon: MapIcon},
    {label: 'Age', text: `${age}`, Icon: CalendarIcon},
    {label: 'Nationality', text: 'Albanian', Icon: FlagIcon},
    {label: 'Interests', text: 'Fitness, Nature, Culture', Icon: SparklesIcon},
    {label: 'Study', text: 'University for Business and Technology', Icon: AcademicCapIcon},
    {label: 'Employment', text: 'Harrisia', Icon: BuildingOffice2Icon},
  ],
};

/**
 * Skills section
 */
export const skills: SkillGroup[] = [
  {
    name: 'Spoken languages',
    skills: [
      {
        name: 'Albanian',
        level: 10,
      },
      {
        name: 'English',
        level: 9,
      },
    ],
  },
  {
    name: 'Frontend development',
    skills: [
      {
        name: 'React.JS',
        level: 9,
      },
      {
        name: 'Typescript',
        level: 7,
      },
      {
        name: 'Angular',
        level: 6,
      },
    ],
  },
  {
    name: 'Backend development',
    skills: [
      {
        name: 'Node.js',
        level: 10,
      },
      {
        name: 'PHP',
        level: 6,
      },
      {
        name: 'Java',
        level: 3,
      },
    ],
  },
  {
    name: 'Mobile development',
    skills: [
      {
        name: 'React Native',
        level: 5,
      },
      // {
      //   name: 'Flutter',
      //   level: 4,
      // },
      // {
      //   name: 'Swift',
      //   level: 3,
      // },
    ],
  },
];

/**
 * Portfolio section
 */
export const freelancePortfolioItems: PortfolioItem[] = [
  {
    title: 'm-technologie',
    // description: "Built a highly performant website for Coca-Cola, enabling users to submit their required information. By employing Node.js as the server and MySQL as the database, I implemented specific schedulers to randomly select winners for various prizes.",
    description:
      "I'm delighted to present my latest project, a dynamic web application crafted with React.js and Node.js, backed by a robust MySQL database. This multifaceted system boasts an intuitive admin panel for seamless content management and a client module for an engaging user experience. Leveraging the power of React, the frontend delivers a responsive and modern interface, while Node.js handles the backend operations efficiently. The integration with MySQL ensures data integrity and scalability. This project not only showcases my technical proficiency in full-stack development but also emphasizes my commitment to creating user-centric solutions. Explore the admin controls and client features to witness the seamless synergy of technology in action.",
    url: 'https://www.m-technologie.com/',
    blur: false,
    image: porfolioImage1,
  },
  {
    title: 'E-Sim Reseller Website',
    description:
      "In my latest venture, I've developed an innovative eSIM reseller platform using React.js, Node.js, and MySQL. This dynamic system leverages the power of APIs to seamlessly integrate with external services, enabling the retrieval of real-time data for eSIMs. The utilization of React ensures a modern and responsive user interface, while the backend, powered by Node.js, efficiently manages the integration with various APIs, creating a streamlined experience for both resellers and end-users. The MySQL database plays a pivotal role in storing and managing eSIM-related information, ensuring data security and reliability. This project not only demonstrates my technical prowess in React and Node.js but also underscores my ability to create solutions that bridge the digital gap in the rapidly evolving telecommunications landscape.",
    url: '',
    blur: false,
    image: porfolioImage3,
  },
  {
    title: 'FurnishHome-KS',
    description:
      "Revolutionizing the sales approach for a local furniture company, I developed a dynamic digital solution using WordPress. This transformative platform not only showcases the exquisite craftsmanship of the furniture but also enhances the entire sales process. Through strategic customization and integration, the website seamlessly blends aesthetic appeal with functional efficiency. Customers can now explore the diverse furniture collection, accompanied by detailed descriptions and high-quality visuals. The WordPress architecture ensures easy content management, empowering the client to update product listings and engage with the audience effortlessly. By digitizing the sales experience, this project not only elevates the company's online presence but also brings the artistry of furniture craftsmanship to a broader digital audience.",
    url: '',
    blur: false,
    image: porfolioImage4,
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    title: 'Project of Harrisia',
    description: '',
    url: '',
    blur: false,
    image:
      'https://assets-global.website-files.com/63f6e52346a353ca1752970e/6440bf1a03c90188594c39e7_study-cover-cocacola.jpeg',
  },
  {
    title: 'Project of Harrisia',
    description: '',
    url: '',
    blur: false,
    image: 'https://yuuniq.com/assets/Layer_1.png',
  },
  {
    title: 'Project of Harrisia',
    description: '',
    url: '',
    blur: false,
    image: 'https://www.raportodiskriminimin.org/static/media/Logoshqip.f4d0133c.png',
  },
  {
    title: 'Project of Harrisia',
    description: '',
    url: '',
    blur: false,
    image: porfolioImage5,
  },
  {
    title: 'Project of Harrisia',
    description: '',
    url: '',
    blur: false,
    image: 'https://ihmk-rks.net/inc/images/IHMK.png',
  },
  {
    title: 'Project of Harrisia',
    description: '',
    url: '',
    blur: false,
    image: porfolioImage6,
  },
  // {
  //   title: 'termini.beauty - Harrisia',
  //   description: 'Give a short description of your project here.',
  //   url: '',
  //   blur: false,
  //   image: porfolioImage4,
  // },
  // {
  //   title: 'Project title 6',
  //   description: 'Give a short description of your project here.',
  //   url: 'https://reactresume.com',
  //   image: porfolioImage6,
  // },
  // {
  //   title: 'Project title 7',
  //   description: 'Give a short description of your project here.',
  //   url: 'https://reactresume.com',
  //   image: porfolioImage7,
  // },
  // {
  //   title: 'Project title 8',
  //   description: 'Give a short description of your project here.',
  //   url: 'https://reactresume.com',
  //   image: porfolioImage8,
  // },
  // {
  //   title: 'Project title 9',
  //   description: 'Give a short description of your project here.',
  //   url: 'https://reactresume.com',
  //   image: porfolioImage9,
  // },
  // {
  //   title: 'Project title 10',
  //   description: 'Give a short description of your project here.',
  //   url: 'https://reactresume.com',
  //   image: porfolioImage10,
  // },
  // {
  //   title: 'Project title 11',
  //   description: 'Give a short description of your project here.',
  //   url: 'https://reactresume.com',
  //   image: porfolioImage11,
  // },
];

/**
 * Resume section -- TODO: Standardize resume contact format or offer MDX
 */
export const education: TimelineItem[] = [
  {
    date: 'December 2023',
    location: 'University for Business and Technology',
    title: 'Bachelor in Computer Science and Technology',
    content: (
      <p>
        Computer science is a dynamic and rapidly growing area that has become an integral part of the world that we
        live in today. Having a degree in this field will provide you with a deep understanding of theories and emerging
        technologies. This knowledge and experience allowed me to develop cutting-edge solutions that address today’s
        challenges. During my studies, I have gained the necessary knowledge to become a successful Developer and
        Engineer in order to succeed in today's market need. I am forever grateful to the Professors and my Family for
        supporting me along this journey!
      </p>
    ),
  },
  {
    date: 'September 2014',
    location: 'Naim Frashëri High School - Shtime',
    title: 'Gymnasium of Natural Science',
    content: (
      <p>
        During my High School studies, I have gained general knowledge over different subjects, but math was my favorite
        since I already knew that I was going to study CSE. I had given my best and successfully gained different
        certificates and letters of recognition for different activities that I held at my school. I am grateful for the
        teachers that empowered and inspired me to go on with my dream!
      </p>
    ),
  },
];
export const training: TimelineItem[] = [
  {
    date: 'September 2021 ',
    location: 'American University of Kosova (AUK)',
    title: 'Cybersecurity',
    content: (
      <p>
        Certified by the American university of Kosova (AUK) for successfully finishing the CISCO Trainings:
        Introduction to Cybersecurity – 29 October 2021. Cybersecurity Essentials – February 2022
      </p>
    ),
  },
  {
    date: 'October 2018 - December 2019',
    location: 'American University of Kosova (AUK)',
    title: 'Youth Career IT Pathway',
    content: (
      <p>
        During my High School studies, I have gained general knowledge over different subjects, but math was my favorite
        since I already knew that I was going to study CSE. I had given my best and successfully gained different
        certificates and letters of recognition for different activities that I held at my school. I am grateful for the
        teachers that empowered and inspired me to go on with my dream!
      </p>
    ),
  },
  {
    date: 'September 2017 ',
    location: 'American School of Kosova (ASK)',
    title: 'College Prep. Club',
    content: <p>{/*  */}</p>,
  },
  {
    date: 'September 2017 ',
    location: 'Konrad-Adenaure-Stifung',
    title: 'The role of youth in modern campaignin',
    content: <p>{/*  */}</p>,
  },
];

export const experience: TimelineItem[] = [
  {
    date: 'February 2022 - Present',
    location: 'Harrisia',
    title: 'Full Stack Software Engineer',
    content: (
      <ol>
        <li> Comprehensive knowledge of React.js framework and core principles</li>
        <li>Develop the Architecture of React.js and Node.js applications</li>
        <li>Manage teams and finalize entire applications within the deadlines</li>
        <li>
          Code using JavaScript, TypeScript, HTML, CSS, SASS, Bootstrap, React MUI, and other front-end frameworks
        </li>
        <li>Develop React JS components in Javascript and TypeScript, REDUX, etc.</li>
        <li>
          Develop Node JS applications using Express, Sequlize, nodemailer, dotenv, jwt-encode/decode, bycrypt, etc.
        </li>
        <li>User interface design and development</li>
        <li>Restful API development</li>
        <li>Continuous testing and integration of builds and releases</li>
        <li>Write maintainable code</li>
        <li>Responsible for managing the development of projects</li>
        <li>Reverse engineer projects written in languages other than JavaScript (Java, PostgreSQL, Maven)</li>
        <li>Develop databases using MySQL and SQL</li>
      </ol>
    ),
  },
  {
    date: 'January 2023 - June 2023',
    location: 'Harrisia',
    title: 'FRONT-END AND REACT JS TRAINER',
    content: (
      <p>
        Led a comprehensive 6-week intensive training program for 30 students that covered front-end technologies such
        as HTML, CSS, and JavaScript. I worked as Professor Egzon Peci's assistant during this program, supporting and
        lecturing with the main teacher.
        <br />
        <br />
        Led a comprehensive 12-week React JS training course for 30 students. As the React JS lecturer, I covered both
        the fundamental ideas and the more complex details of React JS. I also covered important topics like the Virtual
        DOM, the distinctions between class and functional components, the use of hooks, the implementation of React
        Router, how to handle props effectively, advanced state management with Redux, API integration, styling
        techniques, testing with Jest Library, the complexities of deploying React applications, and advanced React
        Topics to open the horizon to other the participants as to what they can do using React JS as a developing
        technology.
      </p>
    ),
  },
  {
    date: 'Ongoing',
    location: 'Remote',
    title: 'FREELANCER',
    content: (
      <p>
        Successfully delivered a comprehensive freelance project for{' '}
        <strong className="text-black-100">m-technologie</strong>, centered on developing a dynamic web application.
        Leveraging React.js for the front end, Node.js for server-side logic, and MySQL for database management, the
        project aimed to optimize and enhance user interaction with the provided services.
      </p>
    ),
  },
  {
    date: 'January 2021 - November 2021',
    location: 'KAPAKU WEB',
    title: 'FRONT END DEVELOPER',
    content: (
      <p>
        {/* Successfully delivered a comprehensive freelance project for <strong className="text-black-100">m-technologie</strong>, centered on developing a
        dynamic web application. Leveraging React.js for the front end, Node.js for server-side logic, and MySQL for
        database management, the project aimed to optimize and enhance user interaction with the provided services. */}
      </p>
    ),
  },
];

/**
 * Testimonial section
 */
export const testimonial: TestimonialSection = {
  imageSrc: testimonialImage,
  testimonials: [
    {
      name: 'm-technologie',
      text: 'Working with you has been a breath of fresh air – cool, easy, and incredibly rewarding. Your open communication, flexibility, and dedication to excellence have made this experience not only successful but enjoyable.',
      image: 'https://admin.m-technologie.com/static/media/Screenshot%202023-09-11.5184fe21459bb43b8063.png',
    },
    {
      name: 'e-sim',
      text: "Not only did you meet all of my expectations, but you also exceeded them with your innovative solutions and timely delivery. It's rare to find someone who not only understands the client's needs but goes above and beyond to ensure those needs are not only met but surpassed.",
      image: eSim,
    },
    // {
    //   name: 'Someone else',
    //   text: 'Add several of these, and keep them as fresh as possible, but be sure to focus on quality testimonials with strong highlights of your skills/work ethic.',
    //   image: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/69.jpg',
    // },
  ],
};

/**
 * Contact section
 */

export const contact: ContactSection = {
  headerText: 'Get in touch.',
  description:
    "Let's Connect and Create Something Amazing Together! Drop me a message below, and let's turn your ideas into reality. I'm here to make the process smooth and enjoyable. Looking forward to hearing from you!",
  items: [
    {
      type: ContactType.Email,
      text: 'artonramadani25@gmail.com',
      href: 'mailto:artonramadani25@gmail.com',
    },
    {
      type: ContactType.Location,
      text: 'Prishtinë, Kosova',
      href: 'https://www.google.ca/maps/place/Victoria,+BC/@48.4262362,-123.376775,14z',
    },
    {
      type: ContactType.Instagram,
      text: '@artonramadani1',
      href: 'https://www.instagram.com/artonramadani1/',
    },
    {
      type: ContactType.Github,
      text: 'ArtonRamadani',
      href: 'https://github.com/ArtonRamadani',
    },
  ],
};

/**
 * Social items
 */
export const socialLinks: Social[] = [
  {label: 'LinkedIn', Icon: LinkedInIcon, href: 'https://www.linkedin.com/in/arton-ramadani-08790a172/'},
  {label: 'Github', Icon: GithubIcon, href: 'https://github.com/ArtonRamadani'},
  // { label: 'Stack Overflow', Icon: StackOverflowIcon, href: 'https://stackoverflow.com/users/' },
  {label: 'Instagram', Icon: InstagramIcon, href: 'https://www.instagram.com/artonramadani1/'},
  // { label: 'Twitter', Icon: TwitterIcon, href: 'https://twitter.com/artonramadani1' },
];
