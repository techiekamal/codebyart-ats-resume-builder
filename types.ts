export type SectionType = 
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'custom';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
  summary: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  achievements: string[]; // Stored as array, edited as newline separated string
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
  gpa?: string;
  gradeType?: 'CGPA' | 'Percentage' | 'GPA';
}

export interface SkillEntry {
  id: string;
  category: 'technical' | 'soft' | 'languages' | 'tools';
  skills: string[]; // Stored as array, edited as CSV
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate: string;
  endDate?: string;
}

export interface CustomField {
  id: string;
  type: 'text' | 'date' | 'url' | 'bullets';
  label: string;
  value: string | string[];
}

export interface CustomEntry {
  id: string;
  fields: CustomField[];
}

export type SectionEntry = ExperienceEntry | EducationEntry | SkillEntry | ProjectEntry | CustomEntry;

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  isCustom: boolean;
  entries: SectionEntry[];
  isVisible: boolean;
}

export interface ResumeData {
  id: string;
  name: string;
  updatedAt: Date;
  personalInfo: PersonalInfo;
  sections: Section[];
  sectionOrder: string[]; // Array of section IDs
  templateId: string;
  colorAccent: string;
  headingColor?: string;
}

export interface ATSScore {
  overall: number;
  breakdown: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
  };
  suggestions: string[];
}
