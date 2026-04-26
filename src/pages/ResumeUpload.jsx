import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFileText, FiTrash2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useResumeStore from '../store/useResumeStore';
import ScoreCircle from '../components/charts/ScoreCircle';
import { getScoreBg, formatDate } from '../utils/constants';
import Loader from '../components/common/Loader';

function UploadSection() {
  const [targetRole, setTargetRole] = useState('');
  const { uploadResume, isUploading } = useResumeStore();
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files are accepted'); return; }
    try {
      const resume = await uploadResume(file, targetRole);
      toast.success('Resume analyzed!');

      navigate(`/resume/${resume._id}`);
      // navigate(`/resume`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    }
  }, [targetRole, uploadResume, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className="max-w-xl">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Role (optional)</label>
        <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
          className="input-field" placeholder="e.g., Frontend Developer" />
      </div>

      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}>
        <input {...getInputProps()} />
        {isUploading ? (
          <div>
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-indigo-600 font-medium">Analyzing your resume with AI...</p>
          </div>
        ) : (
          <>
            <FiUploadCloud size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-700 font-medium mb-1">{isDragActive ? 'Drop your resume here' : 'Drag & drop your resume PDF'}</p>
            <p className="text-gray-400 text-sm">or click to browse (PDF, max 5MB)</p>
          </>
        )}
      </div>
    </div>
  );
}

function ResumeAnalysis({ resume }) {
  const analysis = resume.analysis;
  if (!analysis || resume.status !== 'analyzed') {
    return <div className="card text-center py-12"><p className="text-gray-500">Analysis not available</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Scores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex flex-col items-center"><ScoreCircle score={analysis.overallScore || 0} size={90} label="Overall" /></div>
        <div className="card flex flex-col items-center"><ScoreCircle score={analysis.formattingScore || 0} size={90} label="Format" /></div>
        <div className="card flex flex-col items-center"><ScoreCircle score={analysis.contentScore || 0} size={90} label="Content" /></div>
        <div className="card flex flex-col items-center"><ScoreCircle score={analysis.experienceScore || 0} size={90} label="Experience" /></div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-green-700 mb-3">Strengths</h3>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">+</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-semibold text-amber-700 mb-3">Areas to Improve</h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">!</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Suggestions</h3>
        <ol className="space-y-2">
          {analysis.suggestions.map((s, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Keywords */}
      {analysis.keywordMatch && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Keyword Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-green-600 mb-2">Found Keywords</p>
              <div className="flex flex-wrap gap-1">
                {analysis.keywordMatch.found.map((k, i) => (
                  <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-red-600 mb-2">Missing Keywords</p>
              <div className="flex flex-wrap gap-1">
                {analysis.keywordMatch.missing.map((k, i) => (
                  <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumeUpload() {
  const { resumes, currentResume, fetchResumes, fetchResume, deleteResume, isLoading } = useResumeStore();
  const [viewId, setViewId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  const handleView = async (id) => {
    await fetchResume(id);
    setViewId(id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    await deleteResume(id);
    if (viewId === id) setViewId(null);
    toast.success('Resume deleted');
  };

  if (viewId && currentResume) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => setViewId(null)} className="text-sm text-indigo-600 font-medium mb-1 hover:text-indigo-700">&larr; Back</button>
            <h1 className="text-xl font-bold text-gray-900">{currentResume.fileName}</h1>
            <p className="text-sm text-gray-500">{currentResume.targetRole && `Target: ${currentResume.targetRole} | `}Uploaded {formatDate(currentResume.createdAt)}</p>
          </div>
        </div>
        <ResumeAnalysis resume={currentResume} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Review</h1>
      <p className="text-gray-500 mb-8">Upload your resume for AI-powered analysis and feedback</p>

      <UploadSection />

      {/* History */}
      {resumes.length > 0 && (
        <div className="mt-10 max-w-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Reviews</h2>
          <div className="space-y-3">
            {resumes.map(resume => (
              <div key={resume._id} className="card flex items-center justify-between !py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FiFileText size={20} className="text-indigo-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{resume.fileName}</p>
                    <p className="text-xs text-gray-500">{formatDate(resume.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {resume.analysis?.overallScore != null && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreBg(resume.analysis.overallScore)}`}>{resume.analysis.overallScore}</span>
                  )}
                  <button onClick={() => handleView(resume._id)} className="text-indigo-600 hover:text-indigo-700 p-1"><FiEye size={16} /></button>
                  <button onClick={() => handleDelete(resume._id)} className="text-gray-400 hover:text-red-600 p-1"><FiTrash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
