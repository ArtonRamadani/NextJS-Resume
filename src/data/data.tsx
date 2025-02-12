import {
  AcademicCapIcon,
  ArrowDownIcon,
  // ArrowDownTrayIcon,
  BuildingOffice2Icon,
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
// import eSim from '../images/portfolio/esim.jpg';
import porfolioImage4 from '../images/portfolio/furnishHomeKS.jpg';
import porfolioImage8 from '../images/portfolio/hiveLogo.png';
import porfolioImage1 from '../images/portfolio/m-technologie.png';
// import porfolioImage2 from '../images/portfolio/portfolio-2.jpg';
import porfolioImage3 from '../images/portfolio/portfolio-3.png';
import porfolioImage5 from '../images/portfolio/shqip-fit.svg';
import porfolioImage6 from '../images/portfolio/termini_beauty-logo.webp';
import porfolioImage7 from '../images/portfolio/yuuniq.png';
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
        A <strong className="text-stone-100"> Software Engineer</strong>, currently working at{' '}
        <strong className="text-stone-100">Harrisia</strong> helping build modern, mobile-first, pixel perfect web
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
    // {
    //   href: '/assets/resume.pdf',
    //   text: 'Resume',
    //   primary: true,
    //   Icon: ArrowDownTrayIcon,
    // },
    {
      href: `#${SectionId.Contact}`,
      text: 'Contact',
      primary: false,
      Icon: ArrowDownIcon,
    },
  ],
};

/**
 * About section
 */
// const currentDate = new Date();
// const birthDate = new Date('1999-09-25');
// const age = currentDate?.getFullYear() - birthDate?.getFullYear();

