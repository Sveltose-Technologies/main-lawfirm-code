import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AttorneyLayout from '../../components/layout/AttorneyLayout';

export default function OrganizationUsers() {
  const router = useRouter();
  const { action } = router.query;
  const [search, setSearch] = useState('');

  // Sample Data: Organization ke users
  const users = [
    { id: 1, name: 'Suresh Raina', email: 'suresh@law.com', role: 'Staff', org: 'Lawstick Mumbai', status: 'Active' },
    { id: 2, name: 'Mahendra Singh', email: 'msd@law.com', role: 'Junior Attorney', org: 'Lawstick Ranchi', status: 'Active' },
    { id: 3, name: 'Virat Kohli', email: 'virat@law.com', role: 'Client', org: 'Lawstick Delhi', status: 'Inactive' },
    { id: 4, name: 'Rohit Sharma', email: 'rohit@law.com', role: 'Staff', org: 'Lawstick Mumbai', status: 'Active' },
  ];

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  // User select karke wapas Appointment page par bhejna
  const selectUser = (name) => {
    // Ye line wapas Appointment page par le jayegi aur Modal khulwa degi
    router.push({
      pathname: '/attorney-panel/appointments',
      query: { selectedUser: name, openModal: 'true', actionType: action }
    });
  };

  return (
    <AttorneyLayout>
     

      <div className="container-fluid px-0">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white w-100">
          
          <div className="mb-5">
             <h3 className="fw-bold mb-2" style={{ fontFamily: 'serif', color: '#002147', fontSize: '26px' }}>Organization Users List</h3>
             <p className="text-muted" style={{fontSize: '15px'}}>Select a user to schedule or re-schedule an appointment.</p>
          </div>

          {/* Search Box */}
          <div className="mb-4 col-md-5">
            <div className="input-group border rounded-pill px-3 py-1 bg-light shadow-sm">
              <span className="input-group-text bg-transparent border-0"><i className="bi bi-search text-muted"></i></span>
              <input 
                type="text" 
                className="form-control bg-transparent border-0" 
                placeholder="Search by name..." 
                style={{fontSize: '15px'}}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* User Table */}
          <div className="table-responsive border rounded-3">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: '#fcf6ef' }}>
                <tr className="text-nowrap" style={{ color: '#002147', fontSize: '14px' }}>
                  <th className="py-3 px-4">User Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Organization</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '14px', color: '#444' }}>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-nowrap border-bottom">
                    <td className="px-4 py-3 fw-bold" style={{color: '#002147'}}>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="badge bg-light text-dark border px-2 fw-normal">{user.role}</span></td>
                    <td>{user.org}</td>
                    <td>
                      <span className={`badge ${user.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm text-white px-4 rounded-pill fw-bold" 
                        style={{backgroundColor: '#de9f57', fontSize: '12px', border: 'none'}}
                        onClick={() => selectUser(user.name)}
                      >
                        Select & Proceed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .table th { font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-control:focus { box-shadow: none; border-color: #de9f57; }
        :global(.container-fluid) { max-width: 100% !important; }
      `}</style>
    </AttorneyLayout>
  );
}