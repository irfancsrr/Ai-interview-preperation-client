import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSend, FiCheck, FiChevronLeft, FiChevronRight, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useSessionStore from '../store/useSessionStore';
import { getScoreColor, getScoreBg } from '../utils/constants';
import Loader from '../components/common/Loader';

export default function TextPractice() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { currentSession, fetchSession, submitAnswer, completeSession, isLoading } = useSessionStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSession(sessionId);
  }, [sessionId, fetchSession]);

  if (isLoading || !currentSession) return <Loader text="Loading session..." />;

  const questions = currentSession.questions || [];
  const question = questions[currentIndex];
  const isAnswered = question?.aiScore !== null && question?.aiScore !== undefined;
  const allAnswered = questions.every(q => q.aiScore !== null && q.aiScore !== undefined);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) { toast.error('Please type your answer'); return; }
    setSubmitting(true);
    try {
      await submitAnswer(question._id, userAnswer);
      toast.success('Answer evaluated!');
    } catch (err) {
      toast.error('Failed to evaluate answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      await completeSession(currentSession._id);
      toast.success('Session completed!');
    } catch {
      toast.error('Failed to complete session');
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{currentSession.role}</h1>
          <p className="text-sm text-gray-500">{currentSession.experience} | Question {currentIndex + 1} of {questions.length}</p>
        </div>
        {currentSession.status === 'completed' && currentSession.score !== null && (
          <div className={`text-lg font-bold px-4 py-2 rounded-lg ${getScoreBg(currentSession.score)}`}>
            Score: {currentSession.score}/100
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((questions.filter(q => q.aiScore !== null && q.aiScore !== undefined).length) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      {question && (
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">{question.category}</span>
              <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{question.difficulty}</span>
            </div>
            {isAnswered && (
              <span className={`text-sm font-bold ${getScoreColor(question.aiScore, 10)}`}>{question.aiScore}/10</span>
            )}
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>

          {!isAnswered ? (
            <div>
              <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} rows={6}
                className="input-field mb-4" placeholder="Type your answer here..." />
              <button onClick={handleSubmitAnswer} disabled={submitting} className="btn-primary flex items-center gap-2">
                <FiSend size={16} /> {submitting ? 'Evaluating with AI...' : 'Submit Answer'}
              </button>
            </div>
          ) : (
            <div>
              {/* User's Answer */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Your Answer</p>
                <p className="text-sm text-gray-800">{question.userAnswer}</p>
              </div>

              {/* AI Feedback */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                <p className="text-xs font-medium text-indigo-600 mb-1">AI Feedback</p>
                <p className="text-sm text-gray-800">{question.aiFeedback}</p>
              </div>

              {/* Ideal Answer */}
              <details className="group">
                <summary className="text-sm text-indigo-600 font-medium cursor-pointer hover:text-indigo-700">View Ideal Answer</summary>
                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800">{question.answer}</p>
                </div>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      {/* for small devices */}
      <div className="flex items-center justify-between lg:hidden">
        <button onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setUserAnswer(''); }}
          disabled={currentIndex === 0} className="btn-secondary flex items-center gap-1 text-sm">
          <FiChevronLeft size={16} /> 
        </button>
        <div className="flex gap-1">
          {questions.map((q, i) => (
            <button key={i} onClick={() => { setCurrentIndex(i); setUserAnswer(''); }}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                i === currentIndex ? 'bg-indigo-600 text-white' :
                q.aiScore !== null && q.aiScore !== undefined ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>{i + 1}</button>
          ))}
        </div>
        {currentIndex < questions.length - 1 ? (
          <button onClick={() => { setCurrentIndex(currentIndex + 1); setUserAnswer(''); }} className="btn-secondary flex items-center gap-1 text-sm">
           <FiChevronRight size={16} />
          </button>
        ) : allAnswered && currentSession.status !== 'completed' ? (
          <button onClick={handleComplete} className="btn-primary flex items-center gap-1 text-sm">
            <FiAward size={16} /> Complete Session
          </button>
        ) : (
          <div className="w-24" />
        )}
      </div>

      {/* for large devices */}
          <div className="lg:flex items-center justify-between  hidden">
        <button onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setUserAnswer(''); }}
          disabled={currentIndex === 0} className="btn-secondary flex items-center gap-1 text-sm">
          <FiChevronLeft size={16} /> Previous
        </button>
        <div className="flex gap-1">
          {questions.map((q, i) => (
            <button key={i} onClick={() => { setCurrentIndex(i); setUserAnswer(''); }}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                i === currentIndex ? 'bg-indigo-600 text-white' :
                q.aiScore !== null && q.aiScore !== undefined ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>{i + 1}</button>
          ))}
        </div>
        {currentIndex < questions.length - 1 ? (
          <button onClick={() => { setCurrentIndex(currentIndex + 1); setUserAnswer(''); }} className="btn-secondary flex items-center gap-1 text-sm">
          Next <FiChevronRight size={16} />
          </button>
        ) : allAnswered && currentSession.status !== 'completed' ? (
          <button onClick={handleComplete} className="btn-primary flex items-center gap-1 text-sm">
            <FiAward size={16} /> Complete Session
          </button>
        ) : (
          <div className="w-24" />
        )}
      </div>
    </div>
  );
}
