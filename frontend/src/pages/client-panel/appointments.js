import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ClientLayout from '../../components/layout/ClientLayout';
import { PaginationBar } from '../../common/GlobalComponents';

export default function Appointments() {
  const router = useRouter();
  const [pageActive, setPageActive] = useState(1);
  const [pageHistory, setPageHistory] = useState(1);
  const itemsPerPage = 6;

  const [activeApps] = useState(Array.from({ length: 12 }, (_, i) => ({ id: i, attorney: 'Adv. Tasnia', type: 'Civil', title: 'Prop Dispute', date: '2025-12-30', time: '10:00 AM', reason: 'Meet', doc: '📁', status: 'Scheduled' })));
  const [historyApps] = useState(Array.from({ length: 8 }, (_, i) => ({ id: i, attorney: 'Adv. Rahul', type: 'Criminal', title: 'Bail', date: '2025-11-20', time: '02:00 PM', status: 'Completed' })));

  const currentActive = activeApps.slice((pageActive - 1) * itemsPerPage, pageActive * itemsPerPage);
  const currentHistory = historyApps.slice((pageHistory - 1) * itemsPerPage, pageHistory * itemsPerPage);

  return (
    <ClientLayout>

      
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h4 className="fw-bold m-0" style={{fontSize:'22px', color: '#002147'}}>Appointment History</h4>
        <button 
          className="btn btn-navy rounded-pill px-4 fw-bold" 
          style={{fontSize:'15px'}} 
          onClick={() => router.push('/client-panel/attorneys')}
        >
          <i className="bi bi-plus-lg me-2"></i> New Appointment
        </button>
      </div>

      {/* NEW APPOINTMENT TABLE */}
      <h6 className="fw-bold text-gold mb-3 small text-uppercase" style={{color: '#de9f57'}}>New Appointment Table</h6>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5 bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{backgroundColor:'#fcf6ef'}}>
              <tr style={{fontSize:'13px', color: '#002147'}}>
                <th>ATTORNEY</th><th>TYPE</th><th>TITLE</th><th>DATE</th><th>TIME</th><th>REASON</th><th>DOC</th><th>STATUS</th><th>ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{fontSize:'14px'}}>
              {currentActive.map(a => (
                <tr key={a.id}>
                  <td className="fw-bold">{a.attorney}</td>
                  <td>{a.type}</td>
                  <td>{a.title}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>{a.reason}</td>
                  <td>{a.doc}</td>
                  <td><span className="badge bg-success-subtle text-success rounded-pill px-3">{a.status}</span></td>
                  <td>
                    <button className="btn btn-sm text-primary p-0 border-0 me-2" onClick={() => router.push('/client-panel/attorneys')}><i className="bi bi-pencil-square"></i></button>
                    <button className="btn btn-sm text-danger p-0 border-0"><i className="bi bi-x-circle"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar current={pageActive} total={Math.ceil(activeApps.length/itemsPerPage)} onPageChange={setPageActive} />
      </div>

      {/* HISTORY TABLE */}
      <h6 className="fw-bold text-muted mb-3 small text-uppercase">Appointment History Table (View Only)</h6>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr style={{fontSize:'13px', color: '#002147'}}>
                <th>ATTORNEY</th><th>TYPE</th><th>TITLE</th><th>DATE</th><th>TIME</th><th>STATUS</th>
              </tr>
            </thead>
            <tbody style={{fontSize:'14px'}}>
              {currentHistory.map(a => (
                <tr key={a.id}>
                  <td>{a.attorney}</td>
                  <td>{a.type}</td>
                  <td>{a.title}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td><span className="badge bg-secondary-subtle text-secondary rounded-pill px-3">{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar current={pageHistory} total={Math.ceil(historyApps.length/itemsPerPage)} onPageChange={setPageHistory} />
      </div>

      <style jsx>{`
        .btn-navy { 
          background-color: #002147; 
          color: white; 
          border: none; 
          transition: 0.3s;
        }
        .btn-navy:hover { 
          background-color: #001630; 
          color: white; 
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .text-navy { color: #002147; }
        .text-gold { color: #de9f57; }
      `}</style>
    </ClientLayout>
  );
}