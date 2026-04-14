import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useAdminAxios = () => {
  const navigate = useNavigate();
  return useMemo(() => {
    const token = localStorage.getItem("adminToken");
    const instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    instance.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
        return Promise.reject(err);
      }
    );
    return instance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const Admin = () => {
  const navigate = useNavigate();
  const adminAxios = useAdminAxios();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [actioning, setActioning] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await adminAxios.get("/api/admin/pending-cars");
      if (data.success) setCars(data.cars);
      else toast.error(data.message);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const approve = async (carId) => {
    setActioning(carId);
    try {
      const { data } = await adminAxios.post("/api/admin/approve-car", {
        carId,
      });
      if (data.success) {
        toast.success(data.message);
        fetchPending();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActioning(null);
    }
  };

  const reject = async (carId) => {
    if (!reason.trim()) return toast.error("Reason required");
    setActioning(carId);
    try {
      const { data } = await adminAxios.post("/api/admin/reject-car", {
        carId,
        reason,
      });
      if (data.success) {
        toast.success(data.message);
        setRejecting(null);
        setReason("");
        fetchPending();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActioning(null);
    }
  };

  const signOut = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-white border-b border-borderColor px-6 md:px-10 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">
            Drivio
          </p>
          <h1 className="text-lg font-semibold text-gray-800">
            Admin · Pending listings
          </h1>
        </div>
        <button
          onClick={signOut}
          className="text-sm border border-borderColor px-3 py-1.5 rounded-md hover:border-primary"
        >
          Sign out
        </button>
      </header>

      <div className="px-6 md:px-10 py-8 max-w-5xl mx-auto space-y-6">
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && cars.length === 0 && (
          <p className="text-gray-500">Nothing pending. Clean slate.</p>
        )}

        {cars.map((car) => (
          <div
            key={car._id}
            className="rounded-xl border border-borderColor bg-white p-5 flex flex-col lg:flex-row gap-6"
          >
            <img
              src={car.image}
              alt=""
              className="w-full lg:w-60 h-44 object-cover rounded-lg"
            />

            <div className="flex-1 flex flex-col gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {car.brand} {car.model} · {car.year}
                </h3>
                <p className="text-sm text-gray-500">
                  {car.category} · {car.seating_capacity} seats ·{" "}
                  {car.transmission} · {car.fuel_type}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {car.location}
                  {car.country ? `, ${car.country}` : ""} · $
                  {car.pricePerDay?.toLocaleString()}/day
                </p>
              </div>

              <p className="text-sm text-gray-600">{car.description}</p>

              <div className="text-xs text-gray-500">
                Submitted by{" "}
                <span className="text-gray-700">{car.owner?.name}</span> (
                {car.owner?.email})
              </div>

              <div className="flex flex-wrap gap-4 text-sm mt-1">
                {car.documents?.registration && (
                  <a
                    href={car.documents.registration}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    View registration
                  </a>
                )}
                {car.documents?.insurance && (
                  <a
                    href={car.documents.insurance}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    View insurance
                  </a>
                )}
              </div>

              {rejecting === car._id ? (
                <div className="flex flex-col gap-2 mt-2">
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why is this listing being rejected?"
                    className="border border-borderColor rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      disabled={actioning === car._id}
                      onClick={() => reject(car._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md text-sm disabled:opacity-50"
                    >
                      Confirm reject
                    </button>
                    <button
                      onClick={() => {
                        setRejecting(null);
                        setReason("");
                      }}
                      className="px-4 py-2 border border-borderColor rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <button
                    disabled={actioning === car._id}
                    onClick={() => approve(car._id)}
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejecting(car._id)}
                    className="px-4 py-2 border border-red-300 text-red-500 rounded-md text-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
