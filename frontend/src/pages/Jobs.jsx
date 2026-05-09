import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { Upload, Link as LinkIcon } from "lucide-react";

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

      const query = params.toString()
        ? `/jobs?${params.toString()}`
        : "/jobs";

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
      dateApplied: job.dateApplied
        ? job.dateApplied.slice(0, 10)
        : "",
      jobLink: job.jobLink,
      contact: job.contact,
      status: job.status,
    });
    setEditingId(job._id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Applications</h1>
        <p className="mt-1 text-slate-500">Add and manage your job applications</p>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-cyan-500 focus:bg-white"
        />
        <input
          placeholder="Company"
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-cyan-500 focus:bg-white"
        />

        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-cyan-500 focus:bg-white"
        >
          <option value="">All</option>
          <option>Applied</option>
          <option>Screening</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-cyan-500 focus:bg-white"
        />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Saved Applications</h2>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-xl border border-slate-200 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2
                  onClick={() => (window.location.href = `/job/${job._id}`)}
                  className="font-semibold cursor-pointer text-blue-600 hover:text-blue-500"
                >
                  {job.positionTitle}
                </h2>
                <p className="text-slate-700">{job.company}</p>
                <p className="text-sm text-slate-500">{job.status}</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(job)}
                  className="cursor-pointer rounded-lg bg-amber-100 px-3 py-1.5 font-medium text-amber-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(job._id)}
                  className="cursor-pointer rounded-lg bg-rose-100 px-3 py-1.5 font-medium text-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {editingId ? "Update Job Application" : "Add New Job Application"}
        </h2>
        <p className="text-slate-500 mt-1 mb-6">Enter job details to track your application</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-600">Company Name</label>
            <input
              name="company"
              placeholder="e.g., Google, Microsoft"
              value={form.company}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-600">Position / Job Title</label>
            <input
              name="positionTitle"
              placeholder="e.g., Software Engineer, Frontend Developer"
              value={form.positionTitle}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-600">Job Link</label>
            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                name="jobLink"
                placeholder="https://example.com/job-posting"
                value={form.jobLink}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pl-10 outline-none focus:border-cyan-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Date Applied</label>
            <input
              type="date"
              name="dateApplied"
              value={form.dateApplied}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Application Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500 focus:bg-white"
            >
              <option>Applied</option>
              <option>Screening</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Contact Email / Recruiter 
            </label>
            <input
              name="contact"
              placeholder="recruiter@company.com"
              value={form.contact}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-600">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500 focus:bg-white"
            >
              <option value="resume">Resume</option>
              <option value="coverLetter">Cover Letter</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-600">Attach Documents</label>
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
              className={`block cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition ${
                isDragging
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-slate-200 bg-slate-50 hover:border-cyan-400"
              }`}
            >
              <Upload className="mx-auto mb-3 h-8 w-8 text-blue-500" />
              <p className="font-medium text-slate-700">Click to upload files</p>
              <p className="mt-1 text-xs text-slate-500">PDF, DOC, DOCX up to 10 MB</p>
              {uploadFile && <p className="mt-2 text-sm font-semibold text-emerald-600">{uploadFile.name}</p>}
              <input
                type="file"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-md sm:w-auto hover:opacity-95"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default Jobs;