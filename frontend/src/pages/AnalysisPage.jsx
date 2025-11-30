import { useState } from 'react'
import axios from 'axios'
import { Upload, Loader, CheckCircle, AlertCircle, TrendingUp, DollarSign, Users, Target, ArrowLeft, Download } from 'lucide-react'
import FinancialCharts from '../components/FinancialCharts'

export default function AnalysisPage({ onNavigateToLanding }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setError(null)
    } else {
      setError('Please drop a valid PDF file')
      setFile(null)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Please select a valid PDF file')
      setFile(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a PDF file')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)
    setLoadingProgress(0)
    setLoadingStage('Initializing analysis...')

    // Simulate progress stages
    const progressStages = [
      { progress: 20, stage: 'Uploading document...', delay: 1000 },
      { progress: 40, stage: 'Extracting text from PDF...', delay: 2000 },
      { progress: 60, stage: 'Analyzing financial data...', delay: 3000 },
      { progress: 80, stage: 'Processing with AI...', delay: 2000 },
      { progress: 95, stage: 'Finalizing results...', delay: 1000 },
    ]

    // Run progress simulation in parallel with actual analysis
    const progressPromise = (async () => {
      for (const stage of progressStages) {
        await new Promise(resolve => setTimeout(resolve, stage.delay))
        setLoadingProgress(stage.progress)
        setLoadingStage(stage.stage)
      }
    })()

    try {
      const formData = new FormData()
      formData.append('rhp', file)

      const response = await axios.post(
        'https://ipo-analyser-server.vercel.app/api/v1/ipo/analyze',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setLoadingProgress(100)
      setLoadingStage('Analysis complete!')
      await new Promise(resolve => setTimeout(resolve, 500))
      setAnalysis(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze document. Please try again.')
    } finally {
      await progressPromise
      setLoading(false)
    }
  }

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'apply':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-400'
      case 'high-risk-apply':
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50 text-yellow-400'
      case 'avoid':
        return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50 text-red-400'
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/50 text-gray-400'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'from-green-500 to-emerald-500'
    if (score >= 6) return 'from-blue-500 to-cyan-500'
    if (score >= 4) return 'from-yellow-500 to-amber-500'
    return 'from-red-500 to-rose-500'
  }

  const downloadReport = () => {
    const reportData = JSON.stringify(analysis, null, 2)
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportData))
    element.setAttribute('download', 'ipo-analysis-report.json')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-md bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={onNavigateToLanding}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">IPO Analysis</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {!analysis ? (
          // Upload Section or Loading State
          <div className="animate-fade-in">
            {!loading ? (
              // Upload Interface
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-2xl p-12 mb-8 hover:border-cyan-500/30 transition-all duration-300">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-3">Upload IPO Document</h2>
                  <p className="text-slate-300 text-lg">Upload your IPO RHP (Red Herring Prospectus) PDF to get comprehensive AI-powered analysis</p>
                </div>

                {/* File Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput').click()}
                  className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-600 hover:border-cyan-500/50 hover:bg-cyan-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                      dragActive
                        ? 'bg-cyan-500/20'
                        : 'bg-blue-500/20'
                    }`}>
                      <Upload className={`w-10 h-10 transition-all duration-300 ${
                        dragActive
                          ? 'text-cyan-400 scale-110'
                          : 'text-blue-400'
                      }`} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {file ? (
                        <span className="text-cyan-400">{file.name}</span>
                      ) : (
                        'Drag and drop your PDF here'
                      )}
                    </h3>
                    <p className="text-slate-400 mb-4">or click to browse your computer</p>
                    <p className="text-slate-500 text-sm">PDF files only • Max 50MB</p>
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-8 animate-shake bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-400">Error</h4>
                      <p className="text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className="mt-8 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                >
                  <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Analyze IPO Document</span>
                </button>
              </div>
            ) : (
              // Creative Loading State - Replaces upload section
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-2xl p-12">
                <div className="relative">
                  {/* Animated Background Particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-500 rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${2 + Math.random() * 3}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Main Loading Animation */}
                  <div className="relative flex flex-col items-center">
                    {/* Header */}
                    <div className="text-center mb-12">
                      <h2 className="text-4xl font-bold text-white mb-3">Analyzing Document</h2>
                      <p className="text-slate-300 text-lg">Processing your IPO document with advanced AI analysis</p>
                    </div>
                    
                    {/* Rotating Circle */}
                    <div className="relative w-32 h-32 mb-8">
                      <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 border-4 border-t-cyan-500 border-r-blue-500 border-b-purple-500 border-l-pink-500 rounded-full animate-spin"></div>
                      
                      {/* Center Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                          <TrendingUp className="w-8 h-8 text-white animate-bounce" />
                        </div>
                      </div>
                      
                      {/* Orbiting Dots */}
                      {[0, 90, 180, 270].map((rotation, i) => (
                        <div
                          key={i}
                          className="absolute w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-40px)`,
                            animation: `orbit 2s linear infinite`,
                            animationDelay: `${i * 0.5}s`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full max-w-md mb-6">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${loadingProgress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Loading Text with Typing Animation */}
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {loadingStage || 'Analyzing Document...'}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-slate-300">Processing</span>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"
                              style={{
                                animationDelay: `${i * 0.2}s`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Processing Steps */}
                    <div className="grid grid-cols-4 gap-4 text-center">
                      {[
                        { icon: Upload, label: 'Upload', done: loadingProgress > 25 },
                        { icon: Target, label: 'Extract', done: loadingProgress > 50 },
                        { icon: DollarSign, label: 'Analyze', done: loadingProgress > 75 },
                        { icon: CheckCircle, label: 'Complete', done: loadingProgress > 95 }
                      ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                            step.done
                              ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white scale-110'
                              : 'bg-slate-700 text-slate-500'
                          }`}>
                            <step.icon className="w-6 h-6" />
                          </div>
                          <span className={`text-sm transition-colors duration-300 ${
                            step.done ? 'text-cyan-400' : 'text-slate-500'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Analysis Results
          <div className="space-y-6 animate-fade-in">
            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => {
                  setAnalysis(null)
                  setFile(null)
                }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:border-cyan-500/50 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                Upload Another
              </button>
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>

            {/* Verdict Card */}
            <div className={`rounded-2xl shadow-2xl p-8 border-2 backdrop-blur ${getVerdictColor(analysis.final_verdict)} animate-scale-in`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold">Investment Verdict</h2>
              </div>
              <p className="text-2xl font-bold mb-4 capitalize">{analysis.final_verdict.replace('-', ' ')}</p>
              <p className="text-base leading-relaxed opacity-90">{analysis.final_comment}</p>
            </div>

            {/* Company Overview & Business Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-stagger">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105">
                <h3 className="text-2xl font-bold text-white mb-4">Company Overview</h3>
                <p className="text-slate-300 leading-relaxed">{analysis.company_overview}</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105">
                <h3 className="text-2xl font-bold text-white mb-4">Business Summary</h3>
                <p className="text-slate-300 leading-relaxed">{analysis.business_summary}</p>
              </div>
            </div>

            {/* Financial Analysis */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105 animate-fade-in-stagger">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Financial Analysis</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">{analysis.financial_analysis}</p>
            </div>

            {/* Financial Charts */}
            <FinancialCharts financialMetrics={analysis.financial_metrics} />

            {/* Key Strengths & Risks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-stagger">
              {/* Strengths */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur border border-green-500/30 rounded-xl shadow-lg p-8 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105">
                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Key Strengths
                </h3>
                <ul className="space-y-3">
                  {analysis.key_strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-500/40 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      </div>
                      <span className="text-slate-300 group-hover:text-white transition-colors">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur border border-red-500/30 rounded-xl shadow-lg p-8 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Key Risks
                </h3>
                <ul className="space-y-3">
                  {analysis.key_risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-red-500/40 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      </div>
                      <span className="text-slate-300 group-hover:text-white transition-colors">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Valuation & Profit Potential */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-stagger">
              {/* Valuation */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Valuation Analysis</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">{analysis.valuation_analysis}</p>
              </div>

              {/* Profit Potential */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Profit Potential</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">{analysis.profit_potential}</p>
              </div>
            </div>

            {/* Investment Recommendation */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur border border-cyan-500/30 rounded-2xl shadow-lg p-8 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in-stagger">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Investment Recommendation</h3>
              <p className="text-slate-200 leading-relaxed text-lg">{analysis.investment_recommendation}</p>
            </div>

            {/* Scores */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 animate-fade-in-stagger">
              <h3 className="text-2xl font-bold text-white mb-8">Analysis Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Financial Strength', value: analysis.scores.financial_strength, icon: TrendingUp },
                  { label: 'Valuation Comfort', value: analysis.scores.valuation_comfort, icon: DollarSign },
                  { label: 'Promoter Quality', value: analysis.scores.promoter_quality, icon: Users },
                  { label: 'Demand Strength', value: analysis.scores.demand_strength, icon: Target },
                ].map((score, idx) => {
                  const Icon = score.icon
                  return (
                    <div key={idx} className="text-center p-6 bg-slate-700/50 border border-slate-600/50 rounded-xl hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-110 group">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getScoreColor(score.value)} mx-auto mb-4 flex items-center justify-center group-hover:scale-125 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium mb-2">{score.label}</p>
                      <p className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor(score.value)} bg-clip-text text-transparent`}>
                        {score.value}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">out of 10</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 backdrop-blur-md bg-slate-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p>© 2024 IPO Assistant. Powered by Advanced AI Analysis | Making investment decisions smarter</p>
        </div>
      </footer>

      <style jsx>{`
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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateY(-40px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateY(-40px);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-stagger {
          animation: fade-in-stagger 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
