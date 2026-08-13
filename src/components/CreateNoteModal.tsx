import React, { useState } from 'react';
import { X, Plus, FileUp, Sparkles, Tag, BookOpen, Save, Lock, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { NoteItem, SubjectName, GradeLevel } from '../types';

interface CreateNoteModalProps {
  onClose: () => void;
  onSaveNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  selectedGrade: GradeLevel;
}

const SUBJECTS: SubjectName[] = [
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'Social Science',
  'English Literature',
];

const GRADES: GradeLevel[] = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'JEE Mains & Advanced',
  'NEET UG Prep',
];

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  onClose,
  onSaveNote,
  selectedGrade,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectName>('Physics');
  const [chapter, setChapter] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(selectedGrade);
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // Password protection state
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Custom PDF attachment state
  const [attachedFileDetails, setAttachedFileDetails] = useState<{ name: string; size: string; type: string } | null>(null);
  const [customPdfUrl, setCustomPdfUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    setAttachedFileDetails({
      name: file.name,
      size: sizeStr,
      type: file.type || 'PDF',
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomPdfUrl(dataUrl);

        // If file is text or markdown, try auto-populating content text
        if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
          const textReader = new FileReader();
          textReader.onload = (txtEv) => {
            const txt = txtEv.target?.result as string;
            if (txt && !content) {
              setContent(txt);
            }
          };
          textReader.readAsText(file);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyTemplate = (templateType: 'physics' | 'chem' | 'math' | 'bio') => {
    if (templateType === 'physics') {
      setTitle("Electric Current & Ohm's Law Experiments");
      setSubject('Physics');
      setChapter('Electricity');
      setContent(`# Electric Current & Ohm's Law

## Core Definitions:
* **Electric Current ($I$)**: Rate of flow of electric charges. $I = Q / t$ (SI Unit: Ampere, A).
* **Potential Difference ($V$)**: Work done to move a unit charge between two points. $V = W / Q$ (Volts, V).

## Ohm's Law:
At constant temperature, potential difference $V$ across a conductor is directly proportional to current $I$.
$$V = I \\cdot R$$
Where $R$ = Resistance (Ohms, $\\Omega$).

## Resistance Factors:
1. Length ($L$): $R \\propto L$
2. Cross-sectional Area ($A$): $R \\propto 1/A$
3. Formula: $R = \\rho \\frac{L}{A}$ ($\\,\\rho$ = Resistivity)`);
      setTagsInput('Physics, Electricity, OhmsLaw, Formulas');
    } else if (templateType === 'chem') {
      setTitle('Acids, Bases and Salts - Quick Notes');
      setSubject('Chemistry');
      setChapter('Acids, Bases and Salts');
      setContent(`# Acids, Bases and Salts

## Key Differences:
* **Acids**: Turn blue litmus RED. Release $H^+$ ions in aqueous solution. pH < 7.
* **Bases**: Turn red litmus BLUE. Release $OH^-$ ions in aqueous solution. pH > 7.

## Important Reactions:
1. Acid + Metal -> Salt + Hydrogen Gas ($Zn + H_2SO_4 \\rightarrow ZnSO_4 + H_2\\uparrow$)
2. Neutralization: Acid + Base -> Salt + Water ($HCl + NaOH \\rightarrow NaCl + H_2O$)

## Common Salts & Formulas:
* Baking Soda: $NaHCO_3$ (Sodium Hydrogen Carbonate)
* Washing Soda: $Na_2CO_3 \\cdot 10H_2O$
* Plaster of Paris: $CaSO_4 \\cdot \\frac{1}{2}H_2O$`);
      setTagsInput('Chemistry, AcidsBases, Salts, CBSE');
    } else if (templateType === 'math') {
      setTitle('Arithmetic Progressions (AP) Formula Sheet');
      setSubject('Mathematics');
      setChapter('Arithmetic Progressions');
      setContent(`# Arithmetic Progressions (AP)

## General Form:
$a, a+d, a+2d, a+3d, ...$
Where $a$ = First term, $d$ = Common difference.

## $n$-th Term Formula:
$$a_n = a + (n - 1)d$$

## Sum of First $n$ Terms ($S_n$):
$$S_n = \\frac{n}{2} [2a + (n - 1)d] = \\frac{n}{2} [a + l]$$
Where $l$ = Last term.`);
      setTagsInput('Maths, Algebra, AP, Formulas');
    } else if (templateType === 'bio') {
      setTitle('Human Digestive System & Enzymes');
      setSubject('Biology');
      setChapter('Life Processes');
      setContent(`# Human Digestive System

## Digestive Enzymes & Functions:
1. **Salivary Amylase** (Mouth): Breaks starch into maltose sugar.
2. **Pepsin** (Stomach): Breaks proteins into peptones in acidic medium ($HCl$).
3. **Trypsin** (Pancreas): Breaks proteins into amino acids in alkaline medium.
4. **Lipase** (Pancreas): Emulsifies fats into fatty acids and glycerol.
5. **Bile Juice** (Liver): Makes intestinal food alkaline and emulsifies large fat globules.`);
      setTagsInput('Biology, LifeProcesses, Digestion, Enzymes');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify Password 'nexttopper'
    if (password.trim().toLowerCase() !== 'nexttopper') {
      setPasswordError('Incorrect password! Verification failed.');
      return;
    }

    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const noteContent = content.trim() || (attachedFileDetails 
      ? `PDF Document attached: ${attachedFileDetails.name}.\nStudents will download your uploaded PDF file directly!`
      : 'Study note content.');

    onSaveNote({
      title,
      subject,
      chapter: chapter || 'General Chapter',
      grade,
      content: noteContent,
      tags,
      isPinned: false,
      colorHex: '#F3E8FF',
      customPdfUrl: customPdfUrl || undefined,
      ...(attachedFileDetails
        ? {
            fileAttachment: {
              name: attachedFileDetails.name,
              size: attachedFileDetails.size,
              type: attachedFileDetails.type,
              dataUrl: customPdfUrl || undefined,
            },
          }
        : {}),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Create New Study Note</h2>
              <p className="text-[11px] text-blue-200">Upload custom PDF or write revision notes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Template Picker */}
        <div className="bg-blue-50 p-3 px-6 border-b border-blue-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="font-bold text-blue-900 shrink-0">Templates:</span>
          <button
            type="button"
            onClick={() => handleApplyTemplate('physics')}
            className="bg-white hover:bg-blue-100 text-blue-900 px-2.5 py-1 rounded-lg border border-blue-200 font-medium shrink-0"
          >
            ⚡ Physics Electricity
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('chem')}
            className="bg-white hover:bg-blue-100 text-blue-900 px-2.5 py-1 rounded-lg border border-blue-200 font-medium shrink-0"
          >
            🧪 Chemistry Acids
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('math')}
            className="bg-white hover:bg-blue-100 text-blue-900 px-2.5 py-1 rounded-lg border border-blue-200 font-medium shrink-0"
          >
            📐 Math AP Formulas
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('bio')}
            className="bg-white hover:bg-blue-100 text-blue-900 px-2.5 py-1 rounded-lg border border-blue-200 font-medium shrink-0"
          >
            🧬 Bio Digestion
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* PASSWORD REQUIREMENT BOX */}
          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                <span>Security Password Required to Add Notes *</span>
              </label>
            </div>
            
            <input
              type="password"
              required
              placeholder="Enter security password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              className={`w-full text-xs font-bold p-2.5 bg-slate-950 text-white border rounded-xl outline-none transition-all ${
                passwordError
                  ? 'border-red-500 ring-2 ring-red-500/20 bg-red-950/40 text-red-200'
                  : 'border-slate-700 focus:border-amber-400'
              }`}
            />

            {passwordError && (
              <p className="text-[11px] font-bold text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{passwordError}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Subject */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="w-full text-xs font-semibold text-gray-900 p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-blue-600"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Class/Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                className="w-full text-xs font-semibold text-gray-900 p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-blue-600"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Chapter */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Chapter Name</label>
              <input
                type="text"
                placeholder="e.g. Laws of Motion"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full text-xs text-gray-900 p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Note Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Newton's 3rd Law & Recoil Formula"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm font-bold text-gray-900 p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-blue-600"
            />
          </div>

          {/* DEDICATED PDF FILE UPLOAD SECTION */}
          <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    Upload Custom PDF File (Optional)
                  </span>
                  <span className="text-[11px] text-gray-600">
                    {attachedFileDetails
                      ? `Attached: ${attachedFileDetails.name} (${attachedFileDetails.size})`
                      : 'Upload your own PDF document so users download your exact file'}
                  </span>
                </div>
              </div>

              <label className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs px-3.5 py-2 rounded-xl cursor-pointer transition-colors shadow flex items-center gap-1.5 shrink-0">
                <FileUp className="w-4 h-4" />
                <span>{attachedFileDetails ? 'Change PDF' : 'Upload PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {attachedFileDetails && (
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your custom PDF file is attached! Users will download your exact uploaded PDF file.</span>
              </div>
            )}
          </div>

          {/* Note Content Textarea */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Note Content / Notes Summary {attachedFileDetails ? '(Optional if PDF uploaded)' : '*'}
            </label>
            <textarea
              required={!attachedFileDetails}
              rows={6}
              placeholder="Type or paste your lecture notes here... You can use headings (#), bullet points (*), or equations ($F=ma$)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs font-sans text-gray-900 p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-blue-600 leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Physics, BoardExam, Newton, Formulas"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full text-xs text-gray-900 p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-blue-600"
            />
          </div>

          {/* Save Action */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="text-xs font-extrabold px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#F89D2A] text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Save Note to Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