export const aboutData: About = {
  profileImageSrc: profilepic,
  description: `I'm a dedicated software engineer with a strong affinity for back-end technologies such as Node.js, MySQL, MSSQL and MongoDB.
Equally passionate about front-end development, I take pride in crafting compelling user interfaces and seamless user
experiences with many of my work being showcased on my website. Beyond development, I lead teams, manage
projects, and oversee DevOps, security, and GitLab server management I am also deeply engaged in Linux, networking,
and different types of emerging technologies, fostering a holistic approach to software engineering and leading as a
team. With a commitment to continuous improvement, I strive to bridge the gap between back-end and front-end
development, delivering technically efficient communication to other departments, ensuring of logical, structured,
scalable, user-centric and effective solutions.`,
  aboutItems: [
    {label: 'Location', text: 'Kosova, XK', Icon: MapIcon},
    // {label: 'Age', text: `${age}`, Icon: CalendarIcon},
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
    description:
      "I'm delighted to present a dynamic web application crafted with React.js and Node.js, backed by a robust MySQL database. This multifaceted system boasts an intuitive admin panel for seamless content management and a client module for an engaging user experience. Leveraging the power of React, the frontend delivers a responsive and modern interface, while Node.js handles the backend operations efficiently. The integration with MySQL ensures data integrity and scalability. This project not only showcases my technical proficiency in full-stack development but also emphasizes my commitment to creating user-centric solutions. Explore the admin controls and client features to witness the seamless synergy of technology in action.",
    url: 'https://www.m-technologie.com/',
    blur: false,
    background: 'transparent',
    image: porfolioImage1,
  },

  {
    title: 'E-Sim Reseller Website',
    description:
      "In my latest venture, I've developed an innovative eSIM reseller platform using React.js, Node.js, and MySQL. This dynamic system leverages the power of APIs to seamlessly integrate with external services, enabling the retrieval of real-time data for eSIMs. The utilization of React ensures a modern and responsive user interface, while the backend, powered by Node.js, efficiently manages the integration with various APIs, creating a streamlined experience for both resellers and end-users. The MySQL database plays a pivotal role in storing and managing eSIM-related information, ensuring data security and reliability. This project not only demonstrates my technical prowess in React and Node.js but also underscores my ability to create solutions that bridge the digital gap in the rapidly evolving telecommunications landscape.",
    url: 'https://tripon-esim.com/',
    blur: false,
    background: 'transparent',
    image: porfolioImage3,
  },
  {
    title: 'HiveOutsourcing',
    description:
      'Hive Outsourcing is at the forefront of transforming business landscapes through innovative outsourcing solutions. With a commitment to excellence, they empower companies to streamline operations and enhance productivity. Their expert team specializes in a variety of services, including digital marketing, IT solutions, and customer support, ensuring that clients can focus on core business objectives while Hive manages essential functions. By leveraging cutting-edge technology and industry best practices, Hive Outsourcing not only delivers measurable results but also fosters lasting partnerships with businesses looking to scale efficiently. Their approach combines strategic insights with tailored solutions, positioning clients for success in an ever-evolving marketplace.',
    url: 'https://hiveoutsource.com/',
    blur: false,
    background: 'transparent',
    image: porfolioImage8,
  },
  {
    title: 'FurnishHome-KS',
    description:
      "Revolutionizing the sales approach for a local furniture company, I developed a dynamic digital solution using WordPress. This transformative platform not only showcases the exquisite craftsmanship of the furniture but also enhances the entire sales process. Through strategic customization and integration, the website seamlessly blends aesthetic appeal with functional efficiency. Customers can now explore the diverse furniture collection, accompanied by detailed descriptions and high-quality visuals. The WordPress architecture ensures easy content management, empowering the client to update product listings and engage with the audience effortlessly. By digitizing the sales experience, this project not only elevates the company's online presence but also brings the artistry of furniture craftsmanship to a broader digital audience.",
    url: '',
    blur: false,
    background: 'transparent',
    image: porfolioImage4,
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    title: 'Project of Harrisia',
    description: `A reward-based game app organizes challenges and various activities for players, offering different rewards.
    The objective is to engage and motivate users to buy Coca-Cola as a product and at the same time give back to them a gift if they ar lucky to be chosen as winners.
    Technology used: React.js, Node.js, MYSQL, MYSQL Events, Bootstrap5, HTML5, CSS3`,
    url: 'https://cokenewyear.com/',
    background: 'red',
    blur: false,
    image:
      'https://assets-global.website-files.com/63f6e52346a353ca1752970e/6440bf1a03c90188594c39e7_study-cover-cocacola.jpeg',
  },
  {
    title: 'Project of Harrisia',
    description: `A platform for court review system ment to be used by the public.
    Technology used: React.js, Node.js, MYSQL, Bootstrap5, HTML5, CSS3, Flutter (for mobile app development).`,
    url: '',
    background: 'transparent',
    blur: false,
    image: 'https://www.developmentaid.org/files/organizationLogos/chemonics-international-kenya-203060.jpg',
  },

  {
    title: 'Project of Harrisia',
    description: '',
    url: 'https://yuuniq.com',
    background: 'transparent',
    blur: false,
    image: porfolioImage7,
  },
  {
    title: 'Project of Harrisia',
    description: `A platform Student Information Management System, a RBAC platform that allows multiple bussineses that use the platform to custumize it as they see fit.
    Technology used: React.js, Node.js, MYSQL, Bootstrap5, HTML5, CSS3`,
    url: '',
    background: 'transparent',
    blur: false,
    image: 'https://sims.cacttus.education/assets/sims3-BxGDfmQm.png',
  },
  {
    title: 'Project of Harrisia',
    description: `National platform for protection against discrimination for Rom, Ashkali and Egyptian communities.
    Technology used: React.js, Node.js, MYSQL, jQuery, Bootstrap5, HTML5, CSS3.`,
    url: 'https://www.raportodiskriminimin.org/',
    background: 'white',
    blur: false,
    image: 'https://www.raportodiskriminimin.org/static/media/Logoshqip.f4d0133c.png',
  },

  {
    title: 'Project of Harrisia',
    description: `Platform for monitoring and calculation of Hydrometeorological activities
    Technology used: NET 6, React.js, Entity Framework Core, LINQ, MSSQL, Report Viewer, jQuery, Bootstrap5, HTML5, CSS3.`,
    url: '',
    background: 'transparent',
    blur: false,
    image: 'https://ihmk-rks.net/inc/images/IHMK.png',
  },
  {
    title: 'Project of Harrisia',
    description: `A revolutionary fitness app offering personalized workouts with diverse trainers tailored to individual goals  and preferences.
    Technology used: React.js, Node.js, MYSQL, Bootstrap5, HTML5, CSS3, Flutter (for mobile app development).`,
    url: '',
    background: 'transparent',
    blur: false,
    image: porfolioImage5,
  },
  {
    title: 'Project of Harrisia',
    description: '',
    url: 'https://termini.beauty',
    background: 'white',
    blur: false,
    image: porfolioImage6,
  },
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
  // {
  //   date: 'September 2014',
  //   location: 'Naim Frashëri High School - Shtime',
  //   title: 'Gymnasium of Natural Science',
  //   content: (
  //     <p>
  //       During my High School studies, I have gained general knowledge over different subjects, but math was my favorite
  //       since I already knew that I was going to study CSE. I had given my best and successfully gained different
  //       certificates and letters of recognition for different activities that I held at my school. I am grateful for the
  //       teachers that empowered and inspired me to go on with my dream!
  //     </p>
  //   ),
  // },
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
        During YCIP Training, I developed both technical and soft skills through hands-on HTML, CSS, JavaScript, and
        WordPress training. This experience strengthened my passion for coding and problem-solving. I also earned
        certificates and recognition for my dedication and achievements. I am grateful to the teachers and mentors who
        inspired and empowered me to pursue my dream in technology!
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
    title: 'Software Engineer',
    content: (
      <ol>
        <li>
          I began this role as a pure Software Engineer, but eventually ranked up additional responsibilities including
          leading development teams (open source & mobile teams), managing projects, overseeing DevOps, environment
          stages, security, and GitLab server management. Currentlly my role involves writing technical proposals,
          organizing client meetings, ensuring code quality, and optimizing workflows to meet deadlines efficiently. My
          commitment to delivering and fostering high-quality, scalable solutions while maintaining efficient team
          coordination, project execution and most importantly a workplace environment where working with colleagues is
          enjoyable.
        </li>
        <li>
          While my core role is Software Engineer, my responsibilities extend to:
          <ul>
            <li>
              <b>• Team Leadership</b> – Managing and mentoring development teams to ensure project success.
            </li>
            <li>
              <b>• Project Management</b> – Overseeing project lifecycles, from planning to deployment.
            </li>
            <li>
              <b>• DevOps & Security</b> – Managing server infrastructure, security protocols, and deployment.
            </li>
          </ul>
        </li>
      </ol>
    ),
  },
  {
    date: 'January 2025 - Present',
    location: 'ROI ACADEMY',
    title: 'MERN STACK LECTURER ',
    content: (
      <p>
        I have recently started to work together with ROI Academy to hold an intensive long term training that not only
        focuses on code and best practices but also sharing real experiences from my end without disregarding the
        confidentiality of my work nature.
        <br />
        In this training I am lecturing about MERN Stack technologies, how everything falls into place together, how to
        best utilize their skills and gain the most out of this training to stand out in the market. One thing I want to
        proactively achieve with my students, is to engage them into a creative thinking for issues that they will
        encounter for the first time. The ability to perceive such a mindset is a special skill that everyone can
        achieve, thus I strongly believe that this is a fundamental skill for a strong and professional engineer as this
        method has helped me consistently strive in my career.
      </p>
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
        Topics to open the horizon to the participants as to what they can do using React JS as a developing technology.
      </p>
    ),
  },
  {
    date: '2017 - Ongoing',
    location: 'Remote',
    title: 'FREELANCER',
    content: (
      <p>
        Successfully delivered comprehensive freelance projects for multiple clients, centered on developing dynamic web
        applications. Leveraging React.js for the front end, Node.js for server-side logic, MySQL & MSSQL for database
        management and also VIMEO as a streaming service. In these projects I aim to optimize and enhance user
        interaction with the provided services, which also ensures customer satisfaction and a healthy long term
        partnership with them. I have enlisted most of these projects bellow but please note that due to client requests
        I have not included all of the projects in accordance with their demands to showcase my work.
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
      image: 'https://tripon-esim.com/assets/logo-wu6V8b2N.png',
    },
    {
      name: 'Hive Outsource',
      text: 'The platform is seamless, intuitive, and built with precision. Your commitment to quality, innovation, and smooth collaboration has made our outsourcing experience effortless and highly productive.',
      image:
        'data:image/png;base64,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',
    },
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
    // {
    //   type: ContactType.Email,
    //   text: 'artonramadani25@gmail.com',
    //   href: 'mailto:artonramadani25@gmail.com',
    // },
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
