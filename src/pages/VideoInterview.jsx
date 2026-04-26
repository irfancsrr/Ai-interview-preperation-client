import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiVideo, FiMic, FiMicOff, FiStopCircle, FiSend, FiArrowRight, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useInterviewStore from '../store/useInterviewStore';
import useWebRTC from '../hooks/useWebRTC';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import AvatarCanvas from '../components/avatar/AvatarCanvas';
import ScoreCircle from '../components/charts/ScoreCircle';
import { EXPERIENCE_LEVELS, INTERVIEW_TYPES, getScoreColor } from '../utils/constants';
import Loader from '../components/common/Loader';

function PreInterviewSetup({ onStart }) {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('mid-level');
  const [interviewType, setInterviewType] = useState('mixed');
  const { videoRef, isStreaming, error, startCamera, stopCamera } = useWebRTC();
  const [cameraChecked, setCameraChecked] = useState(false);

  const handleCameraCheck = async () => {
    try {
      await startCamera();
      setCameraChecked(true);
    } catch { /* error handled in hook */ }
  };

  const handleStart = () => {
    if (!role.trim()) { toast.error('Please enter a job role'); return; }
    stopCamera();
    onStart(role, experience, interviewType);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Video Interview</h1>
      <p className="text-gray-500 mb-8">Practice with an AI recruiter. Speak your answers naturally.</p>

      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Interview Setup</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Role *</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
              className="input-field" placeholder="e.g., Full Stack Developer" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className="input-field">
                {EXPERIENCE_LEVELS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} className="input-field">
                {INTERVIEW_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Camera & Microphone Check</h3>
        {!cameraChecked ? (
          <div className="text-center py-8">
            <FiVideo size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm mb-4">Check your camera and microphone before starting</p>
            <button onClick={handleCameraCheck} className="btn-primary">
              Test Camera & Mic
            </button>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>
        ) : (
          <div className="text-center">
            <video ref={videoRef} autoPlay muted playsInline className="w-64 h-48 mx-auto rounded-lg bg-black object-cover mb-3" />
            <p className="text-green-600 text-sm font-medium">Camera and microphone working!</p>
          </div>
        )}
      </div>

      <button onClick={handleStart} disabled={!cameraChecked || !role.trim()} className="btn-primary w-full text-lg py-3">
        Start Interview
      </button>
    </div>
  );
}

function InterviewRoom({ interviewId }) {
  const { currentQuestion, questionIndex, submitAnswer, getNextQuestion, endInterview, isProcessing, lastScore, lastFeedback } = useInterviewStore();
  const { videoRef, startCamera, stopCamera } = useWebRTC();
  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported: sttSupported } = useSpeechRecognition();
  const { speak, cancel: cancelSpeech, isSpeaking } = useSpeechSynthesis();
  const [avatarState, setAvatarState] = useState('idle');
  const [phase, setPhase] = useState('asking'); // asking, answering, feedback, loading
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => { stopCamera(); cancelSpeech(); };
  }, []);

  // Speak the question when it arrives
  useEffect(() => {
    if (currentQuestion && phase === 'asking') {
      setAvatarState('speaking');
      speak(currentQuestion).then(() => {
        setAvatarState('listening');
        setPhase('answering');
      });
    }
  }, [currentQuestion, phase]);

  const handleStartAnswer = () => {
    resetTranscript();
    startListening();
  };

  const handleStopAnswer = async () => {
    const finalTranscript = stopListening();
    const answer = finalTranscript || transcript;
    if (!answer.trim()) { toast.error('No answer detected. Please try again.'); return; }

    setPhase('loading');
    setAvatarState('thinking');
    try {
      await submitAnswer(answer);
      setPhase('feedback');
      setAvatarState('idle');
    } catch {
      toast.error('Failed to evaluate answer');
      setPhase('answering');
      setAvatarState('listening');
    }
  };

  const handleNextQuestion = async () => {
    setPhase('loading');
    setAvatarState('thinking');
    resetTranscript();
    try {
      const data = await getNextQuestion();
      if (data.done) {
        handleEndInterview();
      } else {
        setPhase('asking');
      }
    } catch {
      toast.error('Failed to get next question');
      setPhase('feedback');
    }
  };

  const handleEndInterview = async () => {
    setPhase('loading');
    setAvatarState('thinking');
    cancelSpeech();
    try {
      const data = await endInterview();
      setResults(data);
      setShowResults(true);
      stopCamera();
    } catch {
      toast.error('Failed to end interview');
    }
  };

  if (showResults && results) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Interview Complete!</h1>
        <div className="card mb-6">
          <ScoreCircle score={results.overallScore || 0} label="Overall Score" />
          <p className="text-gray-600 mt-4 text-sm">{results.overallFeedback || 'Review your detailed feedback below.'}</p>
        </div>
        <div className="card text-left mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Question Breakdown</h3>
          <div className="space-y-3">
            {results.questions?.map((q, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium text-gray-900">Q{i + 1}: {q.question}</p>
                  <span className={`text-sm font-bold ${getScoreColor(q.aiScore || 0, 10)}`}>{q.aiScore || 0}/10</span>
                </div>
                {q.aiFeedback && <p className="text-xs text-gray-500 mt-1">{q.aiFeedback}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/video-interview')} className="btn-secondary">New Interview</button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Question {questionIndex + 1}</h2>
        <button onClick={handleEndInterview} className="btn-danger text-sm flex items-center gap-1">
          <FiStopCircle size={16} /> End Interview
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Avatar */}
        <div className="card flex flex-col items-center">
          <AvatarCanvas state={avatarState} />
          <div className="mt-4 w-full">
            <div className="bg-gray-50 rounded-lg p-3 min-h-[60px]">
              <p className="text-xs font-medium text-gray-500 mb-1">AI Interviewer</p>
              <p className="text-sm text-gray-800">{currentQuestion || '...'}</p>
            </div>
          </div>
        </div>

        {/* User Side */}
        <div className="card flex flex-col">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-48 rounded-lg bg-black object-cover mb-4" />

          {/* Transcript */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 min-h-[60px] flex-1">
            <p className="text-xs font-medium text-gray-500 mb-1">Your Response</p>
            <p className="text-sm text-gray-800">{transcript || (isListening ? 'Listening...' : 'Click the microphone to start speaking')}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {phase === 'answering' && (
              <>
                {!isListening ? (
                  <button onClick={handleStartAnswer} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <FiMic size={18} /> Start Speaking
                  </button>
                ) : (
                  <button onClick={handleStopAnswer} className="btn-danger flex-1 flex items-center justify-center gap-2">
                    <FiMicOff size={18} /> Done Speaking
                  </button>
                )}
              </>
            )}
            {phase === 'feedback' && (
              <div className="w-full space-y-3">
                {lastScore !== null && (
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-indigo-600">AI Feedback</span>
                      <span className={`font-bold ${getScoreColor(lastScore, 10)}`}>{lastScore}/10</span>
                    </div>
                    <p className="text-sm text-gray-700">{lastFeedback}</p>
                  </div>
                )}
                <button onClick={handleNextQuestion} disabled={isProcessing} className="btn-primary w-full flex items-center justify-center gap-2">
                  <FiArrowRight size={16} /> Next Question
                </button>
              </div>
            )}
            {(phase === 'asking' || phase === 'loading') && (
              <div className="w-full text-center py-3">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-500 mt-2">{isSpeaking ? 'AI is speaking...' : 'Processing...'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoInterview() {
  const [started, setStarted] = useState(false);
  const { startInterview, currentInterview, isLoading, history, fetchHistory, reset } = useInterviewStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    return () => reset();
  }, []);

  const handleStart = async (role, experience, interviewType) => {
    try {
      await startInterview(role, experience, interviewType);
      setStarted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    }
  };

  if (isLoading) return <Loader text="Setting up interview..." />;

  if (started && currentInterview) {
    return <InterviewRoom interviewId={currentInterview} />;
  }

  return (
    <div>
      <PreInterviewSetup onStart={handleStart} />

      {/* History */}
      {history.length > 0 && (
        <div className="max-w-2xl mx-auto mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Interviews</h2>
          <div className="space-y-3">
            {history.slice(0, 5).map(interview => (
              <div key={interview._id} className="card flex items-center justify-between !py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{interview.role}</p>
                  <p className="text-xs text-gray-500">{new Date(interview.createdAt).toLocaleDateString()} | {interview.interviewType}</p>
                </div>
                <div className="flex items-center gap-3">
                  {interview.overallScore !== null && (
                    <span className={`text-sm font-bold ${getScoreColor(interview.overallScore)}`}>{interview.overallScore}/100</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded ${interview.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {interview.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
