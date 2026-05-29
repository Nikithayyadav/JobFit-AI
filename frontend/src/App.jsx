import React, { useState } from "react"
import axios from "axios"
import { 
  FolderUp, 
  LayoutDashboard, 
  Brain, 
  FileText, 
  Sparkles, 
  Loader2,
  RefreshCw
} from "lucide-react"

const API = "https://jobfit-ai-backend-qisq.onrender.com" 

function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasData, setHasData] = useState(false) 

  const [filename, setFilename] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [skills, setSkills] = useState([])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleReset = () => {
    setFile(null)
    setJobDescription("")
    setHasData(false)
    setFilename("")
    setResumeText("")
    setSkills([])
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
        throw new Error("Empty response received from the processing engine.")
      }

      setFilename(response.data.filename || "Uploaded Document")
      setResumeText(response.data.text || "")
      setSkills(Array.isArray(response.data.skills) ? response.data.skills : [])
      setHasData(true)
      setActiveTab("dashboard")

    } catch (error) {
      console.error(error)
      alert(`Analysis failed: ${error.response?.data?.detail || error.message || "Server Error."}`)
    } finally {
      setLoading(false)
    }
  }

  const computedAtsScore = skills.length > 0 ? Math.min(60 + skills.length * 2, 98) : 0
  const computedMatchRatio = skills.length > 0 ? Math.min(55 + skills.length * 3, 95) : 0

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] text-white font-sans antialiased">
      <aside className="w-80 bg-black/40 border-r border-white/5 flex-col justify-between p-6 backdrop-blur-xl hidden lg:flex">
        <div className="space-y-10">
          <div className="flex items-center gap-3 pl-2">
            <div className="bg-gradient-to-tr from-cyan-500 to-purple-500 p-2.5 rounded-2xl shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">JobFit AI</h1>
            </div>
          </div>
          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Dashboard Metrics", icon: LayoutDashboard },
              { id: "skills", label: "Core Parsed Skills", icon: Brain },
              { id: "text", label: "Extracted Content", icon: FileText }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id ? "bg-white/10 text-cyan-400 shadow-lg" : "text-gray-400"
                  }`}
                >
                  <IconComponent className="w-5 h-5" /> {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-14 space-y-6 pb-24">
        {!hasData ? (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-white/10 rounded-xl bg-black/20 p-6 flex flex-col items-center justify-center relative">
                <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <FolderUp className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-xs font-bold">{file ? file.name : "Select your target resume"}</p>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job criteria..."
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-gray-300 min-h-[120px]"
              />
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black py-3 rounded-xl font-bold text-xs">
                {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : "Analyze Resume Matrix"}
              </button>
            </form>
          </section>
        ) : (
          <section className="space-y-4">
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <h3 className="text-gray-400 text-xs font-bold">Overall ATS Score</h3>
                  <p className="text-5xl font-black text-cyan-400 mt-1.5">{computedAtsScore}%</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <h3 className="text-gray-400 text-xs font-bold">Job Matching Ratio</h3>
                  <p className="text-5xl font-black text-purple-400 mt-1.5">{computedMatchRatio}%</p>
                </div>
              </div>
            )}
            {activeTab === "skills" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, i) => (
                    <span key={i} className="bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "text" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <textarea readOnly rows="12" value={resumeText} className="w-full bg-black/40 text-gray-300 font-mono text-[10px] p-3 rounded-xl" />
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App