import React, { useState } from 'react';

function FAQ() {
  // --- STATE FOR ACCORDION ---
  const [activeIndex, setActiveIndex] = useState(0); // Default first one open

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Click same item to close
    } else {
      setActiveIndex(index); // Click new item to open
    }
  };

  // --- FAQ DATA (You can change text here) ---
  const faqData = [
    {
      question: "How do I schedule an initial consultation?",
      answer: "You can schedule a consultation by calling our office directly or filling out the contact form on our website. Our team will get back to you within 24 hours to confirm a time that works best for you."
    },
    {
      question: "What areas of law does NRIS Law Firm practice?",
      answer: "We specialize in corporate law, immigration, intellectual property, real estate, and litigation. Our team of experienced attorneys handles both domestic and international legal matters."
    },
    {
      question: "Do you handle international cases?",
      answer: "Yes, we have a strong global presence with offices in the US, Europe, Asia, and the Middle East. We frequently handle cross-border transactions and international disputes."
    },
    {
      question: "How are your legal fees structured?",
      answer: "Our fee structure is transparent and tailored to the specific needs of each case. We offer hourly rates, flat fees for certain services, and retainer agreements depending on the nature of the legal work."
    },
    {
      question: "Is my consultation confidential?",
      answer: "Absolutely. All communications with our firm are protected by attorney-client privilege. We maintain the highest standards of confidentiality and privacy for all our potential and existing clients."
    }
  ];

  return (
    <>
      <section className="faq-section py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container py-lg-4">
          
          {/* --- HEADING --- */}
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              
              <h3 className="display-5 fw-bold py-5" style={{ color: '#0a1c38', fontFamily: 'serif' }}>
                Frequently Asked Questions
              </h3>
              <p className="text-secondary lead fs-6">
                Answer to some frequently asked questions presented to our legal team.
              </p>
            </div>
          </div>

          {/* --- ACCORDION CONTENT --- */}
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="accordion-wrapper">
                
                {faqData.map((item, index) => (
                  <div 
                    key={index} 
                    className={`faq-item mb-3 ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    {/* Question Header */}
                    <div className="faq-header d-flex justify-content-between align-items-center p-3 cursor-pointer">
                      <h5 className="mb-0 fw-bold" style={{ color: activeIndex === index ? '#de9f57' : '#0a1c38', fontSize: '1.1rem' }}>
                        {item.question}
                      </h5>
                      <span className="icon-wrapper">
                        <i className={`bx ${activeIndex === index ? 'bx-minus' : 'bx-plus'}`} style={{ fontSize: '1.5rem', color: '#de9f57' }}></i>
                      </span>
                    </div>

                    {/* Answer Body (Animated Height) */}
                    <div className="faq-body" style={{ 
                        maxHeight: activeIndex === index ? '200px' : '0', 
                        opacity: activeIndex === index ? '1' : '0',
                        overflow: 'hidden',
                        transition: 'all 0.4s ease'
                    }}>
                      <div className="p-4 pt-0 text-secondary" style={{ lineHeight: '1.7' }}>
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- STYLES --- */}
      <style jsx>{`
        .faq-item {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }

        .faq-item:hover {
          box-shadow: 0 10px 15px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }

        .faq-item.active {
          border-left: 5px solid #de9f57; /* Gold Left Border for active */
        }

        /* Ensure smooth animation */
        .faq-body {
          transition: max-height 0.4s ease, opacity 0.4s ease;
        }
      `}</style>
    </>
  );
}

export default FAQ;