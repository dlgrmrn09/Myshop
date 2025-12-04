import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Getallproducts.css";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 12;

  // Form state
  const [formData, setFormData] = useState({
    thumbnail: "",
    title: "",
    description: "",
    category: "",
    price: "",
    discountPercentage: "",
    rating: "",
    stock: "",
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    thumbnail: "",
    title: "",
    description: "",
    category: "",
    price: "",
    discountPercentage: "",
    rating: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = (page = 1) => {
    setLoading(true);
    const limit = itemsPerPage;
    const skip = (page - 1) * itemsPerPage;

    fetch(`http://localhost:3000/api/all-products?limit=${limit}&skip=${skip}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
        setTotal(
          typeof data.total === "number"
            ? data.total
            : parseInt(data.total) || (data.data ? data.data.length : 0)
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error", err);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      alert("Please fill in title and price");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || "No description",
          category: formData.category || null,
          price: parseFloat(formData.price),
          thumbnail: formData.thumbnail || "https://via.placeholder.com/300",
          discountPercentage: parseFloat(formData.discountPercentage) || 0,
          rating: parseFloat(formData.rating) || 0,
          stock: parseInt(formData.stock) || 0,
        }),
      });

      const newProduct = await response.json();
      if (response.ok) {
        setProducts([newProduct.data, ...products]);
        setFormData({
          thumbnail: "",
          title: "",
          description: "",
          category: "",
          price: "",
          discountPercentage: "",
          rating: "",
          stock: "",
        });
        alert("Product added successfully!");
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditFormData({
      thumbnail: product.thumbnail || "",
      title: product.title,
      description: product.description || "",
      category: product.category || "",
      price: product.price ? product.price.toString() : "",
      discountPercentage:
        product.discountPercentage != null
          ? String(product.discountPercentage)
          : product.discount_percentage != null
          ? String(product.discount_percentage)
          : "",
      rating: product.rating != null ? String(product.rating) : "",
      stock: product.stock != null ? String(product.stock) : "",
    });
  };

  const handleSaveEdit = async (id) => {
    if (!editFormData.title || !editFormData.price) {
      alert("Please fill in title and price");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/update-product/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editFormData.title,
            description: editFormData.description || "No description",
            category: editFormData.category || null,
            price: parseFloat(editFormData.price),
            thumbnail:
              editFormData.thumbnail || "https://via.placeholder.com/300",
            discountPercentage:
              parseFloat(editFormData.discountPercentage) || 0,
            rating: parseFloat(editFormData.rating) || 0,
            stock: parseInt(editFormData.stock) || 0,
          }),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(
          products.map((p) => (p.id === id ? updatedProduct.data : p))
        );
        setEditingId(null);
        alert("Product updated successfully!");
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ title: "", description: "", price: "", thumbnail: "" });
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/delete-product/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert("Product deleted successfully!");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="products-container">
      <h1 className="products-header">Manage Products ({total})</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Add New Product</h2>
        <div className="form-row">
          <input
            type="text"
            name="title"
            placeholder="Product Title *"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price *"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="url"
          name="thumbnail"
          placeholder="Image URL"
          value={formData.thumbnail}
          onChange={handleInputChange}
        />
        <div className="form-row">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="discountPercentage"
            placeholder="Discount %"
            step="0.01"
            value={formData.discountPercentage}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            step="0.1"
            value={formData.rating}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="add-button" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {loading && products.length === 0 ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map((p) => (
              <div key={p.id} className="product-card-manage">
                {editingId === p.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      className="edit-input"
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      className="edit-input"
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      step="0.01"
                      value={editFormData.price}
                      onChange={handleEditInputChange}
                      className="edit-input"
                    />
                    <input
                      type="url"
                      name="thumbnail"
                      placeholder="Image URL"
                      value={editFormData.thumbnail}
                      onChange={handleEditInputChange}
                      className="edit-input"
                    />
                    <input
                      type="text"
                      name="category"
                      placeholder="Category"
                      value={editFormData.category}
                      onChange={handleEditInputChange}
                      className="edit-input"
                    />
                    <input
                      type="number"
                      name="discountPercentage"
                      placeholder="Discount %"
                      step="0.01"
                      value={editFormData.discountPercentage}
                      onChange={handleEditInputChange}
                      className="edit-input"
                    />
                    <input
                      type="number"
                      name="rating"
                      placeholder="Rating"
                      step="0.1"
                      value={editFormData.rating}
                      onChange={handleEditInputChange}
                      className="edit-input"
                    />
                    <input
                      type="number"
                      name="stock"
                      placeholder="Stock"
                      value={editFormData.stock}
                      onChange={handleEditInputChange}
                      className="edit-input"
                    />
                    <div className="product-buttons">
                      <button
                        className="save-button"
                        onClick={() => handleSaveEdit(p.id)}
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-button"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      to={`/single/${p.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="product-image"
                      />
                      <h3 className="product-title">{p.title}</h3>
                      <p className="product-price">{formatPrice(p.price)}</p>
                      <p className="product-rating">
                        <span className="star">★</span>
                        {p.rating}
                      </p>
                    </Link>
                    <div className="product-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(p)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={(e) => handleDelete(p.id, e)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
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
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="pagination-ellipsis">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}

                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>

              <div className="page-info">
                Showing {startIndex + 1} -{" "}
                {Math.min(startIndex + products.length, total)} of {total}{" "}
                products
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ManageProducts;
