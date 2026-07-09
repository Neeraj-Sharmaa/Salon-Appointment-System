import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import girl1 from "../assets/girl.jpg";

const Contact = () => {
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl shadow-xl border border-[#F2EDE4] bg-white">
          {/* Left Image */}
          <div className="h-64 sm:h-96 md:h-auto">
            <img
              src={girl1}
              alt="Salon Model"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div 
            className="bg-[#FDFBF7] flex flex-col justify-center items-center text-center px-6 sm:px-12 py-12 sm:py-16"
            style={{ border: "12px solid #EBE5DA" }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-500 font-semibold mb-4">
              WHETHER YOU WANT TO BOOK AN APPOINTMENT, ASK A QUESTION,
              REGISTER A COMPLAINT, OR SHARE FEEDBACK
            </h3>

            <h1 className="text-[#C88E81] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide mb-2 font-serif">
              REACH OUT TO US
            </h1>

            <p className="text-md sm:text-lg md:text-xl font-medium text-gray-400 mb-8 uppercase tracking-wider">
              We'd love to hear from you
            </p>

            <div className="space-y-4 text-sm sm:text-md text-gray-700">
              <p>
                <span className="font-bold text-gray-900">TOLL FREE:</span>
                {" "}1800 123 1952
              </p>

              <p>
                <span className="font-bold text-gray-900">
                  HELLO@ELEGANCESALON.COM
                </span>
                {" "} (for Salon Services)
              </p>

              <p>
                <span className="font-bold text-gray-900">
                  SUPPORT@ELEGANCESALON.COM
                </span>
                {" "} (for Products)
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Contact;