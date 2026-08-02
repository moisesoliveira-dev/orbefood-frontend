import './OrdersPagination.css';

interface OrdersPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function OrdersPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: OrdersPaginationProps) {
  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <nav className="orders-pagination" aria-label="Paginação de comandas">
      <p className="orders-pagination__meta">
        {from}–{to} de {totalItems}
      </p>

      <div className="orders-pagination__controls">
        <button
          type="button"
          className="orders-pagination__btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </button>
        <span className="orders-pagination__page">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className="orders-pagination__btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
        </button>
      </div>
    </nav>
  );
}
