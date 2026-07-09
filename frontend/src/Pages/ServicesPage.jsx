import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import image1 from "../assets/mehandiimage.jpg";
import image2 from "../assets/man at spa.png";
import image3 from "../assets/french-nail-extension.jpg";
import hairservices from "../assets/hairstyle.jpg";
import image4 from "../assets/thread.jpg";
import spa from "../assets/spa_mac.webp";

const ServicePage = () => {
  const services = [
    { title: "Facial Treatment", img: image2 },
    { title: "Bridal Mehndi", img: image1 },
    { title: "Nail Extension", img: image3 },
    { title: "Hair Styling", img: hairservices },
    { title: "Eyebrow Shaping", img: image4 },
    { title: "SPA Treatment", img: spa },
  ];

  return (
    <>
      <Navbar />

      <article className="mt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-center font-bold mb-12 text-[#6B5B7A]">
          Services We Offer
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-3xl shadow-lg group cursor-pointer h-80 sm:h-[400px]"
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                <h2 className="text-white text-2xl sm:text-3xl font-bold transform translate-y-10 group-hover:translate-y-0 transition duration-500">
                  {service.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </article>

      <Footer />
    </>
  );
};

export default ServicePage;