import './Services.css';
import hair from '../assets/hairstyle.jpg'
import colr from '../assets/colr.jpg'
import makeup from '../assets/makeup.jpg'
import spa from '../assets/spa.jpg'
const Services = () => {
    return (
        <main className='flex flex-col gap-3 items-center'>
            <h2 className="text-[#C88E81] ">Our Services</h2>
            <h2 className='font-bold heading'>Signature <span className='text-[#C88E81]'>Treatments</span></h2>
            <p id='para'>Each service is thoughtfully designed to enhance your natural beauty and leave you feeling transformed.</p>
            <div className="card_container">
                <div className="card">
                    <img src={hair} alt="" />
                    <div className="card-content">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Hair Styling</h3>
                    <p className='text-gray-600 text-sm mb-4'>Expert cuts, coloring, and styling for all hair types</p>
                    <span className='font-bold text-[#e67e22]'>From $85</span>
                    </div>
                </div>
                <div className="card">
                    <img src={colr} alt="" />
                       <div className="card-content">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Color Services</h3>
                    <p className='text-gray-600 text-sm mb-4'>Balayage, highlights, and full color transformations</p>
                    <span className='font-bold text-[#e67e22]'>From $150</span>
                    </div>
                </div>
                <div className="card">
                    <img src={spa} alt="" />
                     <div className="card-content">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Spa Treatments</h3>
                    <p className='text-gray-600 text-sm mb-4'>Relaxing facials, scalp treatments, and hair masks</p>
                    <span className='font-bold text-[#e67e22]'>From $120</span>
                    </div>
                </div>
                <div className="card">
                    <img src={makeup} alt="" />
                      <div className="card-content">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Bridal & Events</h3>
                    <p className='text-gray-600 text-sm mb-4'>Special occasion styling and bridal packages</p>
                    <span className='font-bold text-[#e67e22]'>From $250</span>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Services