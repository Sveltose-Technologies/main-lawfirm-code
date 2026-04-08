import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginationComponent = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const GOLD = "#eebb5d";
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 w-100">
      {/* 1. Left Side: Simple Text (No Box) */}
      <div className="text-muted small">
        Showing Page <b>{currentPage}</b> of <b>{totalPages}</b> (Total{" "}
        <b>{totalItems}</b> Records)
      </div>

      {/* 2. Right Side: Clean Navigation */}
      <Pagination aria-label="Page navigation" className="mb-0">
        {/* First Button */}
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            first
            onClick={() => onPageChange(1)}
            className="border-0 bg-transparent text-dark"
          />
        </PaginationItem>

        {/* Previous Button (Single Arrow) */}
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            onClick={() => onPageChange(currentPage - 1)}
            className="border-0 bg-transparent text-dark">
            <span aria-hidden="true">‹</span>
          </PaginationLink>
        </PaginationItem>

        {/* Page Numbers */}
        {pages.map((page) => (
          <PaginationItem
            active={page === currentPage}
            key={page}
            className="mx-1">
            <PaginationLink
              onClick={() => onPageChange(page)}
              style={{
                borderRadius: "5px",
                border: "none",
                backgroundColor: page === currentPage ? GOLD : "transparent",
                color: page === currentPage ? "#fff" : "#333",
                padding: "5px 12px",
              }}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Next Button (Single Arrow) */}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            onClick={() => onPageChange(currentPage + 1)}
            className="border-0 bg-transparent text-dark">
            <span aria-hidden="true">›</span>
          </PaginationLink>
        </PaginationItem>

        {/* Last Button */}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            last
            onClick={() => onPageChange(totalPages)}
            className="border-0 bg-transparent text-dark"
          />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
