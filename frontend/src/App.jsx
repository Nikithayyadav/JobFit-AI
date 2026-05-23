import { useState } from "react"

import axios from "axios"

import {
  LayoutDashboard,
  FileText,
  Brain,
  Briefcase,
  Sparkles,
  Upload,
  Download,
} from "lucide-react"

// API URL

const API = import.meta.env.VITE_API_URL

function App() {

  // States

  const [file, setFile] = useState(null)

  const [jobDescription, setJobDescription] = useState("")

  const [resumeText, setResumeText] = useState("")

  const [skills, setSkills] = useState([])

  const [atsScore, setAtsScore] = useState(0)

  const [feedback, setFeedback] = useState([])

  const [analysis, setAnalysis] = useState(null)

  const [jobMatch, setJobMatch] = useState(null)

  const [optimizedResume, setOptimizedResume] = useState("")

  const [pdfDownload, setPdfDownload] = useState("")

  const [loading, setLoading] = useState(false)

  const [activeTab, setActiveTab] = useState("dashboard")

  // Upload Handler

  const handleUpload = async () => {

    // Validate Resume

    if (!file) {

      alert("Please select a resume")

      return
    }

    // Validate Job Description

    if (!jobDescription.trim()) {

      alert("Please paste a job description")

      return
    }

    try {

      // Start Loading

      setLoading(true)

      // Form Data

      const formData = new FormData()

      formData.append("file", file)

      formData.append(
        "job_description",
        jobDescription
      )

      // API Request

      const response = await axios.post(

        `${API}/upload-resume/`,

        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      // Store Response

      setResumeText(response.data.text)

      setSkills(response.data.skills)

      setAtsScore(response.data.ats_score)

      setFeedback(response.data.feedback)

      setAnalysis(response.data.analysis)

      setJobMatch(response.data.job_match)

      setOptimizedResume(response.data.optimized_resume)

      setPdfDownload(response.data.pdf_download)

      // Switch Dashboard

      setActiveTab("dashboard")

    } catch (error) {

      console.log(error)

      alert("Upload failed")

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] text-white">

      {/* Sidebar */}

      <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 p-8 hidden lg:flex flex-col">

        {/* Logo */}

        <div className="flex items-center gap-4 mb-16">

          <div className="bg-cyan-400 p-3 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.4)]">

            <Sparkles size={30} className="text-black" />

          </div>

          <div>

            <h1 className="text-3xl font-bold">
              JobFit AI
            </h1>

            <p className="text-gray-400 text-sm">
              AI Resume Optimization Platform
            </p>

          </div>

        </div>

        {/* Navigation */}

        <nav className="space-y-4">

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${
              activeTab === "dashboard"
                ? "bg-cyan-400 text-black font-bold shadow-lg"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <LayoutDashboard />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${
              activeTab === "skills"
                ? "bg-cyan-400 text-black font-bold shadow-lg"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Brain />
            Skills
          </button>

          <button
            onClick={() => setActiveTab("analysis")}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${
              activeTab === "analysis"
                ? "bg-cyan-400 text-black font-bold shadow-lg"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <FileText />
            Analysis
          </button>

          <button
            onClick={() => setActiveTab("jobmatch")}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${
              activeTab === "jobmatch"
                ? "bg-cyan-400 text-black font-bold shadow-lg"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Briefcase />
            Job Match
          </button>

          <button
            onClick={() => setActiveTab("optimized")}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${
              activeTab === "optimized"
                ? "bg-cyan-400 text-black font-bold shadow-lg"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Sparkles />
            Optimized Resume
          </button>

        </nav>

      </aside>

      {/* Main Content */}

      <main className="flex-1 overflow-y-auto p-8 lg:p-12">

        {/* Hero Section */}

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[36px] p-10 shadow-2xl">

          <div className="flex flex-col lg:flex-row lg:justify-between gap-12">

            {/* Left */}

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-5 py-2 rounded-full mb-6">

                <Sparkles size={18} className="text-cyan-400" />

                <span className="text-cyan-300 text-sm">
                  AI-Powered ATS Optimization
                </span>

              </div>

              <h1 className="text-6xl font-bold leading-tight">

                JobFit AI

              </h1>

              <p className="text-gray-300 mt-6 text-lg leading-relaxed">

                Analyze resumes against real job descriptions,
                detect missing skills, optimize ATS score,
                and generate AI-enhanced resumes instantly.

              </p>

            </div>

            {/* Upload Box */}

            <label className="w-full lg:w-[420px] h-64 border-2 border-dashed border-cyan-400/30 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-400/5 transition-all duration-300 bg-black/20">

              <Upload size={52} className="text-cyan-400 mb-5" />

              <p className="text-2xl font-semibold">
                Upload Resume
              </p>

              <p className="text-gray-400 mt-2">
                PDF files only
              </p>

              {file && (

                <div className="mt-5 bg-green-500/20 border border-green-400/20 px-4 py-2 rounded-xl">

                  <p className="text-green-400 text-sm">
                    {file.name}
                  </p>

                </div>

              )}

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />

            </label>

          </div>

          {/* Job Description */}

          <div className="mt-10">

            <label className="block text-xl font-semibold mb-4">
              Paste Job Description
            </label>

            <textarea
              rows="8"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full bg-black/20 border border-white/10 rounded-3xl p-6 text-gray-300 focus:outline-none focus:border-cyan-400 resize-none"
            />

          </div>

          {/* Analyze Button */}

          <div className="mt-8">

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >

              {loading ? "Analyzing..." : "Analyze Resume"}

            </button>

          </div>

        </div>

      </main>

    </div>

  )
}

export default App