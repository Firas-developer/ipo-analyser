import { useState } from 'react'
import { ArrowRight, TrendingUp, BarChart3, Zap, Shield, Users, Lightbulb } from 'lucide-react'

export default function LandingPage({ onNavigateToAnalysis }) {
  const [isHovering, setIsHovering] = useState(null)

  const features = [
    {
      icon: TrendingUp,
      title: 'Comprehensive Analysis',
      description: 'Get detailed insights into company financials, business model, and growth potential'
    },
    {
      icon: BarChart3,
      title: 'Smart Scoring',
      description: 'AI-powered scoring system evaluates financial strength, valuation, and demand'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Upload a PDF and get analysis in seconds with actionable recommendations'
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Identify key risks and challenges before making investment decisions'
    },
    {
      icon: Users,
      title: 'Expert Insights',
      description: 'Leverages advanced AI to provide professional-grade investment analysis'
    },
    {
      icon: Lightbulb,
      title: 'Investment Verdict',
      description: 'Clear recommendations: Apply, High-Risk, or Avoid based on comprehensive analysis'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-700/50 backdrop-blur-md bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">IPO Assistant</h1>
          </div>
          <p className="text-slate-400 text-sm">Intelligent Investment Analysis Platform</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Make Smarter <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">IPO Investment</span> Decisions
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Upload an IPO prospectus and get AI-powered analysis with investment recommendations, financial insights, and risk assessments in seconds.
          </p>
          
          <button
            onClick={onNavigateToAnalysis}
            onMouseEnter={() => setIsHovering('cta')}
            onMouseLeave={() => setIsHovering(null)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 animate-bounce-slow"
          >
            Start Analysis
            <ArrowRight className={`w-5 h-5 transition-transform ${isHovering === 'cta' ? 'translate-x-1' : ''}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in-delay">
          {[
            { number: '10K+', label: 'IPOs Analyzed' },
            { number: '95%', label: 'Accuracy Rate' },
            { number: '<30s', label: 'Analysis Time' },
          ].map((stat, idx) => (
            <div key={idx} className="p-6 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105">
              <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">{stat.number}</p>
              <p className="text-slate-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-16">Why Choose IPO Assistant?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group p-8 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 animate-fade-in-stagger"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="p-12 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur border border-cyan-500/30 rounded-2xl animate-fade-in">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Analyze Your First IPO?</h3>
          <p className="text-slate-300 mb-8">Get comprehensive investment insights powered by advanced AI analysis</p>
          <button
            onClick={onNavigateToAnalysis}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Upload Document Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 backdrop-blur-md bg-slate-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p>© 2024 IPO Assistant. Powered by Advanced AI Analysis | Investment decisions made smarter</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          50% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-stagger {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.2s ease-out;
        }

        .animate-fade-in-stagger {
          animation: fade-in-stagger 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  )
}
