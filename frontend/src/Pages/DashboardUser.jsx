import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config/api";

const DashboardUser = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Booking Form State
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "user")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/appointments/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "user") {
      fetchAppointments();
    }
  }, [user]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookingSuccess("");
    setBookingError("");

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: "Not Provided",
          service,
          date,
          time,
          message,
          userId: user._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingSuccess("Appointment booked successfully!");
        setService("");
        setDate("");
        setTime("");
        setMessage("");
        fetchAppointments();
      } else {
        setBookingError(data.message || "Failed to book appointment.");
      }
    } catch (err) {
      setBookingError("Something went wrong. Please try again.");
    }
  };

  if (loading || !user || user.role !== "user") {
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
            <span className="text-xs uppercase tracking-[0.2em] text-[#C88E81] font-bold">Client Lounge</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1 font-luxury-title">
              Welcome, <span className="text-[#C88E81] italic">{user.name}</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Schedule your next style transformation and review your past visits.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-[#16141a] px-4 py-2.5 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Session Profile</span>
            <span className="font-semibold text-gray-200 capitalize text-sm">{user.role}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Quick Booking */}
          <div className="lg:col-span-1 glass-card p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl relative self-start">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C88E81]/25 to-transparent"></div>
            <h2 className="text-xl font-bold mb-6 text-white tracking-wide font-luxury-title">Book a Visit</h2>
            
            {bookingSuccess && (
              <div className="bg-green-950/60 border border-green-500/30 p-3 rounded-lg mb-4 text-center">
                <p className="text-xs text-green-300">{bookingSuccess}</p>
              </div>
            )}
            {bookingError && (
              <div className="bg-red-950/60 border border-red-500/30 p-3 rounded-lg mb-4 text-center">
                <p className="text-xs text-red-300">{bookingError}</p>
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-widest font-bold text-gray-400 mb-1.5 uppercase">Service Selection</label>
                <select
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#151319]/80 border border-gray-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#C88E81] transition duration-300 font-medium"
                >
                  <option value="" className="bg-[#0b0a0f]">Select service...</option>
                  <option className="bg-[#0b0a0f]">Hair Styling</option>
                  <option className="bg-[#0b0a0f]">Hair Coloring</option>
                  <option className="bg-[#0b0a0f]">Spa Treatment</option>
                  <option className="bg-[#0b0a0f]">Bridal Makeup</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest font-bold text-gray-400 mb-1.5 uppercase">Select Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#151319]/80 border border-gray-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#C88E81] transition duration-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest font-bold text-gray-400 mb-1.5 uppercase">Preferred Time</label>
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#151319]/80 border border-gray-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#C88E81] transition duration-300 font-medium"
                >
                  <option value="" className="bg-[#0b0a0f]">Choose time slot...</option>
                  <option className="bg-[#0b0a0f]">10:00 AM</option>
                  <option className="bg-[#0b0a0f]">11:00 AM</option>
                  <option className="bg-[#0b0a0f]">12:00 PM</option>
                  <option className="bg-[#0b0a0f]">1:00 PM</option>
                  <option className="bg-[#0b0a0f]">2:00 PM</option>
                  <option className="bg-[#0b0a0f]">3:00 PM</option>
                  <option className="bg-[#0b0a0f]">4:00 PM</option>
                  <option className="bg-[#0b0a0f]">5:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest font-bold text-gray-400 mb-1.5 uppercase">Special Requests</label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Preferences, allergies, or instructions..."
                  className="w-full bg-[#151319]/80 border border-gray-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#C88E81] transition duration-300 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#C88E81] to-[#d69f93] hover:from-[#d69f93] hover:to-[#C88E81] text-white font-bold rounded-xl transition duration-300 cursor-pointer shadow-lg hover:shadow-[#C88E81]/25 text-xs uppercase tracking-wider"
              >
                Book Appointment
              </button>
            </form>
          </div>

          {/* Appointment History */}
          <div className="lg:col-span-2 glass-card p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl relative">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C88E81]/25 to-transparent"></div>
            <h2 className="text-xl font-bold mb-6 text-white tracking-wide font-luxury-title">Your Appointments</h2>

            {fetching ? (
              <p className="text-gray-500 text-sm">Fetching salon slots...</p>
            ) : appointments.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-800/80 rounded-2xl">
                <p className="text-gray-500 text-sm">No appointments scheduled yet. Book your visit on the left!</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-500 font-semibold uppercase text-xs border-b border-gray-850">
                        <th className="pb-4">Service</th>
                        <th className="pb-4">Schedule</th>
                        <th className="pb-4">Assigned Stylist</th>
                        <th className="pb-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/40">
                      {appointments.map((appt) => (
                        <tr key={appt._id} className="hover:bg-white/[0.02] transition duration-150">
                          <td className="py-4 font-bold text-white pr-4">{appt.service}</td>
                          <td className="py-4 pr-4">
                            <span className="block font-medium text-gray-200">{appt.date}</span>
                            <span className="text-xs text-[#C88E81] font-semibold">{appt.time}</span>
                          </td>
                          <td className="py-4 pr-4">
                            {appt.professional ? (
                              <div>
                                <p className="font-semibold text-gray-300">{appt.professional.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{appt.professional.specialization}</p>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-600 italic">Assign Pending</span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {appointments.map((appt) => (
                    <div key={appt._id} className="bg-[#151319]/70 border border-gray-800/80 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-white text-sm">{appt.service}</span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
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
                      <p className="text-xs text-gray-300">{appt.date} <span className="text-[#C88E81] font-semibold">• {appt.time}</span></p>
                      <div className="mt-2 pt-2 border-t border-gray-800/50">
                        {appt.professional ? (
                          <p className="text-xs text-gray-400">Stylist: <span className="font-semibold text-gray-300">{appt.professional.name}</span></p>
                        ) : (
                          <p className="text-xs text-gray-600 italic">Stylist not assigned yet</p>
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

export default DashboardUser;
