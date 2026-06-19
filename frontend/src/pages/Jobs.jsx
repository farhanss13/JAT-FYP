import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { Upload, Link as LinkIcon, Edit2, Trash2, Calendar, Mail, FileCheck, Search, Filter } from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [docType, setDocType] = useState("resume");

  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [form, setForm] = useState({
    positionTitle: "",
    company: "",
    dateApplied: "",
    jobLink: "",
    contact: "",
    status: "Applied",
  });

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (companyFilter) params.append("company", companyFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const query = params.toString() ? `/jobs?${params.toString()}` : "/jobs";

      const res = await API.get(query);
      setJobs(res.data);
    } catch {
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, companyFilter, statusFilter, startDate, endDate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateFile = (file) => {
    if (!file) return null;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOC, DOCX files are allowed");
      return null;
    }

    if (file.size > maxSize) {
      toast.error("File size must be up to 10 MB");
      return null;
    }

    return file;
  };

  const handleFileSelect = (file) => {
    const validFile = validateFile(file);
    if (!validFile) return;
    setUploadFile(validFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let jobIdForUpload = editingId;

      // UPDATE JOB
      if (editingId) {
        await API.put(`/jobs/${editingId}`, form);
        toast.success("Job updated");
        setEditingId(null);
      }
      // CREATE JOB
      else {
        const created = await API.post("/jobs", form);
        jobIdForUpload = created.data?.job?._id;
        toast.success("Job added");
      }

      // UPLOAD DOCUMENT (WITH TYPE)
      if (uploadFile && jobIdForUpload) {
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("jobId", jobIdForUpload);
        formData.append("type", docType);

        await API.post("/documents", formData);
      }

      // RESET FORM
      setForm({
        positionTitle: "",
        company: "",
        dateApplied: "",
        jobLink: "",
        contact: "",
        status: "Applied",
      });

      setUploadFile(null);
      setDocType("resume");

      fetchJobs();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Deleted");
      fetchJobs();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (job) => {
    setForm({
      positionTitle: job.positionTitle,
      company: job.company || "",
      dateApplied: job.dateApplied ? job.dateApplied.slice(0, 10) : "",
      jobLink: job.jobLink || "",
      contact: job.contact || "",
      status: job.status,
    });
    setEditingId(job._id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Interview":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Offer":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Screening":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Applications</h1>
        <p className="mt-1 text-slate-500">Add, filter, and track all your logged job applications</p>
      </div>

      {/* TWO COLUMN CONTENT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: LIST + FILTERS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* FILTERS CARD */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-semibold border-b border-slate-100 pb-3">
              <Filter className="h-4 w-4 text-indigo-500" />
              <span>Search & Filter Applications</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  placeholder="Search by Position..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <input
                placeholder="Company..."
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
              />

              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                className="cursor-pointer w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
              >
                <option value="">All Statuses</option>
                <option>Applied</option>
                <option>Screening</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>

              <input
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white text-slate-600"
              />
            </div>
          </div>

          {/* SAVED APPLICATIONS LIST CARD */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">Saved Applications</h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-xl border border-slate-100 bg-white p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between group"
                >
                  <div className="space-y-1">
                    <h3
                      onClick={() => (window.location.href = `/job/${job._id}`)}
                      className="font-bold text-lg cursor-pointer text-indigo-600 hover:text-indigo-500 hover:underline"
                    >
                      {job.positionTitle}
                    </h3>
                    <p className="text-sm font-semibold text-slate-700">{job.company || "No Company Specified"}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {job.dateApplied ? new Date(job.dateApplied).toLocaleDateString() : "-"}
                      </span>
                      {job.contact && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {job.contact}
                        </span>
                      )}
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0 border-t border-slate-50 pt-3 sm:pt-0 sm:border-none">
                    <button
                      type="button"
                      onClick={() => handleEdit(job)}
                      className="cursor-pointer flex items-center justify-center p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white transition-colors duration-150"
                      title="Edit application"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(job._id)}
                      className="cursor-pointer flex items-center justify-center p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors duration-150"
                      title="Delete application"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {jobs.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-500 font-medium">No applications found matching filters.</p>
                  <p className="text-xs text-slate-400 mt-1">Try refining search parameters or add a new job card.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ADD/EDIT FORM (5 COLS) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {editingId ? "Update Application" : "New Application"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {editingId ? "Edit the fields to modify this application" : "Track a new job opportunity"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Company Name</label>
                <input
                  name="company"
                  placeholder="e.g., Google, Microsoft"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Position / Job Title</label>
                <input
                  name="positionTitle"
                  placeholder="e.g., Software Engineer"
                  value={form.positionTitle}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Job Posting Link</label>
                <div className="relative">
                  <LinkIcon className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    name="jobLink"
                    placeholder="https://example.com/job"
                    value={form.jobLink}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Date Applied</label>
                  <input
                    type="date"
                    name="dateApplied"
                    value={form.dateApplied}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white text-slate-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                  >
                    <option>Applied</option>
                    <option>Screening</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact / Recruiter Email</label>
                <input
                  name="contact"
                  type="email"
                  placeholder="recruiter@company.com"
                  value={form.contact}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold">
                  <FileCheck className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm">Attach Document (Optional)</span>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-3">
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="resume">Resume</option>
                    <option value="coverLetter">Cover Letter</option>
                    <option value="other">Other Attachment</option>
                  </select>
                </div>

                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileSelect(e.dataTransfer.files[0]);
                  }}
                  className={`block cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50/50"
                      : "border-slate-200 bg-slate-50 hover:border-indigo-400"
                  }`}
                >
                  <Upload className="mx-auto mb-2 h-6 w-6 text-indigo-500" />
                  <p className="text-xs font-semibold text-slate-700">Click or Drag document here</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">PDF, DOC, DOCX up to 10 MB</p>
                  {uploadFile && (
                    <p className="mt-2 text-xs font-bold text-emerald-600 truncate max-w-full px-2 bg-emerald-50 py-1 rounded-md">
                      Selected: {uploadFile.name}
                    </p>
                  )}
                  <input
                    type="file"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-md transition hover:opacity-95 text-sm"
              >
                {editingId ? "Save Changes" : "Create Application"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      positionTitle: "",
                      company: "",
                      dateApplied: "",
                      jobLink: "",
                      contact: "",
                      status: "Applied",
                    });
                    setUploadFile(null);
                  }}
                  className="cursor-pointer rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-3 font-semibold text-slate-700 text-sm transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Jobs;