import React, { useState, useRef } from "react";
import "./index.css";

// Helper: initial form state per section
const initialForms = {
  experience: { company: '', role: '', duration: '', details: '' },
  projects: { title: '', link: '', description: '' },
  education: { degree: '', institution: '', year: '', cgpa: '' },
  certifications: { name: '' },
};

function SectionList({ sectionKey, title, items, onAdd, onEdit, onDelete, renderItem, addLabel, emptyLabel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState(initialForms[sectionKey] || {});
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setForm(items[idx]);
  };
  const handleEditSave = (e) => {
    e.preventDefault();
    onEdit(editingIndex, form);
    setEditingIndex(null);
    setForm(initialForms[sectionKey] || {});
  };
  const handleAddSave = (e) => {
    e.preventDefault();
    // Only add if at least one field is filled
    const hasValue = Object.values(form).some(v => v && v.trim() !== '');
    if (hasValue) {
      onAdd(form);
      setForm(initialForms[sectionKey] || {});
    }
  };
  const handleCancel = () => {
    setEditingIndex(null);
    setForm(initialForms[sectionKey] || {});
  };
  return (
    <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
      <legend style={{ fontWeight: 'bold', color: '#111', fontSize: '1.15rem', letterSpacing: '0.5px' }}>{title}</legend>
      <ul style={{ padding: 0, listStyle: 'none', marginBottom: '1rem' }}>
        {items.length === 0 && <li style={{ color: '#888' }}>{emptyLabel}</li>}
        {items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem', background: '#f3f4fa', padding: '0.5rem', borderRadius: '6px' }}>
            {editingIndex === idx ? (
              <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {renderItem(form, handleChange)}
                <div>
                  <button type="submit" style={{ marginRight: 8, background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Save</button>
                  <button type="button" onClick={handleCancel} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>{renderItem(item)}</div>
                <div>
                  <button onClick={() => handleEdit(idx)} style={{ marginRight: 8, background: '#e0e7ff', color: '#3b5bdb', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => onDelete(idx)} style={{ background: '#ffb4b4', color: '#b91c1c', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {editingIndex === null && (
        <form onSubmit={handleAddSave} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {renderItem(form, handleChange)}
          <button type="submit" style={{ background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', alignSelf: 'flex-start' }}>{addLabel}</button>
        </form>
      )}
    </fieldset>
  );
}

function App() {
  // Resume state
  const [resume, setResume] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
    },
    summary: "",
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    customSections: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [customSectionTitle, setCustomSectionTitle] = useState("");
  const [customSectionItem, setCustomSectionItem] = useState("");
  const previewRef = useRef();

  // Handlers for basic fields
  const handlePersonalInfoChange = (e) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [e.target.name]: e.target.value,
      },
    });
  };
  const handleSummaryChange = (e) => {
    setResume({ ...resume, summary: e.target.value });
  };
  const handleSkillInput = (e) => setSkillInput(e.target.value);
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !resume.skills.includes(skillInput.trim())) {
      setResume({ ...resume, skills: [...resume.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };
  const handleRemoveSkill = (skill) => {
    setResume({ ...resume, skills: resume.skills.filter((s) => s !== skill) });
  };

  // Section handlers
  const addSectionItem = (section, item) => setResume({ ...resume, [section]: [...resume[section], item] });
  const editSectionItem = (section, idx, item) => setResume({ ...resume, [section]: resume[section].map((it, i) => (i === idx ? item : it)) });
  const deleteSectionItem = (section, idx) => setResume({ ...resume, [section]: resume[section].filter((_, i) => i !== idx) });

  // Custom section handlers
  const handleAddCustomSection = (e) => {
    e.preventDefault();
    if (customSectionTitle.trim()) {
      setResume({
        ...resume,
        customSections: [...resume.customSections, { title: customSectionTitle, items: [customSectionItem].filter(Boolean) }],
      });
      setCustomSectionTitle("");
      setCustomSectionItem("");
    }
  };

  // PDF Download
  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf(previewRef.current, {
      margin: 0.5,
      filename: `${resume.personalInfo.name || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
  };

  // ATS-friendly preview styles
  const sectionHeader = { fontWeight: 700, fontSize: '1.1rem', color: '#111', borderBottom: '1px solid #bbb', margin: '1.2em 0 0.5em 0', letterSpacing: '0.5px' };
  const label = { fontWeight: 700, color: '#111' };
  const dateStyle = { float: 'right', color: '#444', fontSize: '0.98rem', fontWeight: 400 };
  const bulletList = { margin: '0.2em 0 0.7em 1.2em', padding: 0, color: '#222', fontSize: '1.01rem' };
  const bullet = { marginBottom: '0.2em', listStyle: 'disc' };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f7f7fa 100%)' }}>
      {/* Left: Resume Form */}
      <div style={{ width: '420px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px #e0e7ff', padding: '2rem', margin: '2rem 1rem', minHeight: '80vh', overflowY: 'auto', maxHeight: '90vh' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#111', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '0.5px' }}>Resume Builder</h2>
        <form autoComplete="off" onSubmit={e => e.preventDefault()}>
          {/* ... Personal Info, Summary, Skills ... */}
          <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
            <legend style={{ fontWeight: 'bold', color: '#111', fontSize: '1.15rem', letterSpacing: '0.5px' }}>Personal Info</legend>
            <input name="name" placeholder="Full Name" value={resume.personalInfo.name} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <input name="email" placeholder="Email" value={resume.personalInfo.email} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <input name="phone" placeholder="Phone" value={resume.personalInfo.phone} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <input name="linkedin" placeholder="LinkedIn" value={resume.personalInfo.linkedin} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <input name="github" placeholder="GitHub" value={resume.personalInfo.github} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
          </fieldset>
          <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
            <legend style={{ fontWeight: 'bold', color: '#111', fontSize: '1.15rem', letterSpacing: '0.5px' }}>Summary</legend>
            <textarea placeholder="Short objective or bio" value={resume.summary} onChange={handleSummaryChange} style={{ width: '100%', minHeight: '60px', margin: '8px 0', padding: '8px' }} />
          </fieldset>
          <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
            <legend style={{ fontWeight: 'bold', color: '#111', fontSize: '1.15rem', letterSpacing: '0.5px' }}>Skills</legend>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input type="text" placeholder="Add a skill" value={skillInput} onChange={handleSkillInput} style={{ flex: 1, padding: '8px' }} />
              <button onClick={handleAddSkill} style={{ padding: '8px 12px', background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {resume.skills.map((skill) => (
                <span key={skill} style={{ background: '#e0e7ff', color: '#111', padding: '4px 10px', borderRadius: '12px', fontSize: '0.98rem', display: 'flex', alignItems: 'center' }}>
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} style={{ marginLeft: '6px', background: 'none', border: 'none', color: '#111', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
                </span>
              ))}
            </div>
          </fieldset>

          {/* Experience Section */}
          <SectionList
            sectionKey="experience"
            title="Experience"
            items={resume.experience}
            onAdd={(item) => addSectionItem("experience", item)}
            onEdit={(idx, item) => editSectionItem("experience", idx, item)}
            onDelete={(idx) => deleteSectionItem("experience", idx)}
            addLabel="Add Experience"
            emptyLabel="No experience added."
            renderItem={(item = {}, onChange) =>
              onChange ? (
                <>
                  <input name="company" placeholder="Company" value={item.company || ""} onChange={onChange} style={{ padding: '6px' }} />
                  <input name="role" placeholder="Role" value={item.role || ""} onChange={onChange} style={{ padding: '6px' }} />
                  <input name="duration" placeholder="Duration" value={item.duration || ""} onChange={onChange} style={{ padding: '6px' }} />
                  <textarea name="details" placeholder="Details (comma separated)" value={item.details || ""} onChange={onChange} style={{ padding: '6px' }} />
                </>
              ) : (
                <>
                    <span style={label}>{item.role}</span> at <span style={label}>{item.company}</span>
                    <span style={dateStyle}>{item.duration}</span>
                    <ul style={bulletList}>
                      {(item.details || '').split(',').map((d, i) => d.trim() && <li key={i} style={bullet}>{d.trim()}</li>)}
                    </ul>
                </>
              )
            }
          />

          {/* Projects Section */}
          <SectionList
            sectionKey="projects"
            title="Projects"
            items={resume.projects}
            onAdd={(item) => addSectionItem("projects", item)}
            onEdit={(idx, item) => editSectionItem("projects", idx, item)}
            onDelete={(idx) => deleteSectionItem("projects", idx)}
            addLabel="Add Project"
            emptyLabel="No projects added."
            renderItem={(item = {}, onChange) =>
              onChange ? (
                <>
                  <input name="title" placeholder="Title" value={item.title || ""} onChange={onChange} style={{ padding: '6px' }} />
                  <input name="link" placeholder="Link" value={item.link || ""} onChange={onChange} style={{ padding: '6px' }} />
                  <textarea name="description" placeholder="Description (comma separated for bullets)" value={item.description || ""} onChange={onChange} style={{ padding: '6px' }} />
                </>
              ) : (
                <>
                    <span style={label}>{item.title}</span> {item.link && (<a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b5bdb', marginLeft: 4, fontSize: '0.95em' }}>[link]</a>)}
                    <ul style={bulletList}>
                      {(item.description || '').split(',').map((d, i) => d.trim() && <li key={i} style={bullet}>{d.trim()}</li>)}
                    </ul>
                </>
              )
            }
          />

          {/* Education Section */}
          <SectionList
            sectionKey="education"
            title="Education"
            items={resume.education}
            onAdd={(item) => addSectionItem("education", item)}
            onEdit={(idx, item) => editSectionItem("education", idx, item)}
            onDelete={(idx) => deleteSectionItem("education", idx)}
            addLabel="Add Education"
            emptyLabel="No education added."
            renderItem={(item = {}, onChange) =>
              onChange ? (
                <>
                  <input name="degree" placeholder="Degree" value={item.degree || ""} onChange={onChange} style={{ padding: '6px' }} />
                  <input name="institution" placeholder="Institution" value={item.institution || ""} onChange={onChange} style={{ padding: '6px' }} />
                  <input name="year" placeholder="Year" value={item.year || ""} onChange={onChange} style={{ padding: '6px' }} />
                  <input name="cgpa" placeholder="CGPA" value={item.cgpa || ""} onChange={onChange} style={{ padding: '6px' }} />
                </>
              ) : (
                <>
                    <span style={label}>{item.degree}</span> at <span style={label}>{item.institution}</span>
                    <span style={dateStyle}>{item.year}</span>
                    <span style={{ color: '#555', fontSize: '0.98em', marginLeft: 8 }}>CGPA: {item.cgpa}</span>
                </>
              )
            }
          />

          {/* Certifications Section */}
          <SectionList
            sectionKey="certifications"
            title="Certifications"
            items={resume.certifications}
            onAdd={(item) => addSectionItem("certifications", item.name ? item : { name: item })}
            onEdit={(idx, item) => editSectionItem("certifications", idx, item.name ? item : { name: item })}
            onDelete={(idx) => deleteSectionItem("certifications", idx)}
            addLabel="Add Certification"
            emptyLabel="No certifications added."
            renderItem={(item = {}, onChange) =>
              onChange ? (
                <input name="name" placeholder="Certification" value={item.name || ""} onChange={onChange} style={{ padding: '6px' }} />
              ) : (
                  <span style={label}>{item.name}</span>
              )
            }
          />

          {/* Custom Sections */}
          <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
            <legend style={{ fontWeight: 'bold', color: '#111', fontSize: '1.15rem', letterSpacing: '0.5px' }}>Custom Sections</legend>
            <form onSubmit={handleAddCustomSection} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <input type="text" placeholder="Section Title" value={customSectionTitle} onChange={e => setCustomSectionTitle(e.target.value)} style={{ flex: 1, padding: '6px' }} />
              <input type="text" placeholder="Item (optional)" value={customSectionItem} onChange={e => setCustomSectionItem(e.target.value)} style={{ flex: 1, padding: '6px' }} />
              <button type="submit" style={{ background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Add</button>
            </form>
            <ul style={{ padding: 0, listStyle: 'none' }}>
              {resume.customSections.length === 0 && <li style={{ color: '#888' }}>No custom sections added.</li>}
              {resume.customSections.map((section, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', background: '#f3f4fa', padding: '0.5rem', borderRadius: '6px' }}>
                  <span style={label}>{section.title}</span>
                  {section.items && section.items.length > 0 && (
                    <ul style={bulletList}>
                      {section.items.map((item, i) => (
                        <li key={i} style={bullet}>{item}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </fieldset>
        </form>
      </div>
      {/* Right: ATS Resume Preview */}
      <div style={{ flex: 1, background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px #e0e7ff', padding: '2.5rem 2.5rem 2rem 2.5rem', margin: '2rem 1rem', minHeight: '80vh', overflowY: 'auto', maxHeight: '90vh', fontFamily: 'Arial, Helvetica, sans-serif', color: '#111' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.7rem', color: '#111', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>{resume.personalInfo.name || 'Your Name'}</h1>
          <button onClick={handleDownloadPDF} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>Download PDF</button>
        </div>
        <div style={{ fontSize: '1.01rem', marginBottom: '0.7rem' }}>
          {resume.personalInfo.email && <span>{resume.personalInfo.email} | </span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone} | </span>}
          {resume.personalInfo.linkedin && <span>LinkedIn: {resume.personalInfo.linkedin} | </span>}
          {resume.personalInfo.github && <span>GitHub: {resume.personalInfo.github}</span>}
        </div>
        {resume.summary && <div style={{ margin: '0.7em 0 1.2em 0', color: '#222', fontSize: '1.05rem' }}>{resume.summary}</div>}
        {/* Education */}
        {resume.education.length > 0 && <div><div style={sectionHeader}>EDUCATION</div>
          {resume.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '0.5em', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={label}>{edu.institution}</span> - {edu.degree}
              </div>
              <div style={dateStyle}>{edu.year}{edu.cgpa && ` | CGPA: ${edu.cgpa}`}</div>
            </div>
          ))}
        </div>}
        {/* Skills */}
        {resume.skills.length > 0 && <div><div style={sectionHeader}>SKILLS</div>
          <div style={{ margin: '0.2em 0 0.7em 0', color: '#222', fontSize: '1.01rem' }}>{resume.skills.join(', ')}</div>
        </div>}
        {/* Experience */}
        {resume.experience.length > 0 && <div><div style={sectionHeader}>EXPERIENCE</div>
          {resume.experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '0.5em' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={label}>{exp.role}</span> <span style={dateStyle}>{exp.duration}</span>
              </div>
              <div style={{ fontWeight: 500 }}>{exp.company}</div>
              <ul style={bulletList}>
                {(exp.details || '').split(',').map((d, i) => d.trim() && <li key={i} style={bullet}>{d.trim()}</li>)}
              </ul>
            </div>
          ))}
        </div>}
        {/* Projects */}
        {resume.projects.length > 0 && <div><div style={sectionHeader}>PROJECTS</div>
          {resume.projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: '0.5em' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={label}>{proj.title}</span> {proj.link && (<a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b5bdb', marginLeft: 4, fontSize: '0.95em' }}>[GitHub]</a>)}
              </div>
              <ul style={bulletList}>
                {(proj.description || '').split(',').map((d, i) => d.trim() && <li key={i} style={bullet}>{d.trim()}</li>)}
              </ul>
            </div>
          ))}
        </div>}
        {/* Certifications */}
        {resume.certifications.length > 0 && <div><div style={sectionHeader}>CERTIFICATIONS</div>
          <ul style={bulletList}>
            {resume.certifications.map((cert, idx) => <li key={idx} style={bullet}>{cert.name}</li>)}
          </ul>
        </div>}
        {/* Custom Sections */}
        {resume.customSections.length > 0 && resume.customSections.map((section, idx) => (
          <div key={idx}><div style={sectionHeader}>{section.title.toUpperCase()}</div>
            <ul style={bulletList}>
              {section.items && section.items.map((item, i) => <li key={i} style={bullet}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
