import React from "react";
function ProductsCard({ product }) {
  return (
    <>
      <div className="card border-0 mb-4">
        <img src={product.imageUrl} className="card-img-top rounded-0" alt={product.title} style={{ height: "300px" }} />
        <div className="card-body  text-center" style={{ padding: "10px" }}>
          <h4 className="card-text mb-0 fs-5" >{product.title}</h4>
          <div className="d-flex justify-content-center" style={{ marginTop: "10px" }}>
            <p className="card-text fs-6 m-0" >NT{product.price}</p>
            <p className="text-decoration-line-through m-0" style={{ paddingLeft: "10px" }} >NT${product.origin_price}</p>
          </div>
          <button className="btn btn-primary text-white cart-btn" style={{ marginTop: "10px" }}>前往選購</button>
        </div>
      </div>
    </>
  )
}


export default ProductsCard