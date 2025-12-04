import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/OneProduct.css";

function OneProduct() {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/api/all-products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.data));
  }, [id]);

  return (
    <div className="product-container">
      <Link
        to={"/"}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <button className="back-button">Back</button>
      </Link>
      <div className="product-card">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image"
        />
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">${product.price}</p>
        <p className="product-rating">Rating: {product.rating}</p>
        <p className="product-description">{product.description}</p>

        {product.category && (
          <div className="product-details">
            <div className="detail-item">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{product.category}</span>
            </div>
            {product.brand && (
              <div className="detail-item">
                <span className="detail-label">Brand:</span>
                <span className="detail-value">{product.brand}</span>
              </div>
            )}
            {product.stock !== undefined && (
              <div className="detail-item">
                <span className="detail-label">Stock:</span>
                <span className="detail-value">{product.stock} available</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OneProduct;
