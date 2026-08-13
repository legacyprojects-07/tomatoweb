import React, { useState } from 'react';
import { 
  FolderDown, 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  Sparkles, 
  FileDown, 
  Printer, 
  CheckCircle2, 
  ArrowUpRight,
  HardDrive,
  Gamepad2
} from 'lucide-react';
import { DownloadedPdfRecord, NoteItem } from '../types';
import { downloadNotePDFFile } from '../utils/pdfGenerator';

interface DownloadsFolderViewProps {
  downloadedRecords: DownloadedPdfRecord[];
  allNotes: NoteItem[];
  onClearDownloads: () => void;
  onRemoveRecord: (id: string) => void;
  onSelectNote: (note: NoteItem) => void;
  onGoToGames: () => void;
}

export const DownloadsFolderView: React.FC<DownloadsFolderViewProps> = ({
  downloadedRecords,
  allNotes,
  onClearDownloads,
  onRemoveRecord,
  onSelectNote,
  onGoToGames
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const filteredRecords = downloadedRecords.filter((rec) => {
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || rec.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const totalSizeKb = downloadedRecords.reduce((acc, r) => acc + r.fileSizeKb, 0);

  const handleReDownload = (record: DownloadedPdfRecord) => {
    const note = allNotes.find((n) => n.id === record.noteId);
    if (note) {
      downloadNotePDFFile(note);
    } else {
      alert("Note data is available in vault.");
    }
  };

  const handleBatchDownloadAll = () => {
    const unlockedNotes = allNotes.filter((n) => !n.isLocked);
    if (unlockedNotes.length === 0) {
      alert("No unlocked notes to download.");
      return;
    }
    unlockedNotes.forEach((n, idx) => {
      setTimeout(() => {
        downloadNotePDFFile(n);
      }, idx * 400);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Folder Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0B132B] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-[#F89D2A] text-slate-950 flex items-center justify-center shadow-lg shrink-0">
            <FolderDown className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Tomato Official Download Folder</h1>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Offline Ready
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1">
              All unlocked revision notes saved in PDF document format for easy offline studying and printing.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleBatchDownloadAll}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4 stroke-[2.5]" />
            <span>Download All PDFs</span>
          </button>

          <button
            onClick={onGoToGames}
            className="bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-blue-700 transition-colors flex items-center gap-1.5"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Unlock More via Games</span>
          </button>
        </div>
      </div>

      {/* Storage & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat Box 1 */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="text-sm font-black text-gray-900">{downloadedRecords.length} Saved PDFs</div>
            <div className="text-[11px] text-gray-500 font-medium">Ready in Local Download Folder</div>
          </div>
        </div>

        {/* Stat Box 2 */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold shrink-0">
            <HardDrive className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-black text-gray-900">{totalSizeKb} KB Space</div>
            <div className="text-[11px] text-gray-500 font-medium">Optimized Lightweight PDF Format</div>
          </div>
        </div>

        {/* Clear History Button */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-gray-600">Download Directory Actions</span>
          {downloadedRecords.length > 0 && (
            <button
              onClick={onClearDownloads}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Subject Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search saved PDF notes by title or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 text-xs font-medium text-gray-800 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs font-bold">
          {["All", "Physics", "Chemistry", "Mathematics", "Biology"].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedSubject === subj
                  ? 'bg-slate-900 text-amber-300 shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Download Folder PDF Files List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <FolderDown className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">No Saved PDFs in Download Folder</h3>
            <p className="text-xs text-gray-500">
              Win games in the Arcade or export notes from your Vault to generate downloadable PDFs here!
            </p>
            <button
              onClick={onGoToGames}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow transition-all inline-flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Go to Games Arcade</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRecords.map((rec) => {
              const matchingNote = allNotes.find((n) => n.id === rec.noteId);
              return (
                <div
                  key={rec.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-black shrink-0 shadow-sm">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-slate-900 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          {rec.subject} • {rec.grade}
                        </span>
                        {rec.unlockedViaGame && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>Unlocked: {rec.unlockedViaGame}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-gray-900 text-sm">{rec.title}</h3>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {rec.fileName} • {rec.fileSizeKb} KB • Downloaded {rec.downloadedAt}
                      </div>
                    </div>
                  </div>

                  {/* PDF Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleReDownload(rec)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Re-Download PDF</span>
                    </button>

                    <button
                      onClick={() => onRemoveRecord(rec.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove from download folder history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
