import { ResumeData, Section } from './types';
import { v4 as uuidv4 } from 'uuid'; // Assuming we'd use a UUID lib, but I'll use a simple random string for this demo

const generateId = () => Math.random().toString(36).substr(2, 9);

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'exp-section',
    type: 'experience',
    title: 'Professional Experience',
    isCustom: false,
    isVisible: true,
    entries: [
      {
        id: generateId(),
        company: 'Tech Solutions Inc.',
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: null,
        isCurrent: true,
        achievements: [
          'Led migration of legacy monolith to microservices architecture, improving scalability by 40%.',
          'Mentored 5 junior developers and conducted code reviews to ensure code quality.',
          'Implemented CI/CD pipelines reducing deployment time by 60%.'
        ]
      }
    ]
  },
  {
    id: 'edu-section',
    type: 'education',
    title: 'Education',
    isCustom: false,
    isVisible: true,
    entries: [
      {
        id: generateId(),
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        graduationDate: '2019-05',
        gpa: '3.8',
        gradeType: 'CGPA'
      }
    ]
  },
  {
    id: 'skills-section',
    type: 'skills',
    title: 'Skills',
    isCustom: false,
    isVisible: true,
    entries: [
      {
        id: generateId(),
        category: 'technical',
        skills: ['React', 'TypeScript', 'Python', 'Node.js', 'AWS', 'Docker']
      }
    ]
  },
  {
    id: 'proj-section',
    type: 'projects',
    title: 'Projects',
    isCustom: false,
    isVisible: true,
    entries: []
  }
];

export const INITIAL_RESUME_DATA: ResumeData = {
  id: generateId(),
  name: 'My Resume',
  updatedAt: new Date(),
  personalInfo: {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/alexjohnson',
    portfolio: 'alexj.dev',
    summary: 'Results-oriented Senior Software Engineer with 5+ years of experience in full-stack development. Proven track record of delivering scalable solutions and optimizing system performance. Skilled in modern JavaScript frameworks and cloud infrastructure.'
  },
  sections: DEFAULT_SECTIONS,
  sectionOrder: ['exp-section', 'edu-section', 'skills-section', 'proj-section'],
  templateId: 'classic',
  colorAccent: '#2563eb' // blue-600
};

export const MOCK_ATS_SCORE = {
  overall: 85,
  breakdown: {
    formatting: 90,
    keywords: 80,
    structure: 95,
    readability: 75
  },
  suggestions: [
    'Add more measurable metrics to your experience descriptions.',
    'Include more industry-specific keywords like "Agile" or "System Design".',
    'Ensure your contact information is easy to find.'
  ]
};
