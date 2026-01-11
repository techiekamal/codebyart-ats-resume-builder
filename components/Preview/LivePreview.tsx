import React from 'react';
import { ResumeData, Section, ExperienceEntry, EducationEntry, SkillEntry, ProjectEntry, CustomEntry } from '../../types';

interface LivePreviewProps {
  data: ResumeData;
  scale?: number;
}

// Helper function to parse text with **highlight** markers
const parseHighlightedText = (text: string, accentColor: string): React.ReactNode => {
  if (!text) return text;
  
  // Split by **text** pattern
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove ** markers and render as bold black
      const highlightedText = part.slice(2, -2);
      return (
        <strong 
          key={index} 
          className="font-bold text-black"
        >
          {highlightedText}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const LivePreview: React.FC<LivePreviewProps> = ({ data, scale = 1 }) => {
  const { personalInfo, sections, sectionOrder, colorAccent } = data;
  // Use headingColor if available, otherwise fall back to colorAccent
  const headingColor = (data as any).headingColor || colorAccent;

  const getSectionById = (id: string) => sections.find(s => s.id === id);

  const renderExperience = (entries: ExperienceEntry[]) => (
    <div className="space-y-2">
      {entries.map(entry => (
        <div key={entry.id} className="break-inside-avoid">
          <div className="flex justify-between items-baseline">
            <h4 className="font-bold text-black" style={{ fontSize: '12px' }}>{entry.title}</h4>
            <span className="text-gray-700 whitespace-nowrap" style={{ fontSize: '10px' }}>
              {entry.startDate} – {entry.isCurrent ? 'Present' : entry.endDate}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-gray-800" style={{ fontSize: '11px' }}>{entry.company}</span>
            <span className="text-gray-600 italic" style={{ fontSize: '10px' }}>{entry.location}</span>
          </div>
          <ul className="list-disc list-outside ml-3.5 space-y-0 text-gray-800 mt-0.5" style={{ fontSize: '10px' }}>
            {entry.achievements.map((ach, i) => (
              <li key={i} className="leading-snug">{parseHighlightedText(ach, colorAccent)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderEducation = (entries: EducationEntry[]) => (
    <div className="space-y-1">
      {entries.map(entry => (
        <div key={entry.id} className="break-inside-avoid">
           <div className="flex justify-between items-baseline">
            <h4 className="font-bold text-black" style={{ fontSize: '12px' }}>{entry.institution}</h4>
            <span className="text-gray-700" style={{ fontSize: '10px' }}>{entry.graduationDate}</span>
          </div>
          <div className="text-gray-800" style={{ fontSize: '10px' }}>
            {entry.degree} in {entry.fieldOfStudy}
            {entry.gpa && <span className="text-gray-700 ml-2">{entry.gradeType || 'CGPA'}: {entry.gpa}{entry.gradeType === 'Percentage' ? '%' : ''}</span>}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = (entries: SkillEntry[]) => (
    <div className="space-y-0.5">
       {entries.map(entry => (
         <div key={entry.id} className="break-inside-avoid" style={{ fontSize: '10px' }}>
            <span className="font-bold text-black capitalize">{entry.category}: </span>
            <span className="text-gray-800">{entry.skills.join(', ')}</span>
         </div>
       ))}
    </div>
  );

  const renderProjects = (entries: ProjectEntry[]) => (
     <div className="space-y-1.5">
      {entries.map(entry => (
        <div key={entry.id} className="break-inside-avoid">
          <div className="flex justify-between items-baseline">
            <h4 className="font-bold text-black" style={{ fontSize: '12px' }}>
                {entry.name}
                {entry.url && <a href={`https://${entry.url}`} className="text-blue-600 ml-2 font-normal" style={{ fontSize: '10px' }} target="_blank" rel="noreferrer">{entry.url}</a>}
            </h4>
            <span className="text-gray-700" style={{ fontSize: '10px' }}>
              {entry.startDate} {entry.endDate && `– ${entry.endDate}`}
            </span>
          </div>
          <p className="text-gray-800 leading-snug" style={{ fontSize: '10px' }}>{parseHighlightedText(entry.description, colorAccent)}</p>
          <div className="text-gray-700" style={{ fontSize: '10px' }}>
            <span className="font-medium text-black">Technologies:</span> {entry.technologies.join(', ')}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCustom = (entries: CustomEntry[]) => (
      <div className="space-y-1.5">
          {entries.map(entry => {
              const titleField = entry.fields.find(f => f.type === 'text');
              const dateField = entry.fields.find(f => f.type === 'date');
              const otherFields = entry.fields.filter(f => f !== titleField && f !== dateField);

              return (
                <div key={entry.id} className="break-inside-avoid">
                   <div className="flex justify-between items-baseline">
                       {titleField && (
                           <h4 className="font-bold text-black" style={{ fontSize: '12px' }}>{titleField.value}</h4>
                       )}
                       {dateField && (
                           <span className="text-gray-700 whitespace-nowrap ml-auto" style={{ fontSize: '10px' }}>{dateField.value}</span>
                       )}
                   </div>
                   <div className="text-gray-800" style={{ fontSize: '10px' }}>
                       {otherFields.map(field => {
                           if (field.type === 'bullets') {
                               return (
                                   <ul key={field.id} className="list-disc list-outside ml-3.5 space-y-0 mt-0.5">
                                       {(field.value as string[]).map((v, i) => (
                                           <li key={i} className="leading-snug">{parseHighlightedText(v, colorAccent)}</li>
                                       ))}
                                   </ul>
                               );
                           }
                           if (field.type === 'url') {
                               return (
                                   <div key={field.id}>
                                       <a href={field.value as string} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                                           {field.value}
                                       </a>
                                   </div>
                               );
                           }
                           return (
                               <div key={field.id} className={field.type === 'date' ? 'text-gray-600 italic' : ''}>
                                   {parseHighlightedText(field.value as string, colorAccent)}
                               </div>
                           );
                       })}
                   </div>
                </div>
              );
          })}
      </div>
  );


  return (
    <div 
        className="a4-paper text-gray-900 origin-top"
        style={{ transform: `scale(${scale})`, padding: '6mm 8mm' }}
    >
      {/* Header - Name Only */}
      <header className="border-b-2 pb-1.5 mb-2" style={{ borderColor: headingColor }}>
        <h1 className="text-xl font-bold uppercase tracking-wide text-black">
            {personalInfo.fullName}
        </h1>
      </header>

      {/* Contact Section - ATS Friendly */}
      <section className="mb-2 break-inside-avoid">
        <h2 className="font-bold uppercase tracking-wider mb-0.5" style={{ color: headingColor, fontSize: '12px' }}>
          Contact
        </h2>
        <div className="flex flex-wrap gap-x-3 gap-y-0 text-gray-800" style={{ fontSize: '10px' }}>
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-black">Email:</span>
              <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline">
                {personalInfo.email}
              </a>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-black">Phone:</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-black">Location:</span>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedIn && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-black">LinkedIn:</span>
              <a 
                href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://${personalInfo.linkedIn}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline"
              >
                {personalInfo.linkedIn}
              </a>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-black">Portfolio:</span>
              <a 
                href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline"
              >
                {personalInfo.portfolio}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-2 break-inside-avoid">
            <h2 className="font-bold uppercase tracking-wider mb-0.5" style={{ color: headingColor, fontSize: '12px' }}>
                Professional Summary
            </h2>
            <p className="leading-snug text-gray-800" style={{ fontSize: '10px' }}>
                {parseHighlightedText(personalInfo.summary, colorAccent)}
            </p>
        </section>
      )}

      {/* Sections */}
      {sectionOrder.map(sectionId => {
        const section = getSectionById(sectionId);
        if (!section || !section.isVisible) return null;

        return (
          <section key={section.id} className="mb-2">
            <h2 className="font-bold uppercase tracking-wider mb-1 border-b pb-0.5" style={{ color: headingColor, borderColor: '#e5e7eb', fontSize: '12px' }}>
                {section.title}
            </h2>
            
            {section.type === 'experience' && renderExperience(section.entries as ExperienceEntry[])}
            {section.type === 'education' && renderEducation(section.entries as EducationEntry[])}
            {section.type === 'skills' && renderSkills(section.entries as SkillEntry[])}
            {section.type === 'projects' && renderProjects(section.entries as ProjectEntry[])}
            {section.type === 'custom' && renderCustom(section.entries as CustomEntry[])}
          </section>
        );
      })}
    </div>
  );
};
