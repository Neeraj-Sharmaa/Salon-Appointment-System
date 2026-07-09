import bg from "../assets/bg1.jpg";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="flex flex-col justify-center items-center hero-section ">
      <div className="hero-content ">
        <p className="colr">Premium Beauty Experience</p>
        <h1 className="font-bold text-6xl text-white">
          Where Beauty Meets <br />
          <span className="text-[#D4AF37]">Excellence</span>
        </h1>
        <p>
          Experience transformative beauty services in an atmosphere of refined
          luxury. Our expert stylists are dedicated to bringing out your best
          self.
        </p>
        <div className="btn">
          <button className="flex items-center gap-2 font-bold border-3 border-[#d6401e] rounded-full px-4 py-3 bg-[#d6401e] text-white hover:bg-[#C88E81] hover:border-[#C88E81] transition duration-300 cursor-pointer">
            <FaCalendarAlt />
            <a href="#appoint">Book Appointment</a>
          </button>
          <Link to="/services">
            <button className="font-bold border-3 border-[#C88E81] rounded-full px-4 py-3 bg-transparent text-white hover:bg-[#C88E81] hover:border-[#C88E81] transition duration-300 cursor-pointer">
              View Services
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;