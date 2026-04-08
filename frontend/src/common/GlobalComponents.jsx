// --- 1. PAGINATION COMPONENT ---
export function PaginationBar({ current, total, onPageChange }) {
  if (total < 1) return null;

  return (
    <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
      <span className="text-muted small fw-bold">
        Page {current} of {total}
      </span>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${current === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => current > 1 && onPageChange(current - 1)}>
              Prev
            </button>
          </li>
          <li className="page-item active">
            <span
              className="page-link border-0 text-white"
              style={{ backgroundColor: "#002147" }}>
              {current}
            </span>
          </li>
          <li className={`page-item ${current === total ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => current < total && onPageChange(current + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      <style jsx>{`
        .page-link {
          color: #002147;
          font-weight: 600;
          border-radius: 8px;
          margin: 0 3px;
          cursor: pointer;
        }
        .page-link:hover {
          background: #fcf6ef;
          color: #de9f57;
        }
        .page-item.disabled .page-link {
          color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
