import React from 'react';
import { ResumeData, Section, ExperienceEntry, EducationEntry, SkillEntry, ProjectEntry, CustomEntry } from '../../types';

interface LivePreviewProps {
  data: ResumeData;
  scale?: number;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ data, scale = 1 }) => {
  const { personalInfo, sections, sectionOrder, colorAccent } = data;

  const getSectionById = (id: string) => sections.find(s => s.id === id);

  const renderExperience = (entries: ExperienceEntry[]) => (
    <div className="space-y-4">
      {entries.map(entry => (
        <div key={entry.id} className="mb-2 break-inside-avoid">
          <div className="flex justify-between items-baseline">
            <h4 className="font-bold text-gray-900">{entry.title}</h4>
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {entry.startDate} – {entry.isCurrent ? 'Present' : entry.endDate}
            </span>
          </div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-semibold text-gray-700">{entry.company}</span>
            <span className="text-sm text-gray-500 italic">{entry.location}</span>
          </div>
          <ul className="list-disc list-outside ml-4 space-y-0.5 text-sm text-gray-700">
            {entry.achievements.map((ach, i) => (
              <li key={i} className="leading-snug">{ach}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderEducation = (entries: EducationEntry[]) => (
    <div className="space-y-3">
      {entries.map(entry => (
        <div key={entry.id} className="break-inside-avoid">
           <div className="flex justify-between items-baseline">
            <h4 className="font-bold text-gray-900">{entry.institution}</h4>
            <span className="text-sm text-gray-600">{entry.graduationDate}</span>
          </div>
          <div className="text-gray-800 text-sm">
            {entry.degree} in {entry.fieldOfStudy}
            {entry.gpa && <span className="text-gray-600 ml-2">GPA: {entry.gpa}</span>}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = (entries: SkillEntry[]) => (
    <div className="space-y-2">
       {entries.map(entry => (
         <div key={entry.id} className="text-sm break-inside-avoid">
            <span className="font-bold text-gray-800 capitalize">{entry.category}: </span>
            <span className="text-gray-700">{entry.skills.join(', ')}</span>
         </div>
       ))}
    </div>
  );

  const renderProjects = (entries: ProjectEntry[]) => (
     <div className="space-y-3">
      {entries.map(entry => (
        <div key={entry.id} className="break-inside-avoid">
          <div className="flex justify-between items-baseline">
            <h4 className="font-bold text-gray-900">
                {entry.name}
                {entry.url && <a href={`https://${entry.url}`} className="text-blue-600 text-xs ml-2 font-normal" target="_blank" rel="noreferrer">{entry.url}</a>}
            </h4>
            <span className="text-sm text-gray-600">
              {entry.startDate} {entry.endDate && `– ${entry.endDate}`}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-snug mb-1">{entry.description}</p>
          <div className="text-xs text-gray-500">
            <span className="font-medium">Technologies:</span> {entry.technologies.join(', ')}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCustom = (entries: CustomEntry[]) => (
      <div className="space-y-4">
          {entries.map(entry => {
              // Simple heuristic for layout:
              // 1. Gather all fields
              // 2. Identify likely Title (bold) and Date (right aligned)
              
              // Find first text field to treat as Title
              const titleField = entry.fields.find(f => f.type === 'text');
              // Find first date field to treat as Right Aligned Date
              const dateField = entry.fields.find(f => f.type === 'date');
              
              const otherFields = entry.fields.filter(f => f !== titleField && f !== dateField);

              return (
                <div key={entry.id} className="mb-2 break-inside-avoid">
                   {/* Header Row */}
                   <div className="flex justify-between items-baseline mb-1">
                       {titleField && (
                           <h4 className="font-bold text-gray-900">{titleField.value}</h4>
                       )}
                       {dateField && (
                           <span className="text-sm text-gray-600 whitespace-nowrap ml-auto">{dateField.value}</span>
                       )}
                   </div>

                   {/* Body Fields */}
                   <div className="text-sm text-gray-700">
                       {otherFields.map(field => {
                           if (field.type === 'bullets') {
                               return (
                                   <ul key={field.id} className="list-disc list-outside ml-4 space-y-0.5 mt-1 mb-1">
                                       {(field.value as string[]).map((v, i) => (
                                           <li key={i} className="leading-snug">{v}</li>
                                       ))}
                                   </ul>
                               );
                           }
                           
                           if (field.type === 'url') {
                               return (
                                   <div key={field.id} className="mb-0.5">
                                       <a href={field.value as string} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                                           {field.value}
                                       </a>
                                   </div>
                               );
                           }
                           
                           // Standard Text / Date (if multiple dates)
                           return (
                               <div key={field.id} className={`mb-0.5 ${field.type === 'date' ? 'text-gray-500 italic' : ''}`}>
                                   {field.value}
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
        className="a4-paper p-[10mm] text-gray-800 origin-top"
        style={{ transform: `scale(${scale})` }}
    >
      {/* Header */}
      <header className="border-b-2 pb-4 mb-6" style={{ borderColor: colorAccent }}>
        <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-2">
            {personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedIn && <span>• {personalInfo.linkedIn}</span>}
            {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-5 break-inside-avoid">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: colorAccent }}>
                Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">
                {personalInfo.summary}
            </p>
        </section>
      )}

      {/* Sections */}
      {sectionOrder.map(sectionId => {
        const section = getSectionById(sectionId);
        if (!section || !section.isVisible) return null;

        return (
          <section key={section.id} className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color: colorAccent, borderColor: '#e5e7eb' }}>
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