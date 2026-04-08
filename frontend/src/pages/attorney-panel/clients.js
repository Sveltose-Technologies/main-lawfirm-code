import React, { useState } from 'react';
import Head from 'next/head';
import AttorneyLayout from '../../components/layout/AttorneyLayout';
// Global PaginationBar import kiya
import { PaginationBar } from '../../common/GlobalComponents';

export default function ClientTransactionPage() {
  const [activeTab, setActiveTab] = useState('clients');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Client pages ke standard ke hisaab se 6 items

  // --- DATA STATES ---
  const [clients, setClients] = useState([
    { id: 1, name: 'Rajesh Malhotra', clientId: 'CL-8821', number: '9876543210', caseType: 'Criminal', status: 'Scheduled' },
    { id: 2, name: 'Suman Lata', clientId: 'CL-9902', number: '9988776655', caseType: 'Civil', status: 'Completed' },
    { id: 3, name: 'Amit Sharma', clientId: 'CL-1023', number: '9812345678', caseType: 'Family', status: 'Pending' },
    { id: 4, name: 'Priya Verma', clientId: 'CL-4456', number: '9900112233', caseType: 'Criminal', status: 'Scheduled' },
    { id: 5, name: 'Rahul Singh', clientId: 'CL-7788', number: '9845612300', caseType: 'Corporate', status: 'Active' },
    { id: 6, name: 'Kavita Devi', clientId: 'CL-2233', number: '9123456789', caseType: 'Civil', status: 'Closed' },
  ]);

  const [milestones, setMilestones] = useState([
    { id: 101, case: 'State vs Rajesh', client: 'Rajesh Malhotra', amount: '₹5,000', status: 'Released', note: 'Initial Filing' },
    { id: 102, case: 'Land Dispute', client: 'Suman Lata', amount: '₹12,000', status: 'Pending', note: 'Evidence submission' },
  ]);

  const [invoices, setInvoices] = useState([
    { id: 'INV-001', date: '2025-12-20', client: 'Rajesh Malhotra', amount: '₹5,000', status: 'Paid' },
  ]);

  const [payments, setPayments] = useState([
    { id: 201, date: '2025-12-21', type: 'Income', cat: 'Milestone', amount: '₹5,000', party: 'Rajesh Malhotra' },
  ]);

  // --- EDIT MODAL STATE ---
  const [editingItem, setEditingItem] = useState(null);

  // --- HANDLERS ---
  const handleDelete = (id) => {
    if (window.confirm("Kyan aap is record ko delete karna chahte hain?")) {
      if (activeTab === 'clients') setClients(clients.filter(i => i.id !== id));
      if (activeTab === 'milestones') setMilestones(milestones.filter(i => i.id !== id));
      if (activeTab === 'invoices') setInvoices(invoices.filter(i => i.id !== id));
      if (activeTab === 'payments') setPayments(payments.filter(i => i.id !== id));
    }
  };

  const handleEditClick = (item) => setEditingItem({ ...item });

  const handleUpdateSave = (e) => {
    e.preventDefault();
    if (activeTab === 'clients') setClients(clients.map(i => i.id === editingItem.id ? editingItem : i));
    if (activeTab === 'milestones') setMilestones(milestones.map(i => i.id === editingItem.id ? editingItem : i));
    if (activeTab === 'invoices') setInvoices(invoices.map(i => i.id === editingItem.id ? editingItem : i));
    if (activeTab === 'payments') setPayments(payments.map(i => i.id === editingItem.id ? editingItem : i));
    setEditingItem(null);
  };

  // --- SEARCH & PAGINATION LOGIC ---
  const getActiveData = () => {
    let data = [];
    if (activeTab === 'clients') data = clients;
    else if (activeTab === 'milestones') data = milestones;
    else if (activeTab === 'invoices') data = invoices;
    else if (activeTab === 'payments') data = payments;
    
    if (search) {
      return data.filter(i => Object.values(i).some(v => String(v).toLowerCase().includes(search.toLowerCase())));
    }
    return data;
  };

  const filteredData = getActiveData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <AttorneyLayout>
      

      <div className="container-fluid px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold m-0" style={{ color: '#002147', fontSize: '22px' }}>Client & Transaction Management</h4>
            <p className="text-muted small mb-0" style={{ fontSize: '14px' }}>Manage records, milestones, and invoices from one dashboard.</p>
          </div>
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              className="form-control border-start-0 ps-0" 
              placeholder="Search data..." 
              style={{fontSize: '14px'}}
              value={search} 
              onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}} 
            />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="d-flex overflow-auto pb-2 scroll-hide mb-4">
          <div className="d-flex gap-2">
            {['clients', 'milestones', 'invoices', 'payments'].map((tab) => (
              <button 
                key={tab} 
                className={`btn rounded-pill px-4 fw-bold text-nowrap text-uppercase ${activeTab === tab ? 'btn-navy shadow-sm' : 'btn-light border text-muted'}`}
                onClick={() => {setActiveTab(tab); setCurrentPage(1);}}
                style={{fontSize: '12px'}}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Table Card */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: '#fcf6ef' }}>
                <tr style={{fontSize: '13px', color: '#002147'}}>
                  {activeTab === 'clients' && <><th className="py-3 px-4">CLIENT NAME</th><th>CLIENT ID</th><th>PHONE</th><th>CASE TYPE</th><th>STATUS</th><th className="text-center">ACTION</th></>}
                  {activeTab === 'milestones' && <><th className="py-3 px-4">CASE TITLE</th><th>CLIENT</th><th>AMOUNT</th><th>STATUS</th><th>NOTE</th><th className="text-center">ACTION</th></>}
                  {activeTab === 'invoices' && <><th className="py-3 px-4">INVOICE#</th><th>DATE</th><th>CLIENT</th><th>AMOUNT</th><th>STATUS</th><th className="text-center">ACTION</th></>}
                  {activeTab === 'payments' && <><th className="py-3 px-4">DATE</th><th>TYPE</th><th>CATEGORY</th><th>AMOUNT</th><th>PARTY</th><th className="text-center">ACTION</th></>}
                </tr>
              </thead>
              <tbody style={{fontSize: '14px'}}>
                {currentItems.map((item) => (
                  <tr key={item.id} className="border-bottom">
                    {activeTab === 'clients' && <><td className="px-4 fw-bold">{item.name}</td><td>{item.clientId}</td><td>{item.number}</td><td>{item.caseType}</td><td><span className="badge bg-primary-subtle text-primary rounded-pill px-3" style={{fontSize: '11px'}}>{item.status}</span></td></>}
                    {activeTab === 'milestones' && <><td className="px-4 fw-bold">{item.case}</td><td>{item.client}</td><td>{item.amount}</td><td><span className={`badge rounded-pill px-3 ${item.status === 'Released' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`} style={{fontSize: '11px'}}>{item.status}</span></td><td><small className="text-muted">{item.note}</small></td></>}
                    {activeTab === 'invoices' && <><td className="px-4 fw-bold">{item.id}</td><td>{item.date}</td><td>{item.client}</td><td>{item.amount}</td><td><span className="badge bg-info-subtle text-info rounded-pill px-3" style={{fontSize: '11px'}}>{item.status}</span></td></>}
                    {activeTab === 'payments' && <><td className="px-4">{item.date}</td><td className={item.type === 'Income' ? 'text-success fw-bold' : 'text-danger fw-bold'}>{item.type}</td><td>{item.cat}</td><td className="fw-bold">{item.amount}</td><td>{item.party}</td></>}
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-3">
                        <i className="bi bi-pencil-square text-primary" style={{cursor:'pointer'}} onClick={() => handleEditClick(item)}></i>
                        <i className="bi bi-trash text-danger" style={{cursor:'pointer'}} onClick={() => handleDelete(item.id)}></i>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr><td colSpan="10" className="text-center py-5 text-muted">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Global Pagination Integrated */}
          <PaginationBar 
            current={currentPage} 
            total={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-card animate-slide shadow-lg">
            <div className="p-4 text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#002147' }}>
              <h5 className="mb-0 fw-bold" style={{fontSize: '18px'}}>Edit Details</h5>
              <button className="btn-close btn-close-white" onClick={() => setEditingItem(null)}></button>
            </div>
            <div className="p-4 bg-white overflow-auto" style={{maxHeight: '80vh'}}>
              <form onSubmit={handleUpdateSave}>
                <div className="row g-3">
                  {activeTab === 'clients' && (
                    <>
                      <div className="col-12"><label className="label-custom">Name</label><input className="form-control" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                      <div className="col-md-6"><label className="label-custom">Number</label><input className="form-control" value={editingItem.number} onChange={e => setEditingItem({...editingItem, number: e.target.value})} /></div>
                      <div className="col-md-6"><label className="label-custom">Case Type</label><input className="form-control" value={editingItem.caseType} onChange={e => setEditingItem({...editingItem, caseType: e.target.value})} /></div>
                      <div className="col-12"><label className="label-custom">Status</label><select className="form-select" value={editingItem.status} onChange={e => setEditingItem({...editingItem, status: e.target.value})}><option>Scheduled</option><option>Completed</option><option>Pending</option><option>Active</option></select></div>
                    </>
                  )}
                  {activeTab === 'milestones' && (
                    <>
                      <div className="col-12"><label className="label-custom">Case Title</label><input className="form-control" value={editingItem.case} onChange={e => setEditingItem({...editingItem, case: e.target.value})} /></div>
                      <div className="col-md-6"><label className="label-custom">Amount</label><input className="form-control" value={editingItem.amount} onChange={e => setEditingItem({...editingItem, amount: e.target.value})} /></div>
                      <div className="col-md-6"><label className="label-custom">Status</label><select className="form-select" value={editingItem.status} onChange={e => setEditingItem({...editingItem, status: e.target.value})}><option>Released</option><option>Pending</option></select></div>
                      <div className="col-12"><label className="label-custom">Note</label><textarea className="form-control" rows="3" value={editingItem.note} onChange={e => setEditingItem({...editingItem, note: e.target.value})} /></div>
                    </>
                  )}
                  {(activeTab === 'invoices' || activeTab === 'payments') && (
                    <>
                      <div className="col-12"><label className="label-custom">Client / Party Name</label><input className="form-control" value={editingItem.client || editingItem.party} onChange={e => setEditingItem({...editingItem, client: e.target.value, party: e.target.value})} /></div>
                      <div className="col-md-6"><label className="label-custom">Amount</label><input className="form-control" value={editingItem.amount} onChange={e => setEditingItem({...editingItem, amount: e.target.value})} /></div>
                      <div className="col-md-6"><label className="label-custom">Date</label><input type="date" className="form-control" value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} /></div>
                    </>
                  )}
                </div>
                <div className="mt-4 d-flex gap-2">
                  <button type="submit" className="btn btn-navy w-100 fw-bold py-2">Save Changes</button>
                  <button type="button" className="btn btn-light border w-100" onClick={() => setEditingItem(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .btn-navy { background-color: #002147; color: white; border: none; }
        .btn-navy:hover { background-color: #001630; color: white; }
        .label-custom { font-weight: bold; color: #6c757d; font-size: 13px; margin-bottom: 5px; display: block; }
        .scroll-hide::-webkit-scrollbar { display: none; }
        
        .modal-overlay { 
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
          background: rgba(0,0,0,0.6); z-index: 9999; 
          display: flex; align-items: center; justify-content: center; padding: 15px;
        }
        .modal-card { background: white; width: 100%; max-width: 500px; border-radius: 20px; overflow: hidden; }
        
        .animate-slide { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        :global(.container-fluid) { max-width: 100% !important; }
        .badge { font-weight: 600; }
      `}</style>
    </AttorneyLayout>
  );
}