import React, { useState } from 'react';
import Head from 'next/head';
import ClientLayout from '../../components/layout/ClientLayout';
import { PaginationBar } from '../../common/GlobalComponents';
export default function Billing() {
  const [pageReq, setPageReq] = useState(1);
  const [pageHist, setPageHist] = useState(1);
  const itemsPerPage = 6;

  const [requests] = useState(Array.from({ length: 7 }, (_, i) => ({ id: i, case: `Case #${i+100}`, attorney: 'Adv. Tasnia', date: '2025-12-28', amount: '$500', status: 'Pending' })));
  const [history] = useState(Array.from({ length: 14 }, (_, i) => ({ id: `INV-${i+500}`, case: 'Property Case', date: '2025-11-20', amount: '$1200', status: 'Paid' })));

  return (
    <ClientLayout>
      <Head><title>Transaction Management | Lawstick</title></Head>
      <h4 className="fw-bold text-navy mb-5" style={{fontSize:'22px'}}>Transaction Management</h4>

      <h6 className="fw-bold text-gold mb-3 small text-uppercase">Payment Milestone Requests</h6>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="table-responsive"><table className="table table-hover align-middle mb-0">
          <thead style={{backgroundColor:'#fcf6ef'}}><tr style={{fontSize:'13px'}}><th>CASE</th><th>ATTORNEY</th><th>DATE</th><th>AMOUNT</th><th>ACTIONS</th></tr></thead>
          <tbody style={{fontSize:'14px'}}>{requests.slice((pageReq-1)*itemsPerPage, pageReq*itemsPerPage).map(r => (
            <tr key={r.id}><td>{r.case}</td><td>{r.attorney}</td><td>{r.date}</td><td className="fw-bold">{r.amount}</td><td><button className="btn btn-navy btn-sm rounded-pill px-3 me-2">Accept</button><button className="btn btn-outline-danger btn-sm rounded-pill px-3">Reject</button></td></tr>
          ))}</tbody>
        </table></div>
        <PaginationBar current={pageReq} total={Math.ceil(requests.length/itemsPerPage)} onPageChange={setPageReq} />
      </div>

      <h6 className="fw-bold text-muted mb-3 small text-uppercase">Invoice & Payment History</h6>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive"><table className="table align-middle mb-0">
          <thead className="bg-light"><tr style={{fontSize:'13px'}}><th>INVOICE ID</th><th>CASE</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th><th>INVOICE</th></tr></thead>
          <tbody style={{fontSize:'14px'}}>{history.slice((pageHist-1)*itemsPerPage, pageHist*itemsPerPage).map(h => (
            <tr key={h.id}><td>{h.id}</td><td>{h.case}</td><td>{h.date}</td><td className="fw-bold text-success">{h.amount}</td><td><span className="badge bg-success-subtle text-success">Paid</span></td><td><button className="btn btn-sm btn-outline-navy"><i className="bi bi-file-earmark-pdf"></i> PDF</button></td></tr>
          ))}</tbody>
        </table></div>
        <PaginationBar current={pageHist} total={Math.ceil(history.length/itemsPerPage)} onPageChange={setPageHist} />
      </div>
    </ClientLayout>
  );
}