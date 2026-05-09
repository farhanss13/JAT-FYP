import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const ApplicationDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [docs, setDocs] = useState([]);

  const getDocumentUrl = (filePath) => {
    if (!filePath) return "#";
    return filePath.startsWith("http") ? filePath : `http://localhost:5000/${filePath}`;
  };

  // fetch job
  const fetchJob = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load job details");
    }
  };

  const fetchDocs = async () => {
    try {
      const res = await API.get(`/documents?jobId=${id}`);
      setDocs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJob();
    fetchDocs();
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Interview":
        return "bg-yellow-100 text-yellow-700";
      case "Applied":
        return "bg-blue-100 text-blue-600";
      case "Offer":
        return "bg-green-100 text-green-600";
      case "Rejected":
        return "bg-red-100 text-red-600";
      case "Screening":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (!job) {
    return (
      <div className="p-6 text-gray-500">
        Loading application details...
      </div>
    );
  }

  const status = job?.status || "Applied"; 

  return (
    <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        {job?.positionTitle}
      </h1>

      <div className="space-y-3 mb-6 text-slate-700">

        <p><b>Company:</b> {job?.company || "-"}</p>

        <p><b>Contact:</b> {job?.contact || "-"}</p>

        <p>
          <b>Status:</b>{" "}
          <span
            className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(status)}`}
          >
            {status}
          </span>
        </p>

        <p>
          <b>Applied On:</b>{" "}
          {job?.dateApplied
            ? new Date(job.dateApplied).toLocaleDateString()
            : "-"}
        </p>

        <a
          href={job?.jobLink}
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer text-blue-600 underline hover:text-blue-500"
        >
          Open Job
        </a>

      </div>

      <div className="mt-6">

        <h2 className="text-xl font-semibold text-slate-900 mb-3">
          Documents for this application
        </h2>

        {docs.length === 0 ? (
          <p className="text-slate-500">No documents uploaded</p>
        ) : (
          docs.map((doc) => (
            <div
              key={doc._id}
              className="rounded-lg border border-slate-200 p-3 flex justify-between mb-2"
            >
              <div>
                <p className="font-medium text-slate-900">{doc.documentType}</p>
              </div>

              <a
                href={getDocumentUrl(doc.filePath)}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer font-medium text-blue-600 hover:text-blue-500"
              >
                View
              </a>
            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default ApplicationDetails;
