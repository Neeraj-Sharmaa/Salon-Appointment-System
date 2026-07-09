import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const DashboardAdmin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch appointments
      const apptRes = await fetch("http://localhost:5000/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const apptData = await apptRes.json();
      if (apptRes.ok) {
        setAppointments(apptData);
      }

      // Fetch professionals
      const profRes = await fetch("http://localhost:5000/auth/professionals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const profData = await profRes.json();
      if (profRes.ok) {
        setProfessionals(profData);
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchData();
    }
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    setActionError("");
    setActionSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        setActionSuccess(`Appointment status changed to ${status}!`);
        fetchData();
      } else {
        setActionError(data.message || "Failed to update status.");
      }
    } catch (err) {
      setActionError("Something went wrong.");
    }
  };

  const handleAssignProfessional = async (apptId, professionalId) => {
    setActionError("");
    setActionSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/appointments/${apptId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ professionalId }),
      });

      const data = await response.json();

      if (response.ok) {
        setActionSuccess("Stylist assignment updated successfully!");
        fetchData();
      } else {
        setActionError(data.message || "Failed to assign stylist.");
      }
    } catch (err) {
      setActionError("Something went wrong.");
    }
  };

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0a0f]">
        <p className="text-[#C88E81] text-lg font-bold">Loading dashboard...</p>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalBookings = appointments.length;
  const pendingBookings = appointments.filter((a) => a.status === "pending").length;
  const confirmedBookings = appointments.filter((a) => a.status === "confirmed").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0a0f] text-gray-100 font-sans relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-luxury-title { font-family: 'Playfair Display', serif; }
        .font-luxury-body { font-family: 'Montserrat', sans-serif; }
        .ambient-glow-1 {
          background: radial-gradient(circle, rgba(200, 142, 129, 0.15) 0%, rgba(0,0,0,0) 70%);
        }
        .ambient-glow-2 {
          background: radial-gradient(circle, rgba(100, 80, 180, 0.1) 0%, rgba(0,0,0,0) 70%);
        }
        .glass-card {
          background: rgba(20, 18, 24, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(200, 142, 129, 0.12);
        }
      `}</style>

      {/* Ambient background glow rings */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ambient-glow-1 pointer-events-none rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ambient-glow-2 pointer-events-none rounded-full blur-[100px]"></div>

      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10 font-luxury-body">
        {/* Welcome Card */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C88E81]/30 to-transparent"></div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C88E81] font-bold">Manager Terminal</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1 font-luxury-title">
              Admin <span className="text-[#C88E81] italic">Dashboard</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Review full salon activities, assign stylists, and modify booking schedules.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-[#16141a] px-4 py-2.5 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Session Profile</span>
            <span className="font-semibold text-red-400 capitalize text-sm">{user.role}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
          <div className="bg-[#151319]/70 border border-gray-800/80 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center shadow-md">
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Total Bookings</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 sm:mt-2 block font-luxury-title">{totalBookings}</span>
          </div>
          <div className="bg-[#151319]/70 border border-gray-800/80 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center shadow-md">
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Pending Action</span>
            <span className="text-2xl sm:text-3xl font-black text-yellow-500 mt-1 sm:mt-2 block font-luxury-title">{pendingBookings}</span>
          </div>
          <div className="bg-[#151319]/70 border border-gray-800/80 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center shadow-md">
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Confirmed</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 sm:mt-2 block font-luxury-title">{confirmedBookings}</span>
          </div>
          <div className="bg-[#151319]/70 border border-gray-800/80 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center shadow-md">
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Stylist Panel</span>
            <span className="text-2xl sm:text-3xl font-black text-[#C88E81] mt-1 sm:mt-2 block font-luxury-title">{professionals.length}</span>
          </div>
        </div>

        {actionSuccess && (
          <div className="bg-green-950/60 border border-green-500/30 p-4 rounded-xl mb-6 text-center">
            <p className="text-sm text-green-300">{actionSuccess}</p>
          </div>
        )}
        {actionError && (
          <div className="bg-red-950/60 border border-red-500/30 p-4 rounded-xl mb-6 text-center">
            <p className="text-sm text-red-300">{actionError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Master Log */}
          <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl relative">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C88E81]/25 to-transparent"></div>
            <h2 className="text-xl font-bold mb-6 text-white tracking-wide font-luxury-title">Master Appointment Log</h2>

            {fetching ? (
              <p className="text-gray-500 text-sm">Accessing schedules...</p>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-800/80 rounded-2xl">
                <p className="text-gray-500 text-sm">No bookings exist in the salon database.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-500 font-semibold uppercase text-xs border-b border-gray-800 pb-4">
                        <th className="pb-4 px-2">Client</th>
                        <th className="pb-4 px-2">Service</th>
                        <th className="pb-4 px-2">Schedule</th>
                        <th className="pb-4 px-2">Assign Stylist</th>
                        <th className="pb-4 px-2">Status</th>
                        <th className="pb-4 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/40">
                      {appointments.map((appt) => (
                        <tr key={appt._id} className="hover:bg-white/[0.02] transition duration-155">
                          <td className="py-4 px-2">
                            <p className="font-bold text-white pr-4">{appt.name || (appt.user && appt.user.name)}</p>
                            <p className="text-xs text-gray-500">{appt.email || (appt.user && appt.user.email)}</p>
                            <p className="text-[10px] text-gray-600 font-mono mt-0.5">{appt.phone || (appt.user && appt.user.phone)}</p>
                            {appt.message && (
                              <p className="mt-2 text-[10px] bg-black/40 border border-gray-900/60 p-2 rounded italic text-gray-400 max-w-[200px]">
                                "{appt.message}"
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-2 font-bold text-gray-200">{appt.service}</td>
                          <td className="py-4 px-2">
                            <span className="block font-medium text-gray-300">{appt.date}</span>
                            <span className="text-xs text-[#C88E81] font-semibold">{appt.time}</span>
                          </td>
                          <td className="py-4 px-2">
                            <select
                              value={appt.professional?._id || appt.professional || ""}
                              onChange={(e) => handleAssignProfessional(appt._id, e.target.value)}
                              className="bg-[#151319]/80 border border-gray-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#C88E81] transition duration-200"
                            >
                              <option value="" className="bg-[#0b0a0f]">-- Unassigned --</option>
                              {professionals.map((prof) => (
                                <option key={prof._id} value={prof._id} className="bg-[#0b0a0f]">
                                  {prof.name} ({prof.specialization})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4 px-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                appt.status === "completed"
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                  : appt.status === "confirmed"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : appt.status === "cancelled"
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse"
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <div className="flex justify-end gap-1.5">
                              {appt.status !== "confirmed" && appt.status !== "completed" && (
                                <button
                                  onClick={() => handleUpdateStatus(appt._id, "confirmed")}
                                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow"
                                >
                                  Confirm
                                </button>
                              )}
                              {appt.status !== "completed" && appt.status !== "cancelled" && (
                                <button
                                  onClick={() => handleUpdateStatus(appt._id, "completed")}
                                  className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow"
                                >
                                  Complete
                                </button>
                              )}
                              {appt.status !== "cancelled" && (
                                <button
                                  onClick={() => handleUpdateStatus(appt._id, "cancelled")}
                                  className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-950/60 text-red-400 border border-red-900/30 rounded-lg text-[10px] font-bold cursor-pointer transition"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden space-y-4">
                  {appointments.map((appt) => (
                    <div key={appt._id} className="bg-[#151319]/70 border border-gray-800/80 rounded-xl p-4 sm:p-5">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div>
                          <p className="font-bold text-white text-sm">{appt.name || (appt.user && appt.user.name)}</p>
                          <p className="text-[11px] text-gray-500">{appt.email || (appt.user && appt.user.email)}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            appt.status === "completed"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : appt.status === "confirmed"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : appt.status === "cancelled"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block">Service</span>
                          <span className="font-bold text-gray-200">{appt.service}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block">Schedule</span>
                          <span className="text-gray-300">{appt.date}</span>
                          <span className="text-[#C88E81] font-semibold block">{appt.time}</span>
                        </div>
                      </div>

                      {appt.message && (
                        <p className="text-[10px] bg-black/40 border border-gray-900/60 p-2 rounded italic text-gray-400 mb-3">
                          "{appt.message}"
                        </p>
                      )}

                      <div className="border-t border-gray-800/50 pt-3 mb-3">
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block mb-1.5">Assign Stylist</span>
                        <select
                          value={appt.professional?._id || appt.professional || ""}
                          onChange={(e) => handleAssignProfessional(appt._id, e.target.value)}
                          className="w-full bg-[#151319]/80 border border-gray-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#C88E81] transition duration-200"
                        >
                          <option value="" className="bg-[#0b0a0f]">-- Unassigned --</option>
                          {professionals.map((prof) => (
                            <option key={prof._id} value={prof._id} className="bg-[#0b0a0f]">
                              {prof.name} ({prof.specialization})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {appt.status !== "confirmed" && appt.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateStatus(appt._id, "confirmed")}
                            className="flex-1 min-w-[70px] py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow text-center"
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status !== "completed" && appt.status !== "cancelled" && (
                          <button
                            onClick={() => handleUpdateStatus(appt._id, "completed")}
                            className="flex-1 min-w-[70px] py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow text-center"
                          >
                            Complete
                          </button>
                        )}
                        {appt.status !== "cancelled" && (
                          <button
                            onClick={() => handleUpdateStatus(appt._id, "cancelled")}
                            className="py-2 px-3 bg-red-950/40 hover:bg-red-950/60 text-red-400 border border-red-900/30 rounded-lg text-[10px] font-bold cursor-pointer transition text-center"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardAdmin;
