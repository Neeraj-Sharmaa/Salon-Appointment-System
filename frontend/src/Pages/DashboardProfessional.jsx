import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const DashboardProfessional = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "professional")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/appointments/professional", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching professional appointments:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "professional") {
      fetchAppointments();
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
        setActionSuccess(`Status updated to ${status} successfully!`);
        fetchAppointments();
      } else {
        setActionError(data.message || "Failed to update status.");
      }
    } catch (err) {
      setActionError("Something went wrong. Please try again.");
    }
  };

  if (loading || !user || user.role !== "professional") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0a0f]">
        <p className="text-[#C88E81] text-lg font-bold">Loading dashboard...</p>
      </div>
    );
  }

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
            <span className="text-xs uppercase tracking-[0.2em] text-[#C88E81] font-bold">Stylist Portal</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1 font-luxury-title">
              Stylist Hub: <span className="text-[#C88E81] italic">{user.name}</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Specialization: <span className="font-semibold text-gray-200">{user.specialization || "General"}</span> | {user.experience} Years Experience
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-[#16141a] px-4 py-2.5 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Session Profile</span>
            <span className="font-semibold text-[#C88E81] capitalize text-sm">{user.role}</span>
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

        {/* Assigned Bookings */}
        <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C88E81]/25 to-transparent"></div>
          <h2 className="text-xl font-bold mb-6 text-white tracking-wide font-luxury-title">Your Assigned Bookings</h2>

          {fetching ? (
            <p className="text-gray-500 text-sm">Fetching scheduler...</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-800/80 rounded-2xl">
              <p className="text-gray-500 text-sm">No appointments are currently assigned to you.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-[#151319]/70 border border-gray-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#C88E81]/30 transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-bold text-[#C88E81] bg-[#C88E81]/10 border border-[#C88E81]/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                        {appt.service}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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

                    <h3 className="font-bold text-white text-lg mb-1 font-luxury-title">
                      {appt.name || (appt.user && appt.user.name)}
                    </h3>
                    <p className="text-xs text-[#C88E81] font-semibold mb-4">
                      {appt.date} &bull; {appt.time}
                    </p>

                    <div className="border-t border-gray-800/50 pt-4 space-y-2 mb-4 text-xs">
                      <p className="text-gray-400">
                        <span className="font-bold text-gray-500 uppercase tracking-wider text-[9px] mr-1">Email:</span> {appt.email || (appt.user && appt.user.email)}
                      </p>
                      <p className="text-gray-400">
                        <span className="font-bold text-gray-500 uppercase tracking-wider text-[9px] mr-1">Phone:</span> {appt.phone || (appt.user && appt.user.phone)}
                      </p>
                      {appt.message && (
                        <p className="mt-3 bg-black/40 p-3 rounded-lg border border-gray-800/40 italic text-gray-400">
                          "{appt.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-800/30 pt-4 flex flex-wrap gap-2">
                    {appt.status === "pending" && (
                      <button
                        onClick={() => handleUpdateStatus(appt._id, "confirmed")}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition duration-200 cursor-pointer shadow"
                      >
                        Confirm
                      </button>
                    )}
                    {appt.status !== "completed" && appt.status !== "cancelled" && (
                      <button
                        onClick={() => handleUpdateStatus(appt._id, "completed")}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition duration-200 cursor-pointer shadow"
                      >
                        Complete
                      </button>
                    )}
                    {appt.status !== "cancelled" && appt.status !== "completed" && (
                      <button
                        onClick={() => handleUpdateStatus(appt._id, "cancelled")}
                        className="py-2 px-3 bg-red-950/40 hover:bg-red-950/60 text-red-400 border border-red-900/30 text-xs font-bold rounded-lg transition duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardProfessional;
