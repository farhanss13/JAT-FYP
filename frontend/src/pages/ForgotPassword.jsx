import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to email");
    } catch (err) {
      toast.error("Error sending email");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded">
        <input
          type="email"
          placeholder="Enter email"
          className="border p-2 w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="mt-3 w-full cursor-pointer bg-blue-500 p-2 text-white transition hover:bg-blue-600"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;