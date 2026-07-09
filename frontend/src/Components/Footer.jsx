
import './Footer.css';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
  FaCut
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-[#8B5E57] text-gray-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">

        {/* Top Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <FaCut className="text-amber-400 text-3xl" />
              <h2 className="text-3xl font-bold text-white">
                Elegance Salon
              </h2>
            </div>

            <p className="text-gray-300 leading-8 text-lg footer_para">
              Where artistry meets expertise. Experience transformative
              beauty services in an atmosphere of refined luxury.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-lg">
              <li>
                <a
                  href="#home"
                  className="hover:text-amber-400 transition duration-300"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#services"
                  className="hover:text-amber-400 transition duration-300"
                >
                  Services
                </a>
              </li>

              <li>
                <a
                  href="#booking"
                  className="hover:text-amber-400 transition duration-300"
                >
                  Book Now
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="hover:text-amber-400 transition duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-5">
              Contact Us
            </h3>

            <ul className="space-y-4 text-lg">

              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-amber-400 text-xl mt-1" />
                <span>
                  24 Luxury Lane,
                  <br />
                  Beauty District
                </span>
              </li>

              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-amber-400 text-xl" />
                <span>(555) 123-4567</span>
              </li>

              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-400 text-xl" />
                <span>hello@elegancesalon.com</span>
              </li>

            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-5">
              Hours
            </h3>

            <ul className="space-y-4 text-lg text-gray-200">
              <li>Mon - Fri: 9:00 AM - 8:00 PM</li>
              <li>Saturday: 10:00 AM - 6:00 PM</li>
              <li>Sunday: 10:00 AM - 4:00 PM</li>
            </ul>

            <div className="mt-5 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>

              <span className="text-amber-300 font-medium">
                Currently Open
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#A97A72] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-white text-lg">
            © {new Date().getFullYear()} Elegance Salon. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className="text-amber-400 text-lg"
              />
            ))}

            <span className="text-white ml-2 text-lg">
              4.9/5 from 500+ reviews
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;