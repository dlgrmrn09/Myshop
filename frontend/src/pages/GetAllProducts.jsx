import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Getallproducts.css";

function GetAllProducts() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/all-products?limit=${itemsPerPage}&skip=${
        (currentPage - 1) * itemsPerPage
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
        setTotal(data.total);
      })
      .catch((err) => console.error("Fetch error", err));
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="products-container">
      <h1 className="products-header">Products ({total})</h1>

      <div className="products-grid">
        {products.map((p) => (
          <Link to={`/single/${p.id}`} key={p.id} className="product-card">
            <img src={p.thumbnail} alt={p.title} className="product-image" />
            <h3 className="product-title">{p.title}</h3>
            <p className="product-price">{formatPrice(p.price)}</p>
            <p className="product-rating">
              <span className="star">★</span>
              {p.rating}
            </p>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <>
          <div className="pagination-container">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`pagination-page ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="pagination-ellipsis">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <div className="page-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, total)} of {total} products
          </div>
        </>
      )}
    </div>
  );
}

export default GetAllProducts;
