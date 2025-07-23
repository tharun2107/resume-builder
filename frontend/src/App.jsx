import React, { useState, useRef } from "react";
import "./index.css";

const initialForms = {
  experience: { company: '', role: '', duration: '', details: [''] },
  projects: { title: '', link: '', description: [''] },
  education: { degree: '', institution: '', year: '', cgpa: '' },
  certifications: { name: '' },
  achievements: { point: '' },
  hobbies: { point: '' },
};

function PointsInput({ points, setPoints }) {
  const handleChange = (i, v) => {
    const newPoints = [...points];
    newPoints[i] = v;
    setPoints(newPoints);
  };
  const handleAdd = () => setPoints([...points, '']);
  const handleRemove = (i) => setPoints(points.filter((_, idx) => idx !== i));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {points.map((pt, i) => (
        <div key={i} style={{ display: 'flex', gap: 4 }}>
          <input value={pt} onChange={e => handleChange(i, e.target.value)} style={{ flex: 1, padding: '6px' }} />
          {points.length > 1 && <button type="button" onClick={() => handleRemove(i)} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>-</button>}
        </div>
      ))}
      <button type="button" onClick={handleAdd} style={{ background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', marginTop: 2, alignSelf: 'flex-start' }}>Add Point</button>
    </div>
  );
}

function SectionList({ sectionKey, title, items, onAdd, onEdit, onDelete, renderItem, addLabel, emptyLabel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState(initialForms[sectionKey] || {});
  const [points, setPoints] = useState(form.description || form.details || ['']);
  React.useEffect(() => {
    if (editingIndex !== null) {
      setForm(items[editingIndex]);
      setPoints(items[editingIndex].description || items[editingIndex].details || ['']);
    } else {
      setForm(initialForms[sectionKey] || {});
      setPoints(['']);
    }
    // eslint-disable-next-line
  }, [editingIndex]);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEdit = (idx) => setEditingIndex(idx);
  const handleEditSave = (e) => {
    e.preventDefault();
    let updated = { ...form };
    if (sectionKey === 'projects') updated.description = points;
    else if (sectionKey === 'experience') updated.details = points;
    else if (sectionKey === 'achievements' || sectionKey === 'hobbies') updated.point = points;
    onEdit(editingIndex, updated);
    setEditingIndex(null);
    setForm(initialForms[sectionKey] || {});
    setPoints(['']);
  };
  const handleAddSave = (e) => {
    e.preventDefault();
    let toAdd = { ...form };
    if (sectionKey === 'projects') toAdd.description = points;
    else if (sectionKey === 'experience') toAdd.details = points;
    else if (sectionKey === 'achievements' || sectionKey === 'hobbies') toAdd.point = points;
    const hasValue = Object.values(toAdd).some(v => Array.isArray(v) ? v.some(x => x && x.trim() !== '') : v && v.trim() !== '');
    if (hasValue) {
      onAdd(toAdd);
      setForm(initialForms[sectionKey] || {});
      setPoints(['']);
    }
  };
  const handleCancel = () => {
    setEditingIndex(null);
    setForm(initialForms[sectionKey] || {});
    setPoints(['']);
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
                {renderItem(form, handleChange, points, setPoints)}
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
          {renderItem(form, handleChange, points, setPoints)}
          <button type="submit" style={{ background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', alignSelf: 'flex-start' }}>{addLabel}</button>
        </form>
      )}
    </fieldset>
  );
}

function App() {
  const [resume, setResume] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      portfolio: "",
      leetcode: "",
    },
    summary: "",
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    hobbies: [],
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

  // Achievements/Hobbies handlers
  const addPointSection = (section, points) => setResume({ ...resume, [section]: [...resume[section], ...points.filter(p => p && p.trim() !== '').map(point => ({ point }))] });
  const editPointSection = (section, idx, item) => setResume({ ...resume, [section]: resume[section].map((it, i) => (i === idx ? item : it)) });
  const deletePointSection = (section, idx) => setResume({ ...resume, [section]: resume[section].filter((_, i) => i !== idx) });

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

  // PDF Download (robust)
  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    if (previewRef.current) {
      html2pdf().from(previewRef.current).set({
        margin: 0.5,
        filename: `${resume.personalInfo.name || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      }).save();
    } else {
      alert("Preview not found!");
    }
  };

  // ATS-friendly preview styles
  const sectionHeader = { fontWeight: 700, fontSize: '1.1rem', color: '#111', borderBottom: '1px solid #bbb', margin: '1.2em 0 0.5em 0', letterSpacing: '0.5px' };
  const label = { fontWeight: 700, color: '#111' };
  const dateStyle = { float: 'right', color: '#444', fontSize: '0.98rem', fontWeight: 400 };
  const bulletList = { margin: '0.2em 0 0.7em 1.2em', padding: 0, color: '#222', fontSize: '1.01rem' };
  const bullet = { marginBottom: '0.2em', listStyle: 'disc' };
  const contactLink = { color: '#0645AD', textDecoration: 'underline', margin: '0 0.3em' };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f7f7fa 100%)' }}>
      {/* Left: Resume Form */}
      <div style={{ width: '420px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px #e0e7ff', padding: '2rem', margin: '2rem 1rem', minHeight: '80vh', overflowY: 'auto', maxHeight: '90vh' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#111', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '0.5px' }}>Resume Builder</h2>
        <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
          <legend style={{ fontWeight: 'bold', color: '#111', fontSize: '1.15rem', letterSpacing: '0.5px' }}>Personal Info</legend>
          <input name="name" placeholder="Full Name" value={resume.personalInfo.name} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
          <input name="email" placeholder="Email" value={resume.personalInfo.email} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
          <input name="phone" placeholder="Phone" value={resume.personalInfo.phone} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
          <input name="linkedin" placeholder="LinkedIn" value={resume.personalInfo.linkedin} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
          <input name="github" placeholder="GitHub" value={resume.personalInfo.github} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
          <input name="portfolio" placeholder="Portfolio" value={resume.personalInfo.portfolio} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
          <input name="leetcode" placeholder="LeetCode" value={resume.personalInfo.leetcode} onChange={handlePersonalInfoChange} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
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
        <SectionList sectionKey="experience" title="Experience" items={resume.experience} onAdd={item => addSectionItem("experience", item)} onEdit={(idx, item) => editSectionItem("experience", idx, item)} onDelete={idx => deleteSectionItem("experience", idx)} addLabel="Add Experience" emptyLabel="No experience added." renderItem={(item = {}, onChange, points, setPoints) => onChange ? (<><input name="company" placeholder="Company" value={item.company || ""} onChange={onChange} style={{ padding: '6px' }} /><input name="role" placeholder="Role" value={item.role || ""} onChange={onChange} style={{ padding: '6px' }} /><input name="duration" placeholder="Duration" value={item.duration || ""} onChange={onChange} style={{ padding: '6px' }} /><PointsInput points={points} setPoints={setPoints} /></>) : (<><span style={label}>{item.role}</span> at <span style={label}>{item.company}</span><span style={dateStyle}>{item.duration}</span><ul style={bulletList}>{(item.details || []).map((d, i) => d && <li key={i} style={bullet}>{d}</li>)}</ul></>)} />
        <SectionList sectionKey="projects" title="Projects" items={resume.projects} onAdd={item => addSectionItem("projects", item)} onEdit={(idx, item) => editSectionItem("projects", idx, item)} onDelete={idx => deleteSectionItem("projects", idx)} addLabel="Add Project" emptyLabel="No projects added." renderItem={(item = {}, onChange, points, setPoints) => onChange ? (<><input name="title" placeholder="Title" value={item.title || ""} onChange={onChange} style={{ padding: '6px' }} /><input name="link" placeholder="Link" value={item.link || ""} onChange={onChange} style={{ padding: '6px' }} /><PointsInput points={points} setPoints={setPoints} /></>) : (<><span style={label}>{item.title}</span> {item.link && (<a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b5bdb', marginLeft: 4, fontSize: '0.95em' }}>[GitHub]</a>)}<ul style={bulletList}>{(item.description || []).map((d, i) => d && <li key={i} style={bullet}>{d}</li>)}</ul></>)} />
        <SectionList sectionKey="education" title="Education" items={resume.education} onAdd={item => addSectionItem("education", item)} onEdit={(idx, item) => editSectionItem("education", idx, item)} onDelete={idx => deleteSectionItem("education", idx)} addLabel="Add Education" emptyLabel="No education added." renderItem={(item = {}, onChange) => onChange ? (<><input name="degree" placeholder="Degree" value={item.degree || ""} onChange={onChange} style={{ padding: '6px' }} /><input name="institution" placeholder="Institution" value={item.institution || ""} onChange={onChange} style={{ padding: '6px' }} /><input name="year" placeholder="Year" value={item.year || ""} onChange={onChange} style={{ padding: '6px' }} /><input name="cgpa" placeholder="CGPA" value={item.cgpa || ""} onChange={onChange} style={{ padding: '6px' }} /></>) : (<><span style={label}>{item.degree}</span> at <span style={label}>{item.institution}</span><span style={dateStyle}>{item.year}</span><span style={{ color: '#555', fontSize: '0.98em', marginLeft: 8 }}>CGPA: {item.cgpa}</span></>)} />
        <SectionList sectionKey="certifications" title="Certifications" items={resume.certifications} onAdd={item => addSectionItem("certifications", item.name ? item : { name: item })} onEdit={(idx, item) => editSectionItem("certifications", idx, item.name ? item : { name: item })} onDelete={idx => deleteSectionItem("certifications", idx)} addLabel="Add Certification" emptyLabel="No certifications added." renderItem={(item = {}, onChange) => onChange ? (<input name="name" placeholder="Certification" value={item.name || ""} onChange={onChange} style={{ padding: '6px' }} />) : (<span style={label}>{item.name}</span>)} />
        <SectionList sectionKey="achievements" title="Achievements" items={resume.achievements} onAdd={item => addSectionItem("achievements", item)} onEdit={(idx, item) => editSectionItem("achievements", idx, item)} onDelete={idx => deleteSectionItem("achievements", idx)} addLabel="Add Achievement" emptyLabel="No achievements added." renderItem={(item = {}, onChange, points, setPoints) => onChange ? (<PointsInput points={points} setPoints={setPoints} />) : (<ul style={bulletList}>{(item.point || []).map((d, i) => d && <li key={i} style={bullet}>{d}</li>)}</ul>)} />
        <SectionList sectionKey="hobbies" title="Hobbies" items={resume.hobbies} onAdd={item => addSectionItem("hobbies", item)} onEdit={(idx, item) => editSectionItem("hobbies", idx, item)} onDelete={idx => deleteSectionItem("hobbies", idx)} addLabel="Add Hobby" emptyLabel="No hobbies added." renderItem={(item = {}, onChange, points, setPoints) => onChange ? (<PointsInput points={points} setPoints={setPoints} />) : (<ul style={bulletList}>{(item.point || []).map((d, i) => d && <li key={i} style={bullet}>{d}</li>)}</ul>)} />
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
                    {section.items.map((item, i) => <li key={i} style={bullet}>{item}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </fieldset>
      </div>
      {/* Right: ATS Resume Preview */}
      <div ref={previewRef} style={{ flex: 1, background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px #e0e7ff', padding: '2.5rem 2.5rem 2rem 2.5rem', margin: '2rem 1rem', minHeight: '80vh', overflowY: 'auto', maxHeight: '90vh', fontFamily: 'Arial, Helvetica, sans-serif', color: '#111' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h1 style={{ fontSize: '1.7rem', color: '#111', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>{resume.personalInfo.name || 'Your Name'}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem', margin: '0.5em 0 0.2em 0', gap: '0.5em', color: '#222' }}>
            {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
            {resume.personalInfo.email && <span>| <a href={`mailto:${resume.personalInfo.email}`} style={contactLink}>{resume.personalInfo.email}</a></span>}
            {resume.personalInfo.linkedin && <span>| <a href={resume.personalInfo.linkedin} style={contactLink}>LinkedIn</a></span>}
            {resume.personalInfo.github && <span>| <a href={resume.personalInfo.github} style={contactLink}>GitHub</a></span>}
            {resume.personalInfo.portfolio && <span>| <a href={resume.personalInfo.portfolio} style={contactLink}>Portfolio</a></span>}
            {resume.personalInfo.leetcode && <span>| <a href={resume.personalInfo.leetcode} style={contactLink}>LeetCode</a></span>}
          </div>
          <button onClick={handleDownloadPDF} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', marginTop: '0.5em' }}>Download PDF</button>
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
                {(exp.details || []).map((d, i) => d && <li key={i} style={bullet}>{d}</li>)}
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
                {(proj.description || []).map((d, i) => d && <li key={i} style={bullet}>{d}</li>)}
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
        {/* Achievements */}
        {resume.achievements.length > 0 && <div><div style={sectionHeader}>ACHIEVEMENTS</div>
          <ul style={bulletList}>
            {resume.achievements.map((ach, idx) => (ach.point || []).map((d, i) => d && <li key={i} style={bullet}>{d}</li>))}
          </ul>
        </div>}
        {/* Hobbies */}
        {resume.hobbies.length > 0 && <div><div style={sectionHeader}>HOBBIES</div>
          <ul style={bulletList}>
            {resume.hobbies.map((hob, idx) => (hob.point || []).map((d, i) => d && <li key={i} style={bullet}>{d}</li>))}
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
