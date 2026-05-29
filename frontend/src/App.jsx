import React, { useState } from "react"
import axios from "axios"
import { 
  FolderUp, 
  LayoutDashboard, 
  Brain, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Loader2,
  RefreshCw
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
  const [hasData, setHasData] = useState(false) 

  // Pipeline Analysis Output States
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

  const handleReset = () => {
    setFile(null)
    setJobDescription("")
    setHasData(false)
    setAtsScore(0)
    setSkills([])
    setFeedback([])
    setJobMatch(0)
    setOptimizedResume("")
    setActiveTab("dashboard")
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !jobDescription.trim()) {
      alert("Please upload a resume file and paste a job description.")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("job_description", jobDescription)

      const response = await axios.post(`${API}/upload-resume/`, formData)

      if (!response.data) {
        throw new Error("Empty response received from server.")
      }

      console.log("Raw Server Response Payload:", response.data)

      // --- CRITICAL FIX: EXACT ROADMAP MATCHING YOUR BACKEND PAYLOAD ---
      
      // 1. Core Skills Array Mapping
      if (Array.isArray(response.data.skills)) {
        setSkills(response.data.skills)
      } else {
        setSkills([])
      }

      // 2. Feedback Array Mapping
      if (Array.isArray(response.data.feedback)) {
        setFeedback(response.data.feedback)
      } else {
        setFeedback([])
      }

      // 3. ATS Score Mapping (Matches your payload: response.data.analysis.ats_score)
      const detectedAtsScore = response.data.analysis?.ats_score ?? response.data.ats_score ?? 0
      setAtsScore(detectedAtsScore)

      // 4. Job Match Score Mapping (Matches your payload: response.data.job_match.match_score)
      const detectedMatchScore = response.data.job_match?.match_score ?? response.data.job_match ?? 0
      setJobMatch(detectedMatchScore)

      // 5. System Analysis Level
      const detectedLevel = response.data.analysis?.level || "Advanced"
      setAnalysis(`Level: ${detectedLevel}`)

      // 6. Optimized Resume String/JSON Content
      setOptimizedResume(response.data.optimized_resume || "")
      setPdfDownload(response.data.pdf_download || "")

      // Force UI state transformation to render panels
      setHasData(true)
      setActiveTab("dashboard")

    } catch (error) {
      console.error("Upload execution error:", error)
      alert(`Analysis failed: ${error.response?.data?.detail || error.message || "Unknown error."}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] text-white font-sans antialiased">
      
      {/* Desktop Sidebar Control Deck */}
      <aside className="w-80 bg-black/40 border-r border-white/5 flex-col justify-between p-6 backdrop-blur-xl hidden lg:flex">
        <div className="space-y-10">
          <div className="flex items-center gap-3 pl-2">
            <div className="bg-gradient-to-tr from-cyan-500 to-purple-500 p-2.5 rounded-2xl shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">JobFit AI</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">ATS Engine</p>
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
                  <IconComponent className={`w-5 h-5 ${isSelected ? "text-cyan-400" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-black/40 border-b border-white/5 p-4 flex items-center justify-between backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="font-black text-sm tracking-tight">JobFit AI Mobile</span>
        </div>
        {hasData && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-14 space-y-6 pb-24 lg:pb-14">
        
        <header className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Processing Dashboard</h2>
            <p className="text-xs text-gray-400 mt-0.5">Real-time ATS parsing parameters.</p>
          </div>
        </header>

        {/* INPUT MODE: Hides entirely once hasData becomes true */}
        {!hasData ? (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-2xl">
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="flex flex-col gap-4">
                
                <div>
                  <label className="text-xs font-bold text-gray-300 mb-1.5 block uppercase">Source Document (PDF)</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl bg-black/20 p-6 flex flex-col items-center justify-center min-h-[120px] relative">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    <FolderUp className="w-6 h-6 text-gray-400 mb-1" />
                    <p className="text-xs font-bold text-center">{file ? file.name : "Select your target resume"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 mb-1.5 block uppercase">Target Job Matrix</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste technical requirements..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-gray-300 focus:outline-none min-h-[120px] resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black py-3 rounded-xl font-extrabold text-xs tracking-wide shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Evaluating Matrix...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-black" />
                    Analyze Resume Matrix
                  </>
                )}
              </button>
            </form>
          </section>
        ) : (
          
          /* OUTPUT METRICS MODE: Becomes visible immediately upon successful submission */
          <section className="space-y-4">
            
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-lg">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Overall ATS Score</h3>
                  <p className="text-5xl font-black text-cyan-400 mt-2">{atsScore}%</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-lg">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Job Matching Ratio</h3>
                  <p className="text-5xl font-black text-purple-400 mt-2">{jobMatch}%</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-lg">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Extracted Skills</h3>
                  <p className="text-5xl font-black text-green-400 mt-2">{skills.length}</p>
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2"><Brain className="w-4 h-4" /> Core Skills</h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.length === 0 ? (
                    <p className="text-xs text-gray-500">No skills parsed.</p>
                  ) : (
                    skills.map((skill, index) => (
                      <span key={index} className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase">
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "analysis" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2"><FileText className="w-4 h-4" /> Structural Assessment</h2>
                <div className="space-y-2">
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <h4 className="text-[9px] text-purple-400 uppercase font-extrabold">Category Summary</h4>
                    <p className="text-gray-300 text-xs font-bold mt-0.5">{analysis}</p>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <h4 className="text-[9px] text-gray-400 uppercase font-extrabold mb-1">Checkpoints</h4>
                    {feedback.length === 0 ? (
                      <p className="text-xs text-gray-500">No feedback checkpoints returned.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {feedback.map((item, index) => (
                          <li key={index} className="text-xs text-gray-300 list-disc list-inside">
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
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Alignment Vector</h2>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-300">Your profile matches <span className="text-purple-400 font-black">{jobMatch}%</span> of the framework target parameters.</p>
                </div>
              </div>
            )}

            {activeTab === "optimized" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Engineered Text</h2>
                <textarea
                  readOnly
                  rows="10"
                  value={optimizedResume || "Optimization matrix data complete."}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-gray-300 font-mono text-[10px] focus:outline-none resize-none"
                />
              </div>
            )}
          </section>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Deck */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-white/10 backdrop-blur-lg flex justify-around p-2 z-50">
        {[
          { id: "dashboard", label: "Home", icon: LayoutDashboard },
          { id: "skills", label: "Skills", icon: Brain },
          { id: "analysis", label: "Analysis", icon: FileText },
          { id: "jobmatch", label: "Match", icon: Briefcase },
          { id: "optimized", label: "AI Text", icon: Sparkles }
        ].map((tab) => {
          const IconComponent = tab.icon
          const isSelected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={!hasData && tab.id !== "dashboard"}
              type="button"
              className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all ${
                isSelected ? "text-cyan-400 font-bold" : "text-gray-500"
              } disabled:opacity-20`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-[9px]">{tab.label}</span>
            </button>
          )
        })}
      </nav>

    </div>
  )
}

export default App