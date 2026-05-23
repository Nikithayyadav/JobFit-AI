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

    if (!file) {

      alert("Please select a resume")

      return
    }

    if (!jobDescription) {

      alert("Please paste a job description")

      return
    }

    setLoading(true)

    const formData = new FormData()

    formData.append("file", file)

    formData.append("job_description", jobDescription)

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/upload-resume/",
        formData
      )

      setResumeText(response.data.text)

      setSkills(response.data.skills)

      setAtsScore(response.data.ats_score)

      setFeedback(response.data.feedback)

      setAnalysis(response.data.analysis)

      setJobMatch(response.data.job_match)

      setOptimizedResume(response.data.optimized_resume)

      setPdfDownload(response.data.pdf_download)

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

        {/* Analytics Cards */}

        {analysis && (

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

            {/* ATS Score */}

            <div className="bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-xl p-8 rounded-3xl">

              <p className="text-cyan-300 text-sm mb-3">
                ATS Score
              </p>

              <h2 className="text-5xl font-bold text-cyan-400">
                {atsScore}%
              </h2>

            </div>

            {/* Level */}

            <div className="bg-purple-500/10 border border-purple-400/20 backdrop-blur-xl p-8 rounded-3xl">

              <p className="text-purple-300 text-sm mb-3">
                Resume Level
              </p>

              <h2 className="text-3xl font-bold text-purple-300">
                {analysis.level}
              </h2>

            </div>

            {/* Category */}

            <div className="bg-pink-500/10 border border-pink-400/20 backdrop-blur-xl p-8 rounded-3xl">

              <p className="text-pink-300 text-sm mb-3">
                Category
              </p>

              <h2 className="text-2xl font-bold text-pink-300">
                {analysis.category}
              </h2>

            </div>

            {/* Skills */}

            <div className="bg-yellow-500/10 border border-yellow-400/20 backdrop-blur-xl p-8 rounded-3xl">

              <p className="text-yellow-300 text-sm mb-3">
                Total Skills
              </p>

              <h2 className="text-5xl font-bold text-yellow-300">
                {analysis.total_skills}
              </h2>

            </div>

          </div>

        )}

        {/* Dashboard */}

        {analysis && activeTab === "dashboard" && (

          <div className="grid xl:grid-cols-2 gap-8 mt-10">

            {/* Feedback */}

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

              <h2 className="text-3xl font-bold mb-8">
                AI Feedback
              </h2>

              <div className="space-y-5">

                {feedback.map((item, index) => (

                  <div
                    key={index}
                    className="bg-black/20 border border-white/10 p-5 rounded-2xl"
                  >
                    {item}
                  </div>

                ))}

              </div>

            </div>

            {/* Resume Preview */}

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

              <h2 className="text-3xl font-bold mb-8">
                Resume Preview
              </h2>

              <div className="bg-black/20 border border-white/10 p-6 rounded-2xl max-h-[500px] overflow-y-auto whitespace-pre-wrap text-gray-300">
                {resumeText}
              </div>

            </div>

          </div>

        )}

        {/* Skills */}

        {analysis && activeTab === "skills" && (

          <div className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Extracted Skills
            </h2>

            <div className="flex flex-wrap gap-4">

              {skills.map((skill, index) => (

                <div
                  key={index}
                  className="bg-cyan-400/20 border border-cyan-400/30 px-5 py-3 rounded-full font-semibold"
                >
                  {skill}
                </div>

              ))}

            </div>

          </div>

        )}

        {/* Analysis */}

        {analysis && activeTab === "analysis" && (

          <div className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              AI Recommendations
            </h2>

            <div className="space-y-5">

              {analysis.recommendations.length > 0 ? (

                analysis.recommendations.map((item, index) => (

                  <div
                    key={index}
                    className="bg-black/20 border border-white/10 p-5 rounded-2xl"
                  >
                    {item}
                  </div>

                ))

              ) : (

                <div className="bg-green-500/20 border border-green-400/20 p-5 rounded-2xl">
                  Your resume looks excellent overall.
                </div>

              )}

            </div>

          </div>

        )}

        {/* Job Match */}

        {analysis && activeTab === "jobmatch" && jobMatch && (

          <div className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-10">
              Job Match Analysis
            </h2>

            {/* Match Score */}

            <div className="mb-12">

              <div className="flex justify-between mb-4">

                <p className="text-lg font-semibold">
                  Match Score
                </p>

                <p className="text-cyan-400 font-bold text-xl">
                  {jobMatch.match_score}%
                </p>

              </div>

              <div className="w-full bg-black/30 rounded-full h-6 overflow-hidden">

                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-6 rounded-full transition-all duration-500"
                  style={{ width: `${jobMatch.match_score}%` }}
                />

              </div>

            </div>

            {/* Skills Comparison */}

            <div className="grid lg:grid-cols-2 gap-10">

              {/* Matched Skills */}

              <div>

                <h3 className="text-2xl font-bold mb-5">
                  Matched Skills
                </h3>

                <div className="flex flex-wrap gap-4">

                  {jobMatch.matched_skills.map((skill, index) => (

                    <div
                      key={index}
                      className="bg-green-500/20 border border-green-400/30 px-5 py-3 rounded-full"
                    >
                      {skill}
                    </div>

                  ))}

                </div>

              </div>

              {/* Missing Skills */}

              <div>

                <h3 className="text-2xl font-bold mb-5">
                  Missing Skills
                </h3>

                <div className="flex flex-wrap gap-4">

                  {jobMatch.missing_skills.map((skill, index) => (

                    <div
                      key={index}
                      className="bg-red-500/20 border border-red-400/30 px-5 py-3 rounded-full"
                    >
                      {skill}
                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        )}

        {/* Optimized Resume */}

        {analysis && activeTab === "optimized" && (

          <div className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

              <h2 className="text-3xl font-bold">
                AI Optimized Resume
              </h2>

              <a
                href="http://127.0.0.1:8000/download-resume/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
              >

                <Download size={20} />

                Download PDF

              </a>

            </div>

            <div className="bg-black/20 border border-white/10 p-6 rounded-2xl whitespace-pre-wrap text-gray-300 max-h-[700px] overflow-y-auto leading-relaxed">
              {optimizedResume}
            </div>

          </div>

        )}

      </main>

    </div>

  )
}

export default App