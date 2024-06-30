import { Link } from 'react-router-dom'

function ProductsCard({ product }) {
    return (
        <>
            <div className="card border-0 mb-4">
                <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                    <img src={product.imageUrl} className="card-img-top rounded-0 object-cover" alt="..." />
                    <div className="card-body bg-primary text-white text-center" style={{ padding: "10px" }}>
                        <h4 className="card-text mb-0 fs-5" >{product.title}</h4>
                        <div className="d-flex justify-content-center">
                        <p className="text-decoration-line-through m-0" >NT${product.origin_price}</p>
                            <p className="card-text fs-6 m-0" style={{ paddingLeft: "10px" }}>NT{product.price}</p>
                        </div>

                    </div>
                </Link>
            </div>
        </>
    )
}


export default ProductsCard