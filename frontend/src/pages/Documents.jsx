import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

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
    try {
      await API.delete(`/documents/${id}`);
      toast.success("Document deleted");
      fetchDocuments();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading documents...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Documents</h1>
        <p className="mt-1 text-slate-500">All uploaded files linked with your applications</p>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          No documents found
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm space-y-3">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="rounded-xl border border-slate-200 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {doc.documentType}
                </p>

                <p className="text-sm text-slate-600">
                  {doc.jobApplicationId?.positionTitle} @{" "}
                  {doc.jobApplicationId?.company}
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <a
                  href={getDocumentUrl(doc.filePath)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-lg bg-blue-100 px-3 py-1.5 text-center font-medium text-blue-700 cursor-pointer hover:bg-blue-200/80 md:flex-none"
                >
                  View
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(doc._id)}
                  className="flex-1 cursor-pointer rounded-lg bg-rose-100 px-3 py-1.5 font-medium text-rose-700 md:flex-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
