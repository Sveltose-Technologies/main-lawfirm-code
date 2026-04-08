import React, { useState } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { PaginationBar } from '../../common/GlobalComponents'; // Pagination import kiya

export default function DocumentManagement() {
  const navyColor = '#002147';
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sample Data (Excel sheet ke mutabik)
  const [documents] = useState(Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    caseId: `#CAS-99${20 + i}`,
    caseTitle: i % 2 === 0 ? 'Property Dispute Case' : 'Family Law Settlement',
    attorney: i % 2 === 0 ? 'Adv. Rajesh Kumar' : 'Adv. Tasnia',
    fileType: 'PDF',
    date: '30 Oct 2023',
    status: 'Secure'
  })));

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocs = documents.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <ClientLayout>
      <div className="animate-fade">
        
        {/* Document Management Section */}
        <div className="mt-2">          
          <div className="row g-4">
            
            {/* 1. Dedicated Client Portals Card */}
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h4 className="fw-bold mb-4" style={{ color: navyColor, fontSize: '20px' }}>Document Management</h4>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-person-workspace me-2" style={{ color: navyColor }}></i>
                  <h6 className="fw-bold mb-0" style={{ color: navyColor }}>Dedicated Client Portals</h6>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                  Give every client their own portal to view case progress, documents, and updates — building trust and save endless calls.
                </p>
              </div>
            </div>

            {/* 2. Secure Document Downloads Table with Pagination */}
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="p-4 border-bottom bg-white">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h6 className="fw-bold mb-0" style={{ color: navyColor }}>Secure Document Downloads</h6>
                    
                    {/* Excel Actions */}
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-secondary rounded-3" style={{fontSize: '12px'}}>
                        <i className="bi bi-folder-plus me-1"></i> Create Folder
                      </button>
                      <button className="btn btn-sm btn-outline-secondary rounded-3" style={{fontSize: '12px'}}>
                        <i className="bi bi-lock me-1"></i> Set Password
                      </button>
                      <button className="btn btn-sm text-white rounded-3" style={{ backgroundColor: navyColor, fontSize: '12px' }}>
                        <i className="bi bi-upload me-1"></i> Upload Document
                      </button>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                    <thead style={{backgroundColor: '#f8f9fa'}}>
                      <tr>
                        <th className="border-0 text-muted small fw-bold ps-4">CASE ID</th>
                        <th className="border-0 text-muted small fw-bold">CASE TITLE</th>
                        <th className="border-0 text-muted small fw-bold">ATTORNEY</th>
                        <th className="border-0 text-muted small fw-bold">FILE TYPE</th>
                        <th className="border-0 text-muted small fw-bold">DATE</th>
                        <th className="border-0 text-muted small fw-bold">STATUS</th>
                        <th className="border-0 text-muted small fw-bold text-end pe-4">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDocs.map((doc) => (
                        <tr key={doc.id}>
                          <td className="fw-bold ps-4">{doc.caseId}</td>
                          <td>{doc.caseTitle}</td>
                          <td>{doc.attorney}</td>
                          <td><span className="badge bg-light text-dark border">{doc.fileType}</span></td>
                          <td>{doc.date}</td>
                          <td>
                            <span className="badge rounded-pill bg-success-soft text-success px-3" style={{backgroundColor: '#e8f5e9'}}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="text-end pe-4">
                             <button className="btn btn-sm btn-light me-1" title="Download"><i className="bi bi-download"></i></button>
                             <button className="btn btn-sm btn-light text-danger" title="Delete"><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* SAME PAGINATION AS APPOINTMENTS */}
                <div className="p-3 border-top">
                  <PaginationBar 
                    current={currentPage} 
                    total={Math.ceil(documents.length / itemsPerPage)} 
                    onPageChange={setCurrentPage} 
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}