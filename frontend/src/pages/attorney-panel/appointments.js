


import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AttorneyLayout from '../../components/layout/AttorneyLayout';
// Global Pagination import kiya
import { PaginationBar } from '../../common/GlobalComponents';

export default function Appointments() {
  const router = useRouter();

  // --- DATA STATES ---
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [showModal, setShowModal] = useState(false);
  
  // --- PAGINATION STATES ---
  const [pageApp, setPageApp] = useState(1);
  const [pageHistory, setPageHistory] = useState(1);
  const itemsPerPage = 5;

  // Form State
  const [formData, setFormData] = useState({
    attorney: '', type: 'Civil', title: '', date: '', time: '', reason: '', doc: '📁', status: 'Scheduled'
  });

  // Active Appointments
  const [appointments, setAppointments] = useState([
    { id: 2, attorney: 'Adv. Tasnia Sharin', type: 'Civil', title: 'Property Dispute', date: '2025-01-15', time: '02:00 PM', reason: 'Client Meeting', doc: '📁', status: 'Scheduled' },
    { id: 1, attorney: 'Adv. Tasnia Sharin', type: 'Criminal', title: 'State vs Sharma', date: '2025-01-05', time: '10:30 AM', reason: 'Evidence Discussion', doc: '📁', status: 'Scheduled' },
  ]);

  // History State (View Only)
  const [history, setHistory] = useState([
    { id: 101, attorney: 'Adv. Tasnia Sharin', type: 'Family', title: 'Divorce Case', date: '2024-12-15', time: '11:00 AM', reason: 'Final Hearing', doc: '📄', status: 'Completed' },
  ]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    const newEntry = { ...formData, id: Date.now() };
    setAppointments([newEntry, ...appointments]); 
    setShowModal(false);
    setFormData({ attorney: '', type: 'Civil', title: '', date: '', time: '', reason: '', doc: '📁', status: 'Scheduled' });
  };

  const handleReschedule = (app) => {
    if (window.confirm("Do you want to navigate to Organization Users to re-schedule?")) {
        router.push('/organization-users');
    }
  };

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel?")) {
      const filtered = appointments.filter(a => a.id !== id);
      const cancelledItem = appointments.find(a => a.id === id);
      setAppointments(filtered);
      setHistory([{ ...cancelledItem, status: 'Cancelled' }, ...history]);
    }
  };

  // --- SORTING & PAGINATION LOGIC ---
  const sortedApps = [...appointments].sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentAppItems = sortedApps.slice((pageApp - 1) * itemsPerPage, pageApp * itemsPerPage);

  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentHistoryItems = sortedHistory.slice((pageHistory - 1) * itemsPerPage, pageHistory * itemsPerPage);

  // --- CALENDAR LOGIC ---
  const [currDate, setCurrDate] = useState(new Date());
  const renderCalendar = () => {
    const year = currDate.getFullYear();
    const month = currDate.getMonth();
    const startDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < startDay; i++) days.push(<div key={`e-${i}`} className="cal-day empty"></div>);
    for (let d = 1; d <= totalDays; d++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasApp = appointments.some(a => a.date === dStr);
      days.push(
        <div key={d} className="cal-day" onClick={() => { setFormData({...formData, date: dStr}); setShowModal(true); }}>
          <span className="d-num">{d}</span>
          {hasApp && <div className="dot"></div>}
        </div>
      );
    }
    return days;
  };

  return (
    <AttorneyLayout>

      <div className="container-fluid px-0">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          
          {/* TOP HEADER */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <h4 className="fw-bold mb-0" style={{ color: '#002147' }}>Appointment History</h4>
            <div className="d-flex gap-2 align-items-center">
              <div className="btn-group p-1 bg-light rounded-pill">
                <button className={`btn rounded-pill px-4 ${viewMode === 'list' ? 'btn-white shadow-sm' : 'btn-light border-0'}`} onClick={() => setViewMode('list')}>List</button>
                <button className={`btn rounded-pill px-4 ${viewMode === 'calendar' ? 'btn-white shadow-sm' : 'btn-light border-0'}`} onClick={() => setViewMode('calendar')}>Calendar</button>
              </div>
              <button className="btn text-white  rounded-pill fw-bold" style={{ backgroundColor: '#002147' }} onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-lg"></i> New Appointment
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <>
              {/* 1. NEW APPOINTMENT TABLE (Active) */}
              <div className="mb-5">
                <h5 className="fw-bold mb-3" style={{color: '#de9f57'}}>Active Schedules</h5>
                <div className="table-responsive border rounded-3 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ backgroundColor: '#fcf6ef', color: '#002147' }}>
                      <tr className="small fw-bold">
                        <th className="py-3 px-3">ATTORNEY NAME</th><th>CASE TYPE</th><th>CASE TITLE</th><th>DATE</th><th>TIME</th><th>REASON</th><th>DOC</th><th>STATUS</th><th className="text-center">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {currentAppItems.map(app => (
                        <tr key={app.id}>
                          <td className="px-3 fw-bold">{app.attorney}</td>
                          <td>{app.type}</td><td>{app.title}</td><td>{app.date}</td><td>{app.time}</td>
                          <td>{app.reason}</td><td className="text-center">{app.doc}</td>
                          <td><span className="badge bg-success-subtle text-success px-3">{app.status}</span></td>
                          <td className="text-center">
                            <button className="btn btn-sm text-primary border-0" onClick={() => handleReschedule(app)}><i className="bi bi-pencil-square"></i></button>
                            <button className="btn btn-sm text-danger border-0" onClick={() => handleCancel(app.id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <PaginationBar 
                    current={pageApp} 
                    total={Math.ceil(appointments.length / itemsPerPage)} 
                    onPageChange={setPageApp} 
                  />
                </div>
              </div>

              {/* 2. APPOINTMENTS HISTORY TABLE (View Only) */}
              <div>
                <h5 className="fw-bold mb-3 text-muted">Past History (View Only)</h5>
                <div className="table-responsive border rounded-3 shadow-sm overflow-hidden">
                  <table className="table align-middle mb-0 bg-light">
                    <thead>
                      <tr className="small text-muted" style={{backgroundColor: '#f8f9fa'}}>
                        <th className="py-3 px-3">ATTORNEY NAME</th><th>CASE TYPE</th><th>CASE TITLE</th><th>DATE</th><th>TIME</th><th>REASON</th><th>DOC</th><th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {currentHistoryItems.map(app => (
                        <tr key={app.id}>
                          <td className="px-3">{app.attorney}</td><td>{app.type}</td><td>{app.title}</td><td>{app.date}</td><td>{app.time}</td>
                          <td>{app.reason}</td><td className="text-center">{app.doc}</td>
                          <td><span className="badge bg-secondary-subtle text-secondary px-3">{app.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <PaginationBar 
                    current={pageHistory} 
                    total={Math.ceil(history.length / itemsPerPage)} 
                    onPageChange={setPageHistory} 
                  />
                </div>
              </div>
            </>
          ) : (
            /* CALENDAR VIEW */
            <div className="calendar-box border rounded-4 overflow-hidden shadow-sm">
              <div className="p-3 d-flex justify-content-between align-items-center text-white" style={{backgroundColor:'#002147'}}>
                <button className="btn btn-sm btn-outline-light" onClick={() => setCurrDate(new Date(currDate.getFullYear(), currDate.getMonth()-1))}>Prev</button>
                <h5 className="mb-0 fw-bold">{currDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h5>
                <button className="btn btn-sm btn-outline-light" onClick={() => setCurrDate(new Date(currDate.getFullYear(), currDate.getMonth()+1))}>Next</button>
              </div>
              <div className="calendar-grid">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="grid-head">{d}</div>)}
                {renderCalendar()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- NEW APPOINTMENT MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card shadow-lg animate-in">
            <div className="modal-header-custom p-4 text-white d-flex justify-content-between" style={{backgroundColor:'#002147'}}>
              <h5 className="mb-0 fw-bold">Schedule New Appointment</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleSaveAppointment} className="p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="small fw-bold">Attorney Name</label>
                  <input type="text" name="attorney" className="form-control" placeholder="Enter name" value={formData.attorney} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold">Case Type</label>
                  <select name="type" className="form-select" value={formData.type} onChange={handleInputChange}>
                    <option value="Civil">Civil</option>
                    <option value="Criminal">Criminal</option>
                    <option value="Family">Family</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="small fw-bold">Case Title</label>
                  <input type="text" name="title" className="form-control" placeholder="Property Dispute / Divorce Case" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold">Date</label>
                  <input type="date" name="date" className="form-control" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold">Time</label>
                  <input type="time" name="time" className="form-control" onChange={(e) => setFormData({...formData, time: e.target.value})} required />
                </div>
                <div className="col-12">
                  <label className="small fw-bold">Reason for Appointment</label>
                  <textarea name="reason" className="form-control" rows="3" value={formData.reason} onChange={handleInputChange} required></textarea>
                </div>
                <div className="col-12">
                  <label className="small fw-bold">Document (Optional)</label>
                  <input type="file" className="form-control" />
                </div>
              </div>
              <div className="mt-4 d-flex gap-2">
                <button type="submit" className="btn text-white flex-grow-1 fw-bold py-2" style={{backgroundColor:'#002147'}}>Save Appointment</button>
                <button type="button" className="btn btn-light border flex-grow-1 py-2" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; }
        .modal-card { background: white; width: 100%; max-width: 600px; border-radius: 15px; overflow: hidden; }
        .btn-white { background: white; color: #002147; border: 1px solid #ddd; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); background: #eee; gap: 1px; }
        .grid-head { background: #fcf6ef; padding: 10px; text-align: center; font-weight: bold; font-size: 12px; }
        .cal-day { background: white; min-height: 90px; padding: 10px; cursor: pointer; position: relative; }
        .cal-day:hover { background: #f8f9fa; }
        .cal-day.empty { background: #fdfdfd; cursor: default; }
        .d-num { font-weight: bold; color: #555; }
        .dot { width: 8px; height: 8px; background: #de9f57; border-radius: 50%; position: absolute; bottom: 10px; right: 10px; }
        .animate-in { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </AttorneyLayout>
  );
}