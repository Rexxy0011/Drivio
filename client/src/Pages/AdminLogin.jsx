import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/login`,
        { email, password }
      );
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        toast.success("Signed in");
        navigate("/admin");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-light">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-borderColor/60 space-y-5"
      >
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">
            Drivio
          </p>
          <h1 className="text-2xl font-semibold text-gray-800 mt-1">
            Admin sign-in
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Restricted area. Owner and user accounts cannot access this.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-borderColor rounded-lg px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-borderColor rounded-lg px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary-dull py-2.5 rounded-xl text-white font-medium disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
