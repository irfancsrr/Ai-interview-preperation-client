import { Link } from 'react-router-dom';
import { FiEdit3, FiVideo, FiFileText, FiBarChart2, FiCheck } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';

const features = [
  { icon: FiEdit3, title: 'AI Practice Sessions', desc: 'Get tailored interview questions based on your role and experience level with instant AI-powered feedback.' },
  { icon: FiVideo, title: 'Video Interview with AI', desc: 'Practice with an AI recruiter avatar via webcam. Speak your answers and get real-time evaluation.' },
  { icon: FiFileText, title: 'Resume Review', desc: 'Upload your resume for comprehensive AI analysis with scoring, keyword matching, and improvement suggestions.' },
  { icon: FiBarChart2, title: 'Performance Analytics', desc: 'Track your progress with detailed dashboards showing strengths, weaknesses, and improvement trends.' },
];

const plans = [
  { name: 'Free', price: '$0', period: 'forever', features: ['5 questions per day', 'Basic AI feedback', 'Answer scoring'], cta: 'Get Started', highlight: false },
  { name: 'Premium', price: '$9.99', period: '/month', features: ['Unlimited practice', 'AI Video interviews', 'Resume review', 'Detailed analytics', 'Feedback reports'], cta: 'Start Free Trial', highlight: true },
  { name: 'Yearly', price: '$79.99', period: '/year', features: ['Everything in Premium', 'Save 33%', 'Priority support'], cta: 'Best Value', highlight: false },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Ace Your Next Interview<br />
          <span className="text-indigo-600">with AI-Powered Prep</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Practice with AI-generated questions, conduct video interviews with an AI recruiter,
          get resume reviews, and track your improvement with analytics.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signup" className="btn-primary text-lg px-8 py-3 no-underline">Start Practicing Free</Link>
          <a href="#features" className="btn-secondary text-lg px-8 py-3 no-underline">Learn More</a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything You Need to Prepare</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-left hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-indigo-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-center text-gray-600 mb-12">Start free, upgrade when you're ready.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`card text-left ${plan.highlight ? 'border-indigo-600 ring-2 ring-indigo-600 relative' : ''}`}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>}
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <FiCheck className="text-green-500 flex-shrink-0" size={16} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`block text-center py-2.5 rounded-lg font-medium no-underline ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2026 InterviewAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
