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

      // 1. Basic Response Mapping with Fallbacks
      setResumeText(response.data.text || "")
      setAtsScore(response.data.ats_score || 0)
      setSkills(Array.isArray(response.data.skills) ? response.data.skills : [])
      setFeedback(Array.isArray(response.data.feedback) ? response.data.feedback : [])
      setPdfDownload(response.data.pdf_download || "")
      
      // 2. Nested Object Extraction 
      setAnalysis(response.data.analysis?.category || "AI / Machine Learning") 
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

    } catch (error) {
      console.error("Upload execution boundary error:", error)
      alert(`Analysis failed: ${error.response?.data?.detail || error.message || "Unknown error occurred."}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] text-white font-sans antialiased">
      
      {/* Sidebar Control Deck */}
      <aside className="w-80 bg-black/40 border-r border-white/5 flex flex-col justify-between p-6 backdrop-blur-xl hidden lg:flex">
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

      {/* Main Stream Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 space-y-12">
        
        {/* Welcome Executive Row */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Processing Dashboard</h2>
            <p className="text-sm text-gray-400 mt-1">Upload and adjust your parameters to align with industry compliance schemas.</p>
          </div>
        </header>

        {/* Upload Form Container */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <form onSubmit={handleUpload} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* File Upload Zone */}
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">Source Document (PDF)</label>
                <div className="border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-2xl bg-black/20 p-6 flex flex-col items-center justify-center min-h-[180px] transition-all duration-300 relative group">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  <div className="text-center space-y-3 pointer-events-none flex flex-col items-center">
                    <div className="bg-white/5 p-4 rounded-xl group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors duration-300">
                      <FolderUp className="w-7 h-7 text-gray-400 group-hover:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">{file ? file.name : "Select your target resume"}</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">Supports explicit PDF structures up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description Zone */}
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">Target Job Matrix</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target technical specifications, role demands, and required compliance frameworks here..."
                  className="w-full flex-1 bg-black/20 border border-white/10 rounded-2xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all duration-300 min-h-[180px] resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Submit Action Execution Bar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black px-8 py-4 rounded-2xl font-extrabold text-sm tracking-wide shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Evaluating Matrix Metrics...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black font-bold" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[160px] shadow-lg">
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Overall ATS Score</h3>
                <p className="text-5xl font-black text-cyan-400 mt-3 tracking-tight">{atsScore}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[160px] shadow-lg">
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Job Matching Ratio</h3>
                <p className="text-5xl font-black text-purple-400 mt-3 tracking-tight">{jobMatch}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[160px] shadow-lg">
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Extracted Skills</h3>
                <p className="text-5xl font-black text-green-400 mt-3 tracking-tight">{skills.length}</p>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 shadow-lg">
              <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2"><Brain className="w-6 h-6" /> Identified Candidate Core Skills</h2>
              {skills.length === 0 ? (
                <p className="text-gray-500 font-medium">No telemetry data loaded. Upload a file above to process metrics.</p>
              ) : (
                <div className="flex flex-wrap gap-3 pt-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 shadow-lg">
              <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2"><FileText className="w-6 h-6" /> System Structural Assessment</h2>
              <div className="space-y-4">
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <h4 className="text-xs text-purple-400 uppercase tracking-wider font-extrabold mb-1">Executive Category Summary</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">Domain Type classification determined as: <strong className="text-white">{analysis}</strong></p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider font-extrabold mb-3">Target Improvement Checkpoints</h4>
                  {feedback.length === 0 ? (
                    <p className="text-gray-500 font-medium">No checkpoints returned.</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {feedback.map((item, index) => (
                        <li key={index} className="bg-white/5 p-4 rounded-xl text-sm text-gray-300 border-l-4 border-cyan-500 pl-4 leading-relaxed shadow-sm">
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
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 shadow-lg">
              <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2"><Briefcase className="w-6 h-6" /> Target Role Alignment Vector</h2>
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <p className="text-sm text-gray-300 leading-relaxed">Your resume layout shares a keyword and structural commonality index of <span className="text-purple-400 font-black">{jobMatch}%</span> with the target description schema provided.</p>
              </div>
            </div>
          )}

          {activeTab === "optimized" && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2"><Sparkles className="w-6 h-6" /> AI Engineered Workspace Text</h2>
                {pdfDownload && (
                  <a
                    href={`${API}/download-resume/`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto text-center bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-200 shadow-md shadow-green-500/10"
                  >
                    Download Compiled PDF
                  </a>
                )}
              </div>
              <textarea
                readOnly
                rows="14"
                value={optimizedResume || "AI payload configuration text will render contextually here."}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-gray-300 font-mono text-xs focus:outline-none resize-none leading-relaxed shadow-inner"
              />
            </div>
          )}
        </section>

      </main>
    </div>
  )
}

export default App