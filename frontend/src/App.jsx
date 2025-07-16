import React, { useState } from "react";
import "./index.css";

function SectionList({ title, items, onAdd, onEdit, onDelete, renderItem, addLabel, emptyLabel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({});
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setForm(items[idx]);
  };
  const handleSave = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      onEdit(editingIndex, form);
      setEditingIndex(null);
      setForm({});
    } else {
      onAdd(form);
      setForm({});
    }
  };
  const handleCancel = () => {
    setEditingIndex(null);
    setForm({});
  };
  return (
    <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
      <legend style={{ fontWeight: 'bold', color: '#22223b' }}>{title}</legend>
      <ul style={{ padding: 0, listStyle: 'none', marginBottom: '1rem' }}>
        {items.length === 0 && <li style={{ color: '#888' }}>{emptyLabel}</li>}
        {items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem', background: '#f3f4fa', padding: '0.5rem', borderRadius: '6px' }}>
            {editingIndex === idx ? (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f7f7fa 100%)' }}>
      {/* Left: Resume Form */}
      <div style={{ width: '420px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px #e0e7ff', padding: '2rem', margin: '2rem 1rem', minHeight: '80vh', overflowY: 'auto', maxHeight: '90vh' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#3b5bdb', marginBottom: '1.5rem' }}>Resume Builder</h2>
        <form autoComplete="off">
          <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
            <legend style={{ fontWeight: 'bold', color: '#22223b' }}>Personal Info</legend>
            <input name="name" placeholder="Full Name" value={resume.personalInfo.name} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <input name="email" placeholder="Email" value={resume.personalInfo.email} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <input name="phone" placeholder="Phone" value={resume.personalInfo.phone} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <input name="linkedin" placeholder="LinkedIn" value={resume.personalInfo.linkedin} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <input name="github" placeholder="GitHub" value={resume.personalInfo.github} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
          </fieldset>
          <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
            <legend style={{ fontWeight: 'bold', color: '#22223b' }}>Summary</legend>
            <textarea placeholder="Short objective or bio" value={resume.summary} onChange={handleSummaryChange} style={{ width: '100%', minHeight: '60px', margin: '8px 0', padding: '8px' }} />
          </fieldset>
          <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
            <legend style={{ fontWeight: 'bold', color: '#22223b' }}>Skills</legend>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input type="text" placeholder="Add a skill" value={skillInput} onChange={handleSkillInput} style={{ flex: 1, padding: '8px' }} />
              <button onClick={handleAddSkill} style={{ padding: '8px 12px', background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {resume.skills.map((skill) => (
                <span key={skill} style={{ background: '#e0e7ff', color: '#3b5bdb', padding: '4px 10px', borderRadius: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} style={{ marginLeft: '6px', background: 'none', border: 'none', color: '#3b5bdb', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
                </span>
              ))}
            </div>
          </fieldset>

          {/* Experience Section */}
          <SectionList
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
                  <strong>{item.role}</strong> at <strong>{item.company}</strong> ({item.duration})<br />
                  <span style={{ color: '#555', fontSize: '0.95em' }}>{Array.isArray(item.details) ? item.details.join(", ") : item.details}</span>
                </>
              )
            }
          />

          {/* Projects Section */}
          <SectionList
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
                  <textarea name="description" placeholder="Description" value={item.description || ""} onChange={onChange} style={{ padding: '6px' }} />
                </>
              ) : (
                <>
                  <strong>{item.title}</strong> {item.link && (<a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b5bdb', marginLeft: 4, fontSize: '0.95em' }}>[link]</a>)}<br />
                  <span style={{ color: '#555', fontSize: '0.95em' }}>{item.description}</span>
                </>
              )
            }
          />

          {/* Education Section */}
          <SectionList
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
                  <strong>{item.degree}</strong> at <strong>{item.institution}</strong> ({item.year})<br />
                  <span style={{ color: '#555', fontSize: '0.95em' }}>CGPA: {item.cgpa}</span>
                </>
              )
            }
          />

          {/* Certifications Section */}
          <SectionList
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
                <span>{item.name}</span>
              )
            }
          />

          {/* Custom Sections */}
          <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
            <legend style={{ fontWeight: 'bold', color: '#22223b' }}>Custom Sections</legend>
            <form onSubmit={handleAddCustomSection} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <input type="text" placeholder="Section Title" value={customSectionTitle} onChange={e => setCustomSectionTitle(e.target.value)} style={{ flex: 1, padding: '6px' }} />
              <input type="text" placeholder="Item (optional)" value={customSectionItem} onChange={e => setCustomSectionItem(e.target.value)} style={{ flex: 1, padding: '6px' }} />
              <button type="submit" style={{ background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Add</button>
            </form>
            <ul style={{ padding: 0, listStyle: 'none' }}>
              {resume.customSections.length === 0 && <li style={{ color: '#888' }}>No custom sections added.</li>}
              {resume.customSections.map((section, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', background: '#f3f4fa', padding: '0.5rem', borderRadius: '6px' }}>
                  <strong>{section.title}</strong>
                  {section.items && section.items.length > 0 && (
                    <ul style={{ paddingLeft: '1.2em', margin: 0 }}>
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </fieldset>
        </form>
      </div>
      {/* Right: Live Preview */}
      <div style={{ flex: 1, background: '#f7f7fa', borderRadius: '12px', boxShadow: '0 2px 16px #e0e7ff', padding: '2rem', margin: '2rem 1rem', minHeight: '80vh', overflowY: 'auto', maxHeight: '90vh' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#3b5bdb', marginBottom: '1.5rem' }}>Live Preview</h2>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', minHeight: '60vh', boxShadow: '0 1px 8px #e0e7ff' }}>
          <h1 style={{ fontSize: '2rem', color: '#3b5bdb', marginBottom: '0.5rem' }}>{resume.personalInfo.name || 'Your Name'}</h1>
          <div style={{ color: '#666', marginBottom: '0.5rem' }}>
            {resume.personalInfo.email && <span>{resume.personalInfo.email} | </span>}
            {resume.personalInfo.phone && <span>{resume.personalInfo.phone} | </span>}
            {resume.personalInfo.linkedin && <span>LinkedIn: {resume.personalInfo.linkedin} | </span>}
            {resume.personalInfo.github && <span>GitHub: {resume.personalInfo.github}</span>}
          </div>
          {resume.summary && <p style={{ margin: '1rem 0', color: '#222' }}>{resume.summary}</p>}
          {resume.skills.length > 0 && (
            <div style={{ margin: '1rem 0' }}>
              <strong>Skills:</strong>
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
                {resume.skills.map((skill) => (
                  <li key={skill} style={{ background: '#e0e7ff', color: '#3b5bdb', padding: '4px 10px', borderRadius: '12px', fontSize: '0.95rem' }}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Experience Preview */}
          {resume.experience.length > 0 && (
            <div style={{ margin: '1.5rem 0' }}>
              <strong>Experience:</strong>
              <ul style={{ paddingLeft: '1.2em', margin: 0 }}>
                {resume.experience.map((exp, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{exp.role}</span> at <span style={{ fontWeight: 'bold' }}>{exp.company}</span> ({exp.duration})<br />
                    <span style={{ color: '#555', fontSize: '0.95em' }}>{Array.isArray(exp.details) ? exp.details.join(", ") : exp.details}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Projects Preview */}
          {resume.projects.length > 0 && (
            <div style={{ margin: '1.5rem 0' }}>
              <strong>Projects:</strong>
              <ul style={{ paddingLeft: '1.2em', margin: 0 }}>
                {resume.projects.map((proj, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{proj.title}</span> {proj.link && (<a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b5bdb', marginLeft: 4, fontSize: '0.95em' }}>[link]</a>)}<br />
                    <span style={{ color: '#555', fontSize: '0.95em' }}>{proj.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Education Preview */}
          {resume.education.length > 0 && (
            <div style={{ margin: '1.5rem 0' }}>
              <strong>Education:</strong>
              <ul style={{ paddingLeft: '1.2em', margin: 0 }}>
                {resume.education.map((edu, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{edu.degree}</span> at <span style={{ fontWeight: 'bold' }}>{edu.institution}</span> ({edu.year})<br />
                    <span style={{ color: '#555', fontSize: '0.95em' }}>CGPA: {edu.cgpa}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Certifications Preview */}
          {resume.certifications.length > 0 && (
            <div style={{ margin: '1.5rem 0' }}>
              <strong>Certifications:</strong>
              <ul style={{ paddingLeft: '1.2em', margin: 0 }}>
                {resume.certifications.map((cert, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{cert.name}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Custom Sections Preview */}
          {resume.customSections.length > 0 && resume.customSections.map((section, idx) => (
            <div key={idx} style={{ margin: '1.5rem 0' }}>
              <strong>{section.title}:</strong>
              <ul style={{ paddingLeft: '1.2em', margin: 0 }}>
                {section.items && section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
