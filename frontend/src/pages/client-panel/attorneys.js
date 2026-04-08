import React, { useState } from 'react';
import Head from 'next/head';
import ClientLayout from '../../components/layout/ClientLayout';

export default function AttorneyPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Calendar, 2: Form

  // --- MOCK DATA: ATTORNEYS ---
  const attorneys = [
    { id: 1, name: 'Adv. Tasnia Sharin', image: '/assets/images/attorney1.png', spec: 'Criminal & Civil Law', exp: '8 Years', availability: 'Available Today', rating: '4.8' },
    { id: 2, name: 'Adv. Rahul Kumar', image: '/assets/images/attorney1.png', spec: 'Corporate & Tax Law', exp: '12 Years', availability: 'Available Tomorrow', rating: '4.9' },
    { id: 3, name: 'Adv. Robert Smith', image: '/assets/images/attorney1.png', spec: 'Family & Divorce', exp: '10 Years', availability: 'Busy', rating: '4.5' },
    { id: 4, name: 'Adv. Priya Sharma', image: '/assets/images/attorney1.png', spec: 'Property Dispute', exp: '6 Years', availability: 'Available Today', rating: '4.7' },
  ];

  const handleOpenCalendar = (attorney) => {
    setSelectedAttorney(attorney);
    setBookingStep(1);
    setShowModal(true);
  };

  // Calendar Days Generator
  const renderCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(
        <div 
          key={i} 
          className={`cal-day ${selectedDate === i ? 'active' : ''}`}
          onClick={() => { setSelectedDate(i); setBookingStep(2); }}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <ClientLayout>
     

      <div className="container-fluid px-0 animate-fade">
        <h4 className="fw-bold mb-4" style={{ color: '#002147', fontSize: '22px' }}>Attorney</h4>

        {/* --- ATTORNEY GRID (Responsive Bootstrap) --- */}
        <div className="row g-4">
          {attorneys.map((atty) => (
            <div className="col-12 col-md-6 col-lg-4" key={atty.id}>
              <div className="card border-0 shadow-sm rounded-4 attorney-card p-3 h-100 bg-white">
                <div className="text-center">
                  <div className="position-relative d-inline-block mb-3">
                    <img 
                      src={atty.image} 
                      className="rounded-circle shadow-sm" 
                      style={{ width: '90px', height: '90px', objectFit: 'cover', border: '3px solid #f8f9fa' }} 
                      alt={atty.name} 
                    />
                    <span className={`status-indicator ${atty.availability === 'Busy' ? 'bg-danger' : 'bg-success'}`}></span>
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: '#002147', fontSize: '16px' }}>{atty.name}</h6>
                  <p className="text-muted mb-2" style={{ fontSize: '13px' }}>{atty.spec}</p>
                  
                  <div className="d-flex justify-content-center gap-3 mb-3">
                    <span className="badge bg-light text-dark border fw-normal" style={{fontSize: '11px'}}>
                      <i className="bi bi-star-fill text-warning me-1"></i> {atty.rating}
                    </span>
                    <span className="badge bg-light text-dark border fw-normal" style={{fontSize: '11px'}}>
                      <i className="bi bi-briefcase me-1 text-primary"></i> {atty.exp} Exp
                    </span>
                  </div>
                </div>

                <div className="mt-auto border-top pt-3 text-center">
                   <p className={`small fw-bold mb-3 ${atty.availability === 'Busy' ? 'text-danger' : 'text-success'}`}>
                     {atty.availability}
                   </p>
                   <button 
                     className="btn btn-navy w-100 rounded-pill fw-bold py-2" 
                     style={{ fontSize: '14px' }}
                     onClick={() => handleOpenCalendar(atty)}
                   >
                     Book Appointment
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOOKING CALENDAR MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card shadow-lg animate-slide-up">
            <div className="modal-header-custom p-4 text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#002147' }}>
              <div className="d-flex align-items-center">
                 <img src={selectedAttorney?.image} className="rounded-circle me-2" width="30" height="30" alt="" />
                 <h6 className="mb-0 fw-bold" style={{fontSize: '16px'}}>Booking: {selectedAttorney?.name}</h6>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>

            <div className="p-4 bg-white">
              {bookingStep === 1 ? (
                /* Step 1: Calendar View */
                <div className="calendar-container">
                  <h6 className="fw-bold text-center mb-3" style={{fontSize: '14px', color: '#de9f57'}}>Select Date (Dec 2025)</h6>
                  <div className="calendar-grid">
                    {['S','M','T','W','T','F','S'].map(d => <div key={d} className="cal-head">{d}</div>)}
                    {renderCalendarDays()}
                  </div>
                  <p className="text-muted text-center mt-3 mb-0" style={{fontSize: '12px'}}>Click on any date to choose time slots.</p>
                </div>
              ) : (
                /* Step 2: Form & Slots */
                <form className="animate-fade">
                  <h6 className="fw-bold mb-3" style={{fontSize: '14px'}}>Booking for Dec {selectedDate}, 2025</h6>
                  <div className="mb-3">
                    <label className="fw-bold small mb-1">Available Slots</label>
                    <div className="d-flex flex-wrap gap-2">
                      {['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'].map(slot => (
                        <button type="button" key={slot} className="btn btn-sm btn-outline-secondary px-3 rounded-pill">{slot}</button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold small mb-1">Reason / Case Title</label>
                    <input type="text" className="form-control" placeholder="Property Dispute..." style={{fontSize: '14px'}} />
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button type="button" className="btn btn-navy w-100 fw-bold" onClick={() => { alert('Booked!'); setShowModal(false); }}>Confirm</button>
                    <button type="button" className="btn btn-light border w-100" onClick={() => setBookingStep(1)}>Back</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .attorney-card { 
          transition: 0.3s; 
          border: 1px solid #eee !important;
        }
        .attorney-card:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
          border-color: #de9f57 !important;
        }
        .status-indicator {
          position: absolute; bottom: 5px; right: 5px;
          width: 15px; height: 15px; border-radius: 50%;
          border: 2px solid #white;
        }
        .btn-navy { background: #002147; color: white; }
        .btn-navy:hover { background: #001a38; color: white; }

        /* Modal & Calendar */
        .modal-overlay { 
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
          background: rgba(0,0,0,0.6); z-index: 9999; 
          display: flex; align-items: center; justify-content: center; padding: 15px;
        }
        .modal-card { background: white; width: 100%; max-width: 400px; border-radius: 24px; overflow: hidden; }
        
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
        .cal-head { text-align: center; font-weight: bold; font-size: 12px; color: #adb5bd; padding: 5px; }
        .cal-day { 
          padding: 10px 5px; text-align: center; font-size: 13px; border-radius: 8px; 
          cursor: pointer; border: 1px solid #f8f9fa; transition: 0.2s;
        }
        .cal-day:hover { background: #fcf6ef; color: #de9f57; border-color: #de9f57; }
        .cal-day.active { background: #002147; color: white; border-color: #002147; }

        .animate-fade { animation: fadeIn 0.4s ease-in; }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </ClientLayout>
  );
}