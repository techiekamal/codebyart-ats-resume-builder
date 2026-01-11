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
        <strong key={index} style={{ fontWeight: 700, color: '#000' }}>
          {highlightedText}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const LivePreview: React.FC<LivePreviewProps> = ({ data, scale = 1 }) => {
  const { personalInfo, sections, sectionOrder, colorAccent } = data;
  const headingColor = data.headingColor || colorAccent;
  const fontFamily = data.fontFamily || 'Arial';

  const getSectionById = (id: string) => sections.find(s => s.id === id);

  // Font family mapping
  const getFontFamily = () => {
    switch(fontFamily) {
      case 'Times New Roman': return '"Times New Roman", Times, serif';
      case 'Georgia': return 'Georgia, serif';
      case 'Calibri': return 'Calibri, sans-serif';
      case 'Verdana': return 'Verdana, sans-serif';
      default: return 'Arial, Helvetica, sans-serif';
    }
  };

  // Common styles
  const styles = {
    heading: { fontSize: '12pt', fontWeight: 700 as const, color: '#000', fontFamily: getFontFamily() },
    subheading: { fontSize: '11pt', fontWeight: 600 as const, color: '#374151', fontFamily: getFontFamily() },
    body: { fontSize: '10pt', color: '#374151', lineHeight: 1.4, fontFamily: getFontFamily() },
    small: { fontSize: '10pt', color: '#4b5563', fontFamily: getFontFamily() },
    sectionTitle: { fontSize: '12pt', fontWeight: 700 as const, color: headingColor, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontFamily: getFontFamily() },
  };

  const renderExperience = (entries: ExperienceEntry[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {entries.map(entry => (
        <div key={entry.id} style={{ pageBreakInside: 'avoid' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={styles.heading}>{entry.title}</span>
            <span style={styles.small}>
              {entry.startDate} – {entry.isCurrent ? 'Present' : entry.endDate}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={styles.subheading}>{entry.company}</span>
            <span style={{ ...styles.small, fontStyle: 'italic' }}>{entry.location}</span>
          </div>
          <ul style={{ ...styles.body, marginLeft: '16px', marginTop: '2px', paddingLeft: '0', listStyleType: 'disc' }}>
            {entry.achievements.map((ach, i) => (
              <li key={i} style={{ marginBottom: '1px' }}>{parseHighlightedText(ach, colorAccent)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderEducation = (entries: EducationEntry[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {entries.map(entry => (
        <div key={entry.id} style={{ pageBreakInside: 'avoid' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={styles.heading}>{entry.institution}</span>
            <span style={styles.small}>{entry.graduationDate}</span>
          </div>
          <div style={styles.body}>
            {entry.degree} in {entry.fieldOfStudy}
            {entry.gpa && <span style={{ marginLeft: '8px' }}>{entry.gradeType || 'CGPA'}: {entry.gpa}{entry.gradeType === 'Percentage' ? '%' : ''}</span>}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = (entries: SkillEntry[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      {entries.map(entry => (
        <div key={entry.id} style={styles.body}>
          <span style={{ fontWeight: 700, color: '#000', textTransform: 'capitalize' }}>{entry.category}: </span>
          <span>{entry.skills.join(', ')}</span>
        </div>
      ))}
    </div>
  );

  const renderProjects = (entries: ProjectEntry[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {entries.map(entry => (
        <div key={entry.id} style={{ pageBreakInside: 'avoid' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={styles.heading}>
              {entry.name}
              {entry.url && <a href={`https://${entry.url}`} style={{ ...styles.small, color: '#2563eb', marginLeft: '8px', fontWeight: 400 }} target="_blank" rel="noreferrer">{entry.url}</a>}
            </span>
            <span style={styles.small}>
              {entry.startDate} {entry.endDate && `– ${entry.endDate}`}
            </span>
          </div>
          <p style={styles.body}>{parseHighlightedText(entry.description, colorAccent)}</p>
          <div style={styles.body}>
            <span style={{ fontWeight: 600, color: '#000' }}>Technologies:</span> {entry.technologies.join(', ')}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCustom = (entries: CustomEntry[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {entries.map(entry => {
        const titleField = entry.fields.find(f => f.type === 'text');
        const dateField = entry.fields.find(f => f.type === 'date');
        const otherFields = entry.fields.filter(f => f !== titleField && f !== dateField);

        return (
          <div key={entry.id} style={{ pageBreakInside: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              {titleField && <span style={styles.heading}>{titleField.value}</span>}
              {dateField && <span style={styles.small}>{dateField.value}</span>}
            </div>
            <div style={styles.body}>
              {otherFields.map(field => {
                if (field.type === 'bullets') {
                  return (
                    <ul key={field.id} style={{ marginLeft: '16px', marginTop: '2px', paddingLeft: '0', listStyleType: 'disc' }}>
                      {(field.value as string[]).map((v, i) => (
                        <li key={i} style={{ marginBottom: '1px' }}>{parseHighlightedText(v, colorAccent)}</li>
                      ))}
                    </ul>
                  );
                }
                if (field.type === 'url') {
                  return (
                    <div key={field.id}>
                      <a href={field.value as string} style={{ color: '#2563eb' }} target="_blank" rel="noreferrer">{field.value}</a>
                    </div>
                  );
                }
                return (
                  <div key={field.id} style={field.type === 'date' ? { fontStyle: 'italic', color: '#6b7280' } : {}}>
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
      className="a4-paper"
      style={{ 
        transform: `scale(${scale})`, 
        transformOrigin: 'top',
        padding: '6mm 5mm',
        color: '#1f2937',
        fontFamily: getFontFamily(),
        lineHeight: 1.4,
      }}
    >
      {/* Header - Name Only */}
      <header style={{ borderBottom: `2px solid ${headingColor}`, paddingBottom: '6px', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '18pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#000', margin: 0 }}>
          {personalInfo.fullName}
        </h1>
      </header>

      {/* Contact Section */}
      <section style={{ marginBottom: '10px' }}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: '4px' }}>Contact</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', ...styles.body }}>
          {personalInfo.email && (
            <div><span style={{ fontWeight: 600, color: '#000' }}>Email:</span> <a href={`mailto:${personalInfo.email}`} style={{ color: '#374151' }}>{personalInfo.email}</a></div>
          )}
          {personalInfo.phone && (
            <div><span style={{ fontWeight: 600, color: '#000' }}>Phone:</span> {personalInfo.phone}</div>
          )}
          {personalInfo.location && (
            <div><span style={{ fontWeight: 600, color: '#000' }}>Location:</span> {personalInfo.location}</div>
          )}
          {personalInfo.linkedIn && (
            <div><span style={{ fontWeight: 600, color: '#000' }}>LinkedIn:</span> <a href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://${personalInfo.linkedIn}`} target="_blank" rel="noopener noreferrer" style={{ color: '#374151' }}>{personalInfo.linkedIn}</a></div>
          )}
          {personalInfo.portfolio && (
            <div><span style={{ fontWeight: 600, color: '#000' }}>Portfolio:</span> <a href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" style={{ color: '#374151' }}>{personalInfo.portfolio}</a></div>
          )}
        </div>
      </section>

      {/* Summary */}
      {personalInfo.summary && (
        <section style={{ marginBottom: '10px' }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: '4px' }}>Professional Summary</h2>
          <p style={{ ...styles.body, margin: 0 }}>{parseHighlightedText(personalInfo.summary, colorAccent)}</p>
        </section>
      )}

      {/* Sections */}
      {sectionOrder.map(sectionId => {
        const section = getSectionById(sectionId);
        if (!section || !section.isVisible) return null;

        return (
          <section key={section.id} style={{ marginBottom: '10px' }}>
            <h2 style={{ ...styles.sectionTitle, marginBottom: '6px', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px' }}>
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
