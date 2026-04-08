

'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function ClientPortal() {
  // --- States ---
  const [view, setView] = useState('login'); // login, signup1, signup2
  const [activeTab, setActiveTab] = useState('Client');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- Actions ---

  // 1. Login Action
  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login Successful! Redirecting to Dashboard...");
  };

  // 2. Sign Up Step 1 Validation
  const handleSignUpStep1 = (e) => {
    e.preventDefault();
    setError('');

    // Excel Validation: "Click Sign Up with existing email should get error"
    if (email === 'exist@lawfirm.com') {
      setError('This Email ID is already registered. Please Sign In.');
      return;
    }

    // Excel Action: Navigate to Form 2
    setView('signup2');
  };

  // 3. Final Profile Save
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    
    // Excel Action: Success Message
    setSuccessMsg('Please check your email to activate your account or contact us.');

    // Excel Action: Auto-generate ID & Reset
    setTimeout(() => {
      alert('Profile Created! Member ID: MEM-998877. Check your inbox.');
      setSuccessMsg('');
      setView('login');
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Client Portal | Law Firm</title>
      </Head>

      {/* Loading Bootstrap CSS via CDN for quick setup */}
      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
        
        /* Slight custom override just for the specific Navy Blue theme */
        .bg-navy { background-color: #002b5c; color: white; }
        .btn-navy { background-color: #002b5c; color: white; border: none; }
        .btn-navy:hover { background-color: #001f42; color: white; }
        .text-navy { color: #002b5c; }
        .nav-link.active { border-bottom: 3px solid #cfa144 !important; color: #002b5c !important; font-weight: bold; }
        .nav-link { color: #666; font-weight: 500; }
        .cursor-pointer { cursor: pointer; }
      `}</style>

      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
        
        {/* Main Card Container */}
        <div className="card shadow-lg border-0" style={{ maxWidth: view === 'signup2' ? '800px' : '450px', width: '100%' }}>
          
          {/* Tabs Header */}
          <div className="card-header bg-white border-bottom-0 p-0">
            <ul className="nav nav-tabs nav-fill border-bottom">
              {['Client', 'Attorney', 'Admin'].map((tab) => (
                <li className="nav-item" key={tab}>
                  <a 
                    className={`nav-link border-0 py-3 rounded-0 ${activeTab === tab ? 'active' : ''}`} 
                    onClick={() => setActiveTab(tab)}
                    href="#"
                  >
                    {tab}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-body p-4 p-md-5">

            {/* ===================== VIEW 1: LOGIN ===================== */}
            {view === 'login' && (
              <div className="fade-in">
                <h2 className="text-center text-navy mb-1" style={{fontFamily: 'serif'}}>Client Portal</h2>
                <p className="text-center text-muted mb-4">Sign In</p>

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email ID</label>
                    <input type="email" className="form-control" placeholder="email@lawfirm.com" required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Password</label>
                    <input type="password" className="form-control" required />
                  </div>

                  <div className="d-flex justify-content-end mb-3">
                    <a href="#" className="text-decoration-none text-navy small" onClick={() => alert('Redirect to Forgot Password')}>Forgot Password?</a>
                  </div>

                  <button type="submit" className="btn btn-navy w-100 py-2 mb-3 fw-bold">Log In</button>

                  <div className="text-center">
                    <span className="text-muted small">No Account Yet? </span>
                    <a href="#" className="text-navy fw-bold text-decoration-none" onClick={() => setView('signup1')}>Sign Up</a>
                  </div>
                </form>
              </div>
            )}

            {/* ===================== VIEW 2: SIGN UP STEP 1 ===================== */}
            {view === 'signup1' && (
              <div className="fade-in">
                <h3 className="text-center text-navy mb-1" style={{fontFamily: 'serif'}}>Sign Up</h3>
                <p className="text-center text-muted mb-4">Create your account</p>

                {error && <div className="alert alert-danger text-center p-2 small">{error}</div>}

                <form onSubmit={handleSignUpStep1}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small">First Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small">Last Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">Email ID <span className="text-danger">*</span></label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                    <div className="form-text text-muted" style={{fontSize: '0.75rem'}}>Try &apos;exist@lawfirm.com&apos; to test error validation.</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">Password <span className="text-danger">*</span></label>
                    <input type="password" className="form-control" required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">Repeat Password <span className="text-danger">*</span></label>
                    <input type="password" className="form-control" required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">Captcha</label>
                    <div className="bg-light border text-center p-2 mb-2 fw-bold letter-spacing-2">X 7 K 9 B</div>
                    <input type="text" className="form-control" placeholder="Enter Captcha" required />
                  </div>

                  <button type="submit" className="btn btn-navy w-100 py-2 mb-3 fw-bold">Sign Up</button>

                  <div className="text-center">
                    <span className="text-muted small">Already Have An Account? </span>
                    <a href="#" className="text-navy fw-bold text-decoration-none" onClick={() => setView('login')}>Sign In</a>
                  </div>
                </form>
              </div>
            )}

            {/* ===================== VIEW 3: SIGN UP STEP 2 (PROFILE) ===================== */}
            {view === 'signup2' && (
              <div className="fade-in">
                <h3 className="text-center text-navy mb-1" style={{fontFamily: 'serif'}}>Update Profile</h3>
                <p className="text-center text-muted mb-4">Step 2: Address & KYC</p>

                {successMsg && <div className="alert alert-success text-center">{successMsg}</div>}

                <form onSubmit={handleFinalSubmit}>
                  {/* Address Section */}
                  <h6 className="text-muted border-bottom pb-2 mb-3">Address Details</h6>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="form-label fw-bold small">Street Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold small">Apt/Unit <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold small">City <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold small">State <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small">Country <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small">Zip Code <span className="text-danger">*</span></label>
                      <input type="number" className="form-control" required />
                    </div>
                  </div>

                  {/* Personal & KYC */}
                  <h6 className="text-muted border-bottom pb-2 mb-3 mt-2">Personal & KYC</h6>
                  <div className="row">
                    <div className="col-md-3 mb-3">
                       <label className="form-label fw-bold small">Code</label>
                       <select className="form-select" required>
                          <option>+91</option>
                          <option>+1</option>
                       </select>
                    </div>
                    <div className="col-md-5 mb-3">
                       <label className="form-label fw-bold small">Phone Number <span className="text-danger">*</span></label>
                       <input type="number" className="form-control" required />
                    </div>
                    <div className="col-md-4 mb-3">
                       <label className="form-label fw-bold small">Date of Birth <span className="text-danger">*</span></label>
                       <input type="date" className="form-control" required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">Profile Image (Selfie)</label>
                    <input type="file" className="form-control" accept="image/*" />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold small">Proof of Identity (PAN/Aadhaar) <span className="text-danger">*</span></label>
                        <input type="file" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold small">Proof of Address (Utility Bill) <span className="text-danger">*</span></label>
                        <input type="file" className="form-control" required />
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="termsCheck" required />
                    <label className="form-check-label small" htmlFor="termsCheck">
                      I accept the Terms and Conditions
                    </label>
                  </div>

                  <button type="submit" className="btn btn-navy w-100 py-2 fw-bold">Save & Activate Account</button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}