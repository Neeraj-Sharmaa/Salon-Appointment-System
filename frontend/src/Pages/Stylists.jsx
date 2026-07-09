import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import video from "../assets/ELEGANCE SALON.mp4";

const Stylists = () => {
  return (
    <>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 mb-16">
        <div className="rounded-3xl overflow-hidden shadow-2xl relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[300px] sm:h-[450px] lg:h-[600px] object-cover"
            src={video}
          />
          {/* Subtle Video Overlay */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Stylists;