// import "./Appointment.css";

// const Appointment = () => {
//   return (
//     <div className="appoint_container" id="appoint">

//       <div className="appoint_heading">
//         <h3>Book Your Visit</h3>

//         <h2>
//           Schedule Your <span>Appointment</span>
//         </h2>

//         <p>
//           Complete the form below and our team will confirm your booking
//           within 24 hours.
//         </p>
//       </div>

//       <form className="booking_form">

//         {/* Row 1 */}

//         <div className="form_row">

//           <div className="form_group">
//             <label>Full Name *</label>
//             <input type="text" placeholder="Your Name" required/>
//           </div>

//           <div className="form_group">
//             <label>Email Address *</label>
//             <input type="email" placeholder="your@email.com" required/>
//           </div>

//         </div>

//         {/* Row 2 */}

//         <div className="form_row">

//           <div className="form_group">
//             <label>Phone Number *</label>
//             <input type="tel" placeholder="+91 9876543210" required />
//           </div>

//           <div className="form_group">
//             <label>Service *</label>

//             <select>
//               <option>Select a Service</option>
//               <option>Hair Styling</option>
//               <option>Hair Coloring</option>
//               <option>Spa Treatment</option>
//               <option>Bridal Makeup</option>
//             </select>

//           </div>

//         </div>

//         {/* Row 3 */}

//         <div className="form_row">

//           <div className="form_group">
//             <label>Preferred Date *</label>
//             <input type="date" />
//           </div>

//           <div className="form_group">
//             <label>Preferred Time *</label>

//             <select>
//               <option>Select Time</option>
//               <option>10:00 AM</option>
//               <option>11:00 AM</option>
//               <option>12:00 PM</option>
//               <option>1:00 PM</option>
//               <option>2:00 PM</option>
//               <option>3:00 PM</option>
//               <option>4:00 PM</option>
//               <option>5:00 PM</option>
//             </select>

//           </div>

//         </div>

//         {/* Textarea */}

//         <div className="form_group">

//           <label>Special Request</label>

//           <textarea
//             rows="5"
//             placeholder="Any allergies, preferences or special requests..."
//           ></textarea>

//         </div>

//         <button className="submit_btn">
//           Confirm Booking
//         </button>

//       </form>

//     </div>
//   );
// };

// export default Appointment;

import { useState } from "react";
import "./Appointment.css";
import API_BASE_URL from "../config/api";

const Appointment = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            service,
            date,
            time,
            message,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      setName("");
      setEmail("");
      setPhone("");
      setService("");
      setDate("");
      setTime("");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 appoint_container" id="appoint">
      <h3 className="text-[#C88E81]">Book Your Visit</h3>

      <h2 className='font-bold heading'>
        Schedule Your <span className='text-[#C88E81]'>Appointment</span>
      </h2>

      <p>
        Complete the form below and our team will confirm your booking
        within 24 hours.
      </p>

      <form className="text-center booking_form" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="form_row">
          <div className="form_group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="form_row">
          <div className="form_group">
            <label>Phone Number *</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label>Service *</label>

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              <option value="">Select a Service</option>
              <option>Hair Styling</option>
              <option>Hair Coloring</option>
              <option>Spa Treatment</option>
              <option>Bridal Makeup</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="form_row">
          <div className="form_group">
            <label>Preferred Date *</label>

            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label>Preferred Time *</label>

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="">Select Time</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>12:00 PM</option>
              <option>1:00 PM</option>
              <option>2:00 PM</option>
              <option>3:00 PM</option>
              <option>4:00 PM</option>
              <option>5:00 PM</option>
            </select>
          </div>
        </div>

        {/* Textarea */}
        <div className="form_group">
          <label>Special Request</label>

          <textarea
            rows="5"
            placeholder="Any allergies, preferences or special requests..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="submit_btn">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Appointment;