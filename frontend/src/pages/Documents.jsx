import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { 
  FileText, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Briefcase, 
  FileCheck,
  FileCode,
  FileDown
} from "lucide-react";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDocumentUrl = (filePath) => {
    if (!filePath) return "#";
    return filePath.startsWith("http") ? filePath : `http://localhost:5000/${filePath}`;
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/documents");
      setDocuments(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await API.delete(`/documents/${id}`);
      toast.success("Document deleted successfully");
      fetchDocuments();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  // Helper to get styled theme based on document type
  const getDocTypeDetails = (type) => {
    switch (type) {
      case "resume":
        return {
          label: "Resume",
          colorClass: "bg-blue-50 text-blue-700 border-blue-200",
          iconColor: "text-blue-600",
          bgGrad: "from-blue-500/10 to-transparent",
        };
      case "coverLetter":
        return {
          label: "Cover Letter",
          colorClass: "bg-purple-50 text-purple-700 border-purple-200",
          iconColor: "text-purple-600",
          bgGrad: "from-purple-500/10 to-transparent",
        };
      default:
        return {
          label: "Other Document",
          colorClass: "bg-slate-50 text-slate-700 border-slate-200",
          iconColor: "text-slate-600",
          bgGrad: "from-slate-500/10 to-transparent",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Documents Hub</h1>
        <p className="mt-1 text-slate-500">Manage and view resumes, cover letters, and transcripts attached to your profile</p>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="mx-auto rounded-full bg-slate-50 p-4 w-16 h-16 flex items-center justify-center text-slate-400">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">No documents found</h3>
            <p className="text-slate-500 text-sm mt-1">Upload files when adding or editing job applications to see them cataloged here.</p>
          </div>
          <button
            onClick={() => (window.location.href = "/jobs")}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 transition"
          >
            Go to Applications
          </button>
        </div>
      ) : (
        /* DOCUMENT CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {documents.map((doc) => {
            const typeDetails = getDocTypeDetails(doc.documentType);
            return (
              <div
                key={doc._id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 flex flex-col justify-between"
              >
                {/* Decorative background gradient */}
                <div className={`absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-bl ${typeDetails.bgGrad} blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}></div>

                <div className="space-y-4 relative z-10">
                  {/* Icon & Badge Row */}
                  <div className="flex justify-between items-center">
                    <div className={`rounded-xl bg-slate-50 p-3 ${typeDetails.iconColor}`}>
                      {doc.documentType === "resume" ? (
                        <FileCheck className="h-6 w-6" />
                      ) : doc.documentType === "coverLetter" ? (
                        <FileCode className="h-6 w-6" />
                      ) : (
                        <FileText className="h-6 w-6" />
                      )}
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold tracking-wide uppercase ${typeDetails.colorClass}`}>
                      {typeDetails.label}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg tracking-tight truncate" title={doc.originalName || "Unnamed Document"}>
                      {doc.originalName || `${typeDetails.label} File`}
                    </h3>
                    
                    {doc.jobApplicationId && (
                      <div className="mt-3 flex items-start gap-2 text-slate-600 text-sm">
                        <Briefcase className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                        <div className="truncate">
                          <span className="font-semibold">{doc.jobApplicationId.positionTitle}</span>
                          <span className="text-slate-400"> at </span>
                          <span className="font-semibold text-slate-700">{doc.jobApplicationId.company}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "recently"}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3 relative z-10">
                  <a
                    href={getDocumentUrl(doc.filePath)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white py-2.5 text-sm font-semibold transition-all duration-150"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View File
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(doc._id)}
                    className="cursor-pointer inline-flex items-center justify-center p-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-all duration-150"
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Documents;
