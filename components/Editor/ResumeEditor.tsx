import React, { useState } from 'react';
import { ResumeData, ExperienceEntry, EducationEntry, SkillEntry, ProjectEntry, CustomEntry, CustomField, SectionType, Section } from '../../types';
import { Input, TextArea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Trash2, Plus, ChevronUp, ChevronDown, Eye, EyeOff, GripVertical, AlertTriangle } from 'lucide-react';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string | 'personal'>('personal');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const updateSectionEntry = (sectionId: string, entryId: string, field: string, value: any) => {
    const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const newSections = [...data.sections];
    const section = newSections[sectionIndex];
    const entryIndex = section.entries.findIndex(e => e.id === entryId);
    
    if (entryIndex === -1) return;

    // Handle array conversions for specific fields
    let processedValue = value;
    if (field === 'achievements') {
        processedValue = value.split('\n');
    } else if (field === 'skills' || field === 'technologies') {
        processedValue = value.split(',').map((s: string) => s.trim());
    }

    const updatedEntry = { ...section.entries[entryIndex], [field]: processedValue };
    section.entries[entryIndex] = updatedEntry;

    onChange({ ...data, sections: newSections });
  };

  const addEntry = (sectionId: string) => {
      const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
      const newSections = [...data.sections];
      const section = newSections[sectionIndex];
      const newId = Math.random().toString(36).substr(2, 9);

      let newEntry: any = { id: newId };
      
      if (section.type === 'experience') {
          newEntry = { ...newEntry, company: 'New Company', title: 'Job Title', location: '', startDate: '', achievements: [] };
      } else if (section.type === 'education') {
          newEntry = { ...newEntry, institution: 'University', degree: 'Degree', fieldOfStudy: 'Field', graduationDate: '' };
      } else if (section.type === 'skills') {
          newEntry = { ...newEntry, category: 'technical', skills: [] };
      } else if (section.type === 'projects') {
          newEntry = { ...newEntry, name: 'Project Name', description: '', technologies: [], startDate: '' };
      } else if (section.type === 'custom') {
          newEntry = { 
              ...newEntry, 
              fields: [
                  { id: Math.random().toString(36).substr(2, 9), type: 'text', label: 'Title', value: 'Item Title' },
                  { id: Math.random().toString(36).substr(2, 9), type: 'date', label: 'Date', value: '2023' },
                  { id: Math.random().toString(36).substr(2, 9), type: 'bullets', label: 'Description', value: [] }
              ] 
          };
      }

      section.entries.push(newEntry);
      onChange({ ...data, sections: newSections });
  };

  const removeEntry = (sectionId: string, entryId: string) => {
      const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
      const newSections = [...data.sections];
      newSections[sectionIndex].entries = newSections[sectionIndex].entries.filter(e => e.id !== entryId);
      onChange({ ...data, sections: newSections });
  };

  const toggleSectionVisibility = (sectionId: string) => {
      const newSections = data.sections.map(s => 
          s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
      );
      onChange({ ...data, sections: newSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === data.sectionOrder.length - 1)) return;
      
      const newOrder = [...data.sectionOrder];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
      
      onChange({ ...data, sectionOrder: newOrder });
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const newId = `custom-${Math.random().toString(36).substr(2, 9)}`;
    const newSection: Section = {
        id: newId,
        type: 'custom',
        title: newSectionTitle,
        isCustom: true,
        isVisible: true,
        entries: []
    };

    onChange({
        ...data,
        sections: [...data.sections, newSection],
        sectionOrder: [...data.sectionOrder, newId]
    });
    setNewSectionTitle("");
    setIsAddingSection(false);
    setActiveSection(newId);
  };

  const initiateDeleteSection = (sectionId: string) => {
      setSectionToDelete(sectionId);
  };

  const confirmDeleteSection = () => {
      if (!sectionToDelete) return;
      
      const newSections = data.sections.filter(s => s.id !== sectionToDelete);
      const newOrder = data.sectionOrder.filter(id => id !== sectionToDelete);
      
      onChange({
          ...data,
          sections: newSections,
          sectionOrder: newOrder
      });
      if (activeSection === sectionToDelete) setActiveSection('personal');
      setSectionToDelete(null);
  };

  const cancelDeleteSection = () => {
      setSectionToDelete(null);
  };

  // Custom Field Handlers
  const updateCustomEntryField = (sectionId: string, entryId: string, fieldId: string, updates: Partial<CustomField>) => {
      const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
      const newSections = [...data.sections];
      const section = newSections[sectionIndex];
      const entryIndex = section.entries.findIndex(e => e.id === entryId);
      const entry = section.entries[entryIndex] as CustomEntry;
      
      const fieldIndex = entry.fields.findIndex(f => f.id === fieldId);
      if (fieldIndex === -1) return;

      const newFields = [...entry.fields];
      newFields[fieldIndex] = { ...newFields[fieldIndex], ...updates };
      
      section.entries[entryIndex] = { ...entry, fields: newFields };
      onChange({ ...data, sections: newSections });
  };

  const addCustomField = (sectionId: string, entryId: string) => {
      const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
      const newSections = [...data.sections];
      const section = newSections[sectionIndex];
      const entryIndex = section.entries.findIndex(e => e.id === entryId);
      const entry = section.entries[entryIndex] as CustomEntry;

      const newField: CustomField = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'text',
          label: 'New Field',
          value: ''
      };

      section.entries[entryIndex] = { ...entry, fields: [...entry.fields, newField] };
      onChange({ ...data, sections: newSections });
  };

  const removeCustomField = (sectionId: string, entryId: string, fieldId: string) => {
      const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
      const newSections = [...data.sections];
      const section = newSections[sectionIndex];
      const entryIndex = section.entries.findIndex(e => e.id === entryId);
      const entry = section.entries[entryIndex] as CustomEntry;

      section.entries[entryIndex] = { ...entry, fields: entry.fields.filter(f => f.id !== fieldId) };
      onChange({ ...data, sections: newSections });
  };


  const renderSectionHeader = (sectionId: string, title: string, index: number, isCustom: boolean) => {
      const isVisible = data.sections.find(s => s.id === sectionId)?.isVisible;
      
      return (
        <div 
            className={`flex items-center justify-between p-3 cursor-pointer rounded-lg mb-2 transition-colors ${activeSection === sectionId ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveSection(sectionId)}
        >
            <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <span className="font-medium text-gray-700">{title}</span>
                {isCustom && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Custom</span>}
            </div>
            <div className="flex items-center space-x-1">
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30"
                    disabled={index === 0}
                >
                    <ChevronUp className="w-4 h-4" />
                </button>
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30"
                    disabled={index === data.sectionOrder.length - 1}
                >
                    <ChevronDown className="w-4 h-4" />
                </button>
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(sectionId); }}
                    className={`p-1 hover:bg-gray-200 rounded ${isVisible ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                {isCustom && (
                    <button 
                        type="button"
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            e.preventDefault();
                            initiateDeleteSection(sectionId); 
                        }}
                        className="p-2 hover:bg-red-100 rounded text-red-500 ml-1 transition-colors"
                        title="Delete Section"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
      );
  };

  const renderExperienceForm = (entry: ExperienceEntry, sectionId: string) => (
      <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-md border border-gray-200">
          <Input 
            label="Job Title" 
            value={entry.title} 
            onChange={e => updateSectionEntry(sectionId, entry.id, 'title', e.target.value)} 
          />
          <Input 
            label="Company" 
            value={entry.company} 
            onChange={e => updateSectionEntry(sectionId, entry.id, 'company', e.target.value)} 
          />
          <Input 
            label="Start Date" 
            type="text" 
            placeholder="YYYY-MM" 
            value={entry.startDate} 
            onChange={e => updateSectionEntry(sectionId, entry.id, 'startDate', e.target.value)} 
          />
          <div className="flex flex-col">
             <Input 
                label="End Date" 
                type="text" 
                placeholder="YYYY-MM or Present" 
                value={entry.endDate || ''} 
                disabled={entry.isCurrent}
                onChange={e => updateSectionEntry(sectionId, entry.id, 'endDate', e.target.value)} 
            />
            <label className="flex items-center mt-2 text-xs text-gray-600">
                <input 
                    type="checkbox" 
                    checked={entry.isCurrent} 
                    onChange={e => {
                        updateSectionEntry(sectionId, entry.id, 'isCurrent', e.target.checked);
                        if (e.target.checked) updateSectionEntry(sectionId, entry.id, 'endDate', null);
                    }}
                    className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                />
                Current Position
            </label>
          </div>
          <Input 
            label="Location" 
            className="col-span-2" 
            value={entry.location} 
            onChange={e => updateSectionEntry(sectionId, entry.id, 'location', e.target.value)} 
          />
          <div className="col-span-2">
            <TextArea 
                label="Achievements (One per line)" 
                rows={5}
                value={entry.achievements.join('\n')} 
                onChange={e => updateSectionEntry(sectionId, entry.id, 'achievements', e.target.value)} 
            />
            <p className="text-xs text-gray-500 mt-1">💡 Tip: Use **text** to highlight important keywords (e.g., **Python**, **40% improvement**)</p>
          </div>
          <div className="col-span-2 flex justify-end">
              <Button variant="danger" size="sm" icon={<Trash2 className="w-3 h-3"/>} onClick={() => removeEntry(sectionId, entry.id)}>Delete</Button>
          </div>
      </div>
  );

  const renderCustomForm = (entry: CustomEntry, sectionId: string) => (
      <div className="mb-4 bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="mb-4 space-y-3">
            {entry.fields.map((field) => (
                <div key={field.id} className="p-3 bg-white rounded border border-gray-100 shadow-sm relative group">
                    <div className="flex gap-2 mb-2">
                        <Input 
                            placeholder="Field Label" 
                            value={field.label}
                            className="flex-1 font-medium"
                            onChange={e => updateCustomEntryField(sectionId, entry.id, field.id, { label: e.target.value })}
                        />
                         <select
                            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none bg-white"
                            value={field.type}
                            onChange={e => updateCustomEntryField(sectionId, entry.id, field.id, { type: e.target.value as any, value: e.target.value === 'bullets' ? [] : '' })}
                        >
                            <option value="text">Text</option>
                            <option value="date">Date</option>
                            <option value="url">URL</option>
                            <option value="bullets">Bullets</option>
                        </select>
                        <button 
                            type="button"
                            onClick={() => removeCustomField(sectionId, entry.id, field.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {field.type === 'bullets' ? (
                        <TextArea 
                            placeholder="List items (one per line)"
                            value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                            onChange={e => updateCustomEntryField(sectionId, entry.id, field.id, { value: e.target.value.split('\n') })}
                            rows={3}
                        />
                    ) : (
                        <Input 
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            value={field.value as string}
                            onChange={e => updateCustomEntryField(sectionId, entry.id, field.id, { value: e.target.value })}
                        />
                    )}
                </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
              <Button variant="ghost" size="sm" onClick={() => addCustomField(sectionId, entry.id)} icon={<Plus className="w-3 h-3"/>} className="text-blue-600 hover:text-blue-700">
                  Add Field
              </Button>
              <Button variant="danger" size="sm" icon={<Trash2 className="w-3 h-3"/>} onClick={() => removeEntry(sectionId, entry.id)}>Delete Entry</Button>
          </div>
      </div>
  );

  return (
    <>
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Editor</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Personal Info Section */}
            <div className={`p-4 rounded-lg border transition-all ${activeSection === 'personal' ? 'ring-2 ring-blue-500 border-transparent bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}`}>
                <h3 
                    className="text-md font-bold mb-4 flex items-center cursor-pointer justify-between"
                    onClick={() => setActiveSection('personal')}
                >
                    <span>Personal Information</span>
                </h3>
                
                {activeSection === 'personal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                        <Input label="Full Name" value={data.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} />
                        <Input label="Email" value={data.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} />
                        <Input label="Phone" value={data.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} />
                        <Input label="Location" value={data.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} />
                        <Input label="LinkedIn" value={data.personalInfo.linkedIn || ''} onChange={e => updatePersonalInfo('linkedIn', e.target.value)} />
                        <Input label="Portfolio" value={data.personalInfo.portfolio || ''} onChange={e => updatePersonalInfo('portfolio', e.target.value)} />
                        <div className="col-span-2">
                            <TextArea label="Professional Summary" rows={4} value={data.personalInfo.summary} onChange={e => updatePersonalInfo('summary', e.target.value)} />
                            <p className="text-xs text-gray-500 mt-1">💡 Tip: Use **text** to highlight keywords (e.g., **5+ years**, **React**)</p>
                        </div>
                        {/* Heading Color Picker */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Heading Color</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { color: '#2563eb', name: 'Blue' },
                                    { color: '#16a34a', name: 'Green' },
                                    { color: '#dc2626', name: 'Red' },
                                    { color: '#9333ea', name: 'Purple' },
                                    { color: '#ea580c', name: 'Orange' },
                                    { color: '#0891b2', name: 'Cyan' },
                                    { color: '#4b5563', name: 'Gray' },
                                    { color: '#000000', name: 'Black' },
                                ].map(({ color, name }) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => onChange({ ...data, headingColor: color, colorAccent: color })}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${(data.headingColor || data.colorAccent) === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'border-gray-300 hover:scale-105'}`}
                                        style={{ backgroundColor: color }}
                                        title={name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Dynamic Sections */}
            <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sections</h3>
                {data.sectionOrder.map((sectionId, index) => {
                    const section = data.sections.find(s => s.id === sectionId);
                    if (!section) return null;

                    return (
                        <div key={sectionId}>
                            {renderSectionHeader(sectionId, section.title, index, section.isCustom)}
                            
                            {activeSection === sectionId && (
                                <div className="pl-4 border-l-2 border-blue-100 mb-6">
                                    <div className="mb-4">
                                        {/* Render entries based on type */}
                                        {section.type === 'experience' && section.entries.map((entry) => (
                                            <React.Fragment key={entry.id}>
                                                {renderExperienceForm(entry as ExperienceEntry, sectionId)}
                                            </React.Fragment>
                                        ))}

                                        {section.type === 'education' && section.entries.map((entry: any) => (
                                             <div key={entry.id} className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                                                <Input label="Institution" value={entry.institution} onChange={e => updateSectionEntry(sectionId, entry.id, 'institution', e.target.value)} />
                                                <Input label="Degree" value={entry.degree} onChange={e => updateSectionEntry(sectionId, entry.id, 'degree', e.target.value)} />
                                                <Input label="Field of Study" value={entry.fieldOfStudy} onChange={e => updateSectionEntry(sectionId, entry.id, 'fieldOfStudy', e.target.value)} />
                                                <Input label="Graduation Date" value={entry.graduationDate} onChange={e => updateSectionEntry(sectionId, entry.id, 'graduationDate', e.target.value)} />
                                                <div className="flex flex-col">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Type</label>
                                                    <select
                                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
                                                        value={entry.gradeType || 'CGPA'}
                                                        onChange={e => updateSectionEntry(sectionId, entry.id, 'gradeType', e.target.value)}
                                                    >
                                                        <option value="CGPA">CGPA</option>
                                                        <option value="Percentage">Percentage</option>
                                                        <option value="GPA">GPA</option>
                                                    </select>
                                                </div>
                                                <Input label={entry.gradeType || 'CGPA'} value={entry.gpa || ''} onChange={e => updateSectionEntry(sectionId, entry.id, 'gpa', e.target.value)} />
                                                <div className="col-span-2 flex justify-end">
                                                    <Button variant="danger" size="sm" icon={<Trash2 className="w-3 h-3"/>} onClick={() => removeEntry(sectionId, entry.id)}>Delete</Button>
                                                </div>
                                             </div>
                                        ))}

                                        {section.type === 'skills' && section.entries.map((entry: any) => (
                                            <div key={entry.id} className="mb-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                                                <Input label="Category" className="mb-2" value={entry.category} onChange={e => updateSectionEntry(sectionId, entry.id, 'category', e.target.value)} />
                                                <TextArea label="Skills (comma separated)" value={entry.skills.join(', ')} onChange={e => updateSectionEntry(sectionId, entry.id, 'skills', e.target.value)} />
                                                <div className="flex justify-end mt-2">
                                                    <Button variant="danger" size="sm" icon={<Trash2 className="w-3 h-3"/>} onClick={() => removeEntry(sectionId, entry.id)}>Delete</Button>
                                                </div>
                                            </div>
                                        ))}
                                         
                                        {section.type === 'projects' && section.entries.map((entry: any) => (
                                             <div key={entry.id} className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                                                <Input label="Project Name" value={entry.name} onChange={e => updateSectionEntry(sectionId, entry.id, 'name', e.target.value)} />
                                                <Input label="URL" value={entry.url || ''} onChange={e => updateSectionEntry(sectionId, entry.id, 'url', e.target.value)} />
                                                <div className="col-span-2">
                                                    <TextArea label="Description" value={entry.description} onChange={e => updateSectionEntry(sectionId, entry.id, 'description', e.target.value)} />
                                                </div>
                                                 <div className="col-span-2">
                                                    <Input label="Technologies (comma separated)" value={entry.technologies.join(', ')} onChange={e => updateSectionEntry(sectionId, entry.id, 'technologies', e.target.value)} />
                                                </div>
                                                <div className="col-span-2 flex justify-end">
                                                    <Button variant="danger" size="sm" icon={<Trash2 className="w-3 h-3"/>} onClick={() => removeEntry(sectionId, entry.id)}>Delete</Button>
                                                </div>
                                             </div>
                                        ))}

                                        {section.type === 'custom' && section.entries.map((entry: any) => (
                                            <React.Fragment key={entry.id}>
                                                {renderCustomForm(entry as CustomEntry, sectionId)}
                                            </React.Fragment>
                                        ))}

                                    </div>
                                    <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4"/>} onClick={() => addEntry(sectionId)}>
                                        Add {section.title.slice(0, -1) || 'Entry'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add New Section UI */}
                <div className="pt-4 border-t border-gray-100 mt-6">
                    {!isAddingSection ? (
                        <button
                            onClick={() => setIsAddingSection(true)}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center font-medium"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Custom Section
                        </button>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Add New Section</h4>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Section Title (e.g., Volunteering)" 
                                    value={newSectionTitle}
                                    onChange={e => setNewSectionTitle(e.target.value)}
                                    autoFocus
                                />
                                <Button onClick={handleAddSection} disabled={!newSectionTitle.trim()}>
                                    Add
                                </Button>
                                <Button variant="ghost" onClick={() => setIsAddingSection(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    
    {/* Delete Confirmation Modal */}
    {sectionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 transform transition-all scale-100">
                <div className="flex items-center space-x-3 mb-4 text-amber-600">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-gray-900">Delete Section?</h3>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this section? This action cannot be undone and all data in this section will be lost.
                </p>
                <div className="flex justify-end space-x-3">
                    <Button variant="ghost" onClick={cancelDeleteSection}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteSection}>
                        Delete Section
                    </Button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};