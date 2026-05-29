import React, { useState } from "react"
import axios from "axios"
import { 
  FolderUp, 
  LayoutDashboard, 
  Brain, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Loader2 
} from "lucide-react"

// Verified live Render backend API endpoint
const API = "https://jobfit-ai-backend-qisq.onrender.com" 

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard")
  
  // Input Form States
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)

  // Pipeline Analysis Output States
  const [resumeText, setResumeText] = useState("")
  const [skills, setSkills] = useState([])
  const [atsScore, setAtsScore] = useState(0)
  const [feedback, setFeedback] = useState([])
  const [analysis, setAnalysis] = useState("")
  const [jobMatch, setJobMatch] = useState(0)
  const [optimizedResume, setOptimizedResume] = useState("")
  const [pdfDownload, setPdfDownload] = useState("")

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !jobDescription.trim()) {
      alert("Please upload a resume file and paste a job description target.")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("job_description", jobDescription)

      const response = await axios.post(`${API}/upload-resume/`, formData)

      if (!response.data) {
        throw new Error("Empty response received from data processing server.")
      }

      // Print response to console for easy debugging
      console.log("Raw Server Response Payload:", response.data)

      // 1. Basic Response Mapping with Fallbacks
      setResumeText(response.data.text || "")
      setSkills(Array.isArray(response.data.skills) ? response.data.skills : [])
      setFeedback(Array.isArray(response.data.feedback) ? response.data.feedback : [])
      setPdfDownload(response.data.pdf_download || "")
      
      // 2. FIXED PROPERTY MAPPINGS (Matching your live Network payload precisely)
      // Extracting data from your server's custom JSON layout structure
      setAtsScore(response.data.analysis?.ats_score || response.data.ats_score || 0)
      setAnalysis(response.data.analysis?.level ? `Level: ${response.data.analysis.level}` : "AI / Machine Learning") 
      setJobMatch(response.data.job_match?.match_score || 0) 

      // 3. Clean Stringified JSON formatting safely if backend wraps it as raw text string
      let rawOptimized = response.data.optimized_resume || ""
      if (typeof rawOptimized === "string" && (rawOptimized.trim().startsWith("{") || rawOptimized.trim().startsWith("["))) {
        try {
          const parsedJSON = JSON.parse(rawOptimized)
          setOptimizedResume(JSON.stringify(parsedJSON, null, 2))
        } catch (jsonErr) {
          setOptimizedResume(rawOptimized)
        }
      } else {
        setOptimizedResume(rawOptimized)
      }

      // Pivot view to Dashboard view panel securely
      setActiveTab("dashboard")
      alert("Resume analyzed successfully!")

    } catch (error) {
      console.error("Upload execution boundary error:", error)
      alert(`Analysis failed: ${error.response?.data?.detail || error.message || "Unknown error occurred."}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] text-white font-sans antialiased">
      
      {/* Desktop Sidebar Control Deck - Stays visible on large viewports */}
      <aside className="w-80 bg-black/40 border-r border-white/5 flex-col justify-between p-6 backdrop-blur-xl hidden lg:flex">
        <div className="space-y-10">
          <div className="flex items-center gap-3 pl-2">
            <div className="bg-gradient-to-tr from-cyan-500 to-purple-500 p-2.5 rounded-2xl shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">JobFit AI</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">ATS Optimization Engine</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "skills", label: "Core Skills", icon: Brain },
              { id: "analysis", label: "System Analysis", icon: FileText },
              { id: "jobmatch", label: "Role Alignment", icon: Briefcase },
              { id: "optimized", label: "AI Resume Workspace", icon: Sparkles }
            ].map((tab) => {
              const IconComponent = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                    isSelected 
                      ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/5" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <IconComponent className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${isSelected ? "text-cyan-400" : "text-gray-400 group-hover:text-gray-200"}`} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 font-medium font-mono">System Core Status: v1.0.0 Live</p>
        </div>
      </aside>

      {/* Mobile Top Header - Visible on phone configurations */}
      <div className="lg:hidden bg-black/40 border-b border-white/5 p-4 flex items-center justify-between backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="font-black text-sm tracking-tight">JobFit AI Mobile</span>
        </div>
        <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-1 rounded-md font-mono">v1.0.0</span>
      </div>

      {/* Main Stream Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-14 space-y-8 pb-24 lg:pb-14">
        
        {/* Welcome Executive Row */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Processing Dashboard</h2>
            <p className="text-xs text-gray-400 mt-0.5">Upload and adjust your parameters to align with industry compliance schemas.</p>
          </div>
        </header>

        {/* Upload Form Container */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <form onSubmit={handleUpload} className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              
              {/* File Upload Zone */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-300 mb-1.5 tracking-wide uppercase">Source Document (PDF)</label>
                <div className="border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-xl bg-black/20 p-4 flex flex-col items-center justify-center min-h-[140px] transition-all duration-300 relative group">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  <div className="text-center space-y-2 pointer-events-none flex flex-col items-center">
                    <FolderUp className="w-6 h-6 text-gray-400 group-hover:text-cyan-400" />
                    <div>
                      <p className="text-xs font-bold tracking-tight">{file ? file.name : "Select your target resume"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description Zone */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-300 mb-1.5 tracking-wide uppercase">Target Job Matrix</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target description here..."
                  className="w-full flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/40 min-h-[120px] resize-none"
                />
              </div>
            </div>

            {/* Submit Action Execution Bar */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-black py-3 rounded-xl font-extrabold text-xs tracking-wide shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Evaluating Matrix Metrics...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-black font-bold" />
                    Analyze Resume Matrix
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Dynamic Output Content Panels based on Active Tab Selection */}
        <section className="mt-4">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] shadow-lg">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Overall ATS Score</h3>
                <p className="text-4xl font-black text-cyan-400 mt-2">{atsScore}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] shadow-lg">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Job Matching Ratio</h3>
                <p className="text-4xl font-black text-purple-400 mt-2">{jobMatch}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] shadow-lg">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Extracted Skills</h3>
                <p className="text-4xl font-black text-green-400 mt-2">{skills.length}</p>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 shadow-lg">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><Brain className="w-5 h-5" /> Core Skills</h2>
              {skills.length === 0 ? (
                <p className="text-xs text-gray-500">No data loaded.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><FileText className="w-5 h-5" /> Structural Assessment</h2>
              <div className="space-y-3">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <h4 className="text-[10px] text-purple-400 uppercase tracking-wider font-extrabold mb-0.5">Category Summary</h4>
                  <p className="text-gray-300 text-xs font-bold">{analysis}</p>
                </div>
                <div>
                  <h4 className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold mb-2">Checkpoints</h4>
                  {feedback.length === 0 ? (
                    <p className="text-xs text-gray-500">No checkpoints returned.</p>
                  ) : (
                    <ul className="space-y-2">
                      {feedback.map((item, index) => (
                        <li key={index} className="bg-white/5 p-3 rounded-xl text-xs text-gray-300 border-l-4 border-cyan-500 pl-3">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "jobmatch" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 shadow-lg">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><Briefcase className="w-5 h-5" /> Alignment Vector</h2>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-gray-300 leading-relaxed">Your layout matches <span className="text-purple-400 font-black">{jobMatch}%</span> of the target description schema.</p>
              </div>
            </div>
          )}

          {activeTab === "optimized" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><Sparkles className="w-5 h-5" /> Engineered Text</h2>
                {pdfDownload && (
                  <a
                    href={`${API}/download-resume/`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center bg-green-500 text-black py-2 rounded-lg text-[10px] font-black uppercase tracking-wide"
                  >
                    Download Compiled PDF
                  </a>
                )}
              </div>
              <textarea
                readOnly
                rows="10"
                value={optimizedResume || "AI payload will render here."}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-gray-300 font-mono text-[10px] focus:outline-none resize-none"
              />
            </div>
          )}
        </section>
      </main>

      {/* Mobile Sticky Bottom Tab Bar - Handles tabs gracefully on mobile simulation sizes */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/80 border-t border-white/10 backdrop-blur-lg flex justify-around p-2 z-50">
        {[
          { id: "dashboard", label: "Home", icon: LayoutDashboard },
          { id: "skills", label: "Skills", icon: Brain },
          { id: "analysis", label: "Analysis", icon: FileText },
          { id: "jobmatch", label: "Match", icon: Briefcase },
          { id: "optimized", label: "Workspace", icon: Sparkles }
        ].map((tab) => {
          const IconComponent = tab.icon
          const isSelected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${isSelected ? "text-cyan-400 font-bold" : "text-gray-500"}`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-[9px] tracking-tight">{tab.label}</span>
            </button>
          )
        })}
      </nav>

    </div>
  )
}

export default App