import React from 'react'
import { useParams } from 'react-router-dom';
import useResumeStore from '../store/useResumeStore';
import { useState } from 'react';
import { useEffect } from 'react';
import ScoreCircle from '../components/charts/ScoreCircle';


const ResumeAnalysisOUTPUT = () => {
    const {id}=useParams();
    const { isLoading,fetchResume}=useResumeStore();
    const [resume,setResume]=useState(null);
    useEffect(()=>{
        (async()=>{
            setResume(await fetchResume(id));
        })();
    },[])

const analysis = resume?.analysis;
  if (!analysis || resume.status !== 'analyzed') {
    return <div className="card text-center py-12"><p className="text-gray-500">Analysis not available</p></div>;
  }
if(isLoading) return (<>loading...</>)  
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

export default ResumeAnalysisOUTPUT