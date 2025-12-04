import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import GetAllProducts from "./pages/GetAllProducts.jsx";
import OneProduct from "./pages/OneProduct.jsx";
import ManageProducts from "./pages/ManageProducts.jsx";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <nav>
      <Link
        to="/"
        className="link"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        Home
      </Link>
      <Link
        to="/manage"
        className="link"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        manage products
      </Link>
    </nav>
    <Routes>
      <Route path="/" element={<GetAllProducts />}></Route>
      <Route path="/single/:id" element={<OneProduct />}></Route>
      <Route path="/manage" element={<ManageProducts />}></Route>
    </Routes>
  </BrowserRouter>
);
