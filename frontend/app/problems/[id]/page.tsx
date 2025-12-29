"use client"

import React, { useEffect, useState, useRef, use, useCallback } from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import { AlertCircle, Check, Clock, CloudCog, X } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const defaultCode: Record<string, string> = {
  javascript: '// Write your code here\nfunction solution() {\n  // Your solution\n  return;\n}',
  python: '# Write your code here\ndef solution():\n    # Your solution\n    return',
  cpp: '// Write your code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution\n    return 0;\n}'
}

async function fetchProblemServer(id: string) {
  try {
    const res = await axios.get(`http://localhost:4000/api/v1/problems/${id}`)
    console.log(res.data)
    return res.data?.data || res.data || null
  } catch (e) {
    console.error('Error fetching problem:', e)
    return null
  }
}


export default function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [problem, setProblem] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'submit' | 'submissions'>('submit')
  const { toast } = useToast()
  
  // Resizable Layout State
  const [leftWidth, setLeftWidth] = useState(50) // Percentage
  const [isDragging, setIsDragging] = useState(false)

  const startResizing = useCallback(() => {
    setIsDragging(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsDragging(false)
  }, [])

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isDragging) {
        const newLeftWidth = (mouseMoveEvent.clientX / window.innerWidth) * 100
        if (newLeftWidth > 20 && newLeftWidth < 80) { // Limit between 20% and 80%
          setLeftWidth(newLeftWidth)
        }
      }
    },
    [isDragging]
  )

  useEffect(() => {
    window.addEventListener("mousemove", resize)
    window.addEventListener("mouseup", stopResizing)
    return () => {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [resize, stopResizing])

  // Editor State
  const [code, setCode] = useState<string>(defaultCode.javascript)
  const [language, setLanguage] = useState<string>('javascript')
  const [submitting, setSubmitting] = useState(false)
  const [evalResult, setEvalResult] = useState<any | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  // Submissions State
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)

  useEffect(() => {
    const loadProblem = async () => {
      setLoading(true)
      const data = await fetchProblemServer(id)
      setProblem(data)
      setLoading(false)
    }
    loadProblem()

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [id])

  useEffect(() => {
    setCode(defaultCode[language] || defaultCode.javascript)
  }, [language])

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true)
    try {
      const res = await axios.get(`http://localhost:3001/api/v1/submissions/problem/${id}`)
      const data = res.data?.data || res.data || []
      setSubmissions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoadingSubmissions(false)
    }
  }

  // Fetch submissions when tab changes to 'submissions'
  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions()
    }
  }, [activeTab, id])

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit your code",
        variant: "destructive"
      })
      return 
    }

    let userId = ''
    try {
      const decoded: any = jwtDecode(token)
      userId = decoded.id || decoded.sub || decoded.userId
      if (!userId) throw new Error('Invalid token payload')
    } catch (e) {
      toast({
        title: "Session Expired",
        description: "Invalid or expired session. Please sign in again.",
        variant: "destructive"
      })
      localStorage.removeItem('token')
      window.location.href = '/signin'
      return
    }

    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please write some code before submitting",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    setEvalResult(null)
    setStatus('QUEUED')

    try {
      const submissionRes = await axios.post(
        'http://localhost:5000/submissionservice/api/v1/submissions/create', 
        {
          problemId: id,
          userId: userId,
          language,
          code
        },
        {
           headers: {
             'Authorization': `Bearer ${token}`
           }
        }
      )

      const submissionData = submissionRes.data?.data || submissionRes.data
      const submissionId = submissionData?._id || submissionData?.id || null

      if (!submissionId) {
        throw new Error('Failed to get submission ID')
      }

      let pollCount = 0
      const maxPolls = 60

      pollRef.current = setInterval(async () => {
        pollCount++
        if (pollCount > maxPolls) {
           if (pollRef.current) clearInterval(pollRef.current)
           setStatus('TIMEOUT')
           setSubmitting(false)
           return
        }

        try {
          const r = await axios.get(`http://localhost:3001/api/v1/submissions/${submissionId}`)
          const currentSubmission = r.data?.data || r.data
          const currentStatus = currentSubmission?.status
          
          setStatus(currentStatus || 'UNKNOWN')

          const terminalStatuses = ['SUCCESS', 'FAILED', 'COMPLETED', 'ERROR', 'TIMEOUT']
          
          if (currentStatus && terminalStatuses.includes(String(currentStatus).toUpperCase())) {
            if (pollRef.current) clearInterval(pollRef.current)
            
            const details = currentSubmission.submissionData || {}
            
            setEvalResult({ 
               status: currentStatus, 
               details: details,
               submission: currentSubmission
            })
            setSubmitting(false)
          }
        } catch (err: any) {
           if (err.response?.status !== 404) console.error(err)
        }
      }, 2000)
    
    } catch (err: any) {
      console.error(err)
      setStatus('ERROR')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-bg text-white flex items-center justify-center p-4">
        <div className="text-center text-textSecondary">Problem not found</div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-[#111] text-white flex flex-col lg:flex-row overflow-hidden relative" onMouseUp={stopResizing}>
      
      {/* LEFT PANEL: Desc & Test Cases */}
      <div 
        className="p-6 overflow-y-auto h-full border-r border-borderZ scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        style={{ width: `${leftWidth}%` }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm">
             {problem.statement || problem.description}
          </div>
        </div>

        {/* Dynamic Test Cases Section */}
        <div className="space-y-6 mt-8">
          {problem.testcases && problem.testcases.length > 0 ? (
            problem.testcases.map((testcase: any, index: number) => (
              <div key={testcase._id || index}>
                <h3 className="font-semibold text-white mb-2">Test case {index + 1}</h3>
                <div className="mb-2">
                  <span className="text-xs text-gray-500 block mb-1">Input</span>
                  <div className="bg-[#1e1e1e] p-3 rounded-md text-sm font-mono text-gray-300">
                    {testcase.input}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Output</span>
                  <div className="bg-[#1e1e1e] p-3 rounded-md text-sm font-mono text-gray-300">
                    {testcase.output}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No test cases available.</div>
          )}
        </div>
      </div>

      {/* Resizer Handle */}
      <div
        className="w-1 bg-borderZ hover:bg-primary cursor-col-resize transition-colors hidden lg:block"
        onMouseDown={startResizing}
      />

      {/* RIGHT PANEL: Tabs & Editor */}
      <div 
        className="bg-[#1e1e1e] flex flex-col h-full"
        style={{ width: `${100 - leftWidth}%` }}
      >
        
        {/* Tabs Header */}
        <div className="flex bg-[#111] border-b border-borderZ">
           <button 
             onClick={() => setActiveTab('submit')}
             className={`px-6 py-3 text-sm font-medium transition-colors relative ${
               activeTab === 'submit' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
             }`}
           >
             Submit
             {activeTab === 'submit' && (
               <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
             )}
           </button>
           <button 
             onClick={() => setActiveTab('submissions')}
             className={`px-6 py-3 text-sm font-medium transition-colors relative ${
               activeTab === 'submissions' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
             }`}
           >
             Submissions
             {activeTab === 'submissions' && (
               <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
             )}
           </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* SUBMIT TAB */}
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${activeTab === 'submit' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             
             {/* Language Bar */}
             <div className="p-2 border-b border-borderZ bg-[#1e1e1e] flex justify-between items-center">
               <div className="px-2">
                 <span className="text-xs text-gray-400 mr-2">Language</span>
                 <select 
                   value={language}
                   onChange={(e) => setLanguage(e.target.value)}
                   className="bg-[#2d2d2d] text-white text-xs border-none rounded p-1 focus:ring-0 cursor-pointer"
                 >
                   <option value="javascript">Javascript</option>
                   <option value="python">Python</option>
                   <option value="cpp">C++</option>
                 </select>
               </div>
             </div>

             {/* Editor Container */}
             <div className="flex-1 min-h-0 pb-12">
               <MonacoEditor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(v) => typeof v === 'string' && setCode(v)}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16 }
                  }}
               />
             </div>

             {/* Action Bar & Results */}
             <div className="p-4 bg-[#1e1e1e] border-t border-borderZ">
               {/* Test Results Area (Shows when result avail) */}
               <AnimatePresence>
                 {(status || evalResult) && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="mb-4 overflow-hidden"
                   >
                     <div className="flex items-center gap-2 mb-2">
                        {status === 'QUEUED' && <span className="text-yellow-500 text-sm flex items-center gap-1"><Clock size={14}/> Queued</span>}
                        {status === 'PROCESSING' && <span className="text-blue-500 text-sm flex items-center gap-1"><Clock size={14}/> Processing</span>}
                        {evalResult?.status === 'SUCCESS' && <span className="text-green-500 text-sm font-bold flex items-center gap-1"><Check size={16}/> Accepted!</span>}
                        {evalResult?.status === 'FAILED' && <span className="text-red-500 text-sm font-bold flex items-center gap-1"><X size={16}/> Wrong Answer</span>}
                     </div>
                     
                     {/* Dynamic Test Case Bubbles */}
                     <div className="flex gap-3 flex-wrap">
                        {problem?.testcases?.map((testcase: any, index: number) => {
                           const status = evalResult?.details?.[testcase._id];
                           const isAccepted = status === 'AC';
                           const isWrong = status === 'WA';
                           
                           // If no specific status found but overall success/fail, might fallback or just show knowns.
                           // Assuming details contains all keys for now.
                           if (!status) return null;

                           return (
                             <div 
                               key={testcase._id || index}
                               className={`border px-4 py-2 rounded-lg flex flex-col items-center min-w-[80px] ${
                                 isAccepted 
                                    ? 'border-green-500/30 bg-green-500/10 text-green-500' 
                                    : 'border-red-500/30 bg-red-500/10 text-red-500'
                               }`}
                             >
                               <span className="text-xs text-gray-400 mb-1">Test #{index + 1}</span>
                               {isAccepted ? <Check size={18} /> : <X size={18} />}
                             </div>
                           )
                        })}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="flex justify-end gap-3">
                 <button className="px-6 py-2 rounded bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white font-medium text-sm transition-colors">
                   Run
                 </button>
                 <button 
                   onClick={handleSubmit} 
                   disabled={submitting}
                   className="px-6 py-2 rounded bg-white text-black hover:bg-gray-200 font-bold text-sm transition-colors disabled:opacity-50"
                 >
                   {submitting ? 'Submitting...' : 'Submit'}
                 </button>
               </div>
             </div>
          </div>


          {/* SUBMISSIONS TAB */}
          <div className={`absolute inset-0 bg-[#000] p-6 overflow-y-auto transition-opacity duration-300 ${activeTab === 'submissions' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <h3 className="text-lg font-bold mb-4">Your Submissions</h3>
             
             {loadingSubmissions ? (
                <div className="text-gray-500 text-sm">Loading...</div>
             ) : submissions.length === 0 ? (
                <div className="text-gray-500 text-sm">No submissions yet.</div>
             ) : (
                <div className="w-full text-left border-collapse">
                   <div className="grid grid-cols-4 gap-4 text-xs font-semibold text-gray-500 border-b border-gray-800 pb-2 mb-2">
                      <div>Result</div>
                      <div>Tests Passed</div>
                      <div>Time</div>
                      <div>Memory</div>
                   </div>
                   {submissions.map((sub, i) => {
                     const isSuccess = sub.status === 'SUCCESS' || sub.status === 'COMPLETED'
                     return (
                      <div key={i} className="grid grid-cols-4 gap-4 text-sm py-3 border-b border-gray-900 items-center hover:bg-white/5 rounded px-2 -mx-2 transition-colors">
                        <div className={`flex items-center gap-2 font-medium ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                           {isSuccess ? <Check size={16}/> : <X size={16}/>}
                           {isSuccess ? 'Accepted' : 'Wrong Answer'}
                        </div>
                        <div className="text-gray-300">4/4</div>
                        <div className="text-gray-300">0.003s</div>
                        <div className="text-gray-300">3552 KB</div>
                      </div>
                   )})}
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  )
}
