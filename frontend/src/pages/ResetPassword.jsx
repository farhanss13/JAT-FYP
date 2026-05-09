import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful");
    } catch (err) {
      toast.error("Reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded">
        <input
          type="password"
          placeholder="New password"
          className="border p-2 w-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="mt-3 w-full cursor-pointer bg-green-500 p-2 text-white transition hover:bg-green-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;