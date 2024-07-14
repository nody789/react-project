import { Link } from 'react-router-dom'

function ProductCategory({ categoriesWithImages, handleCategoryClick, selectedCategory }) {


    return (
        <>
            <div className='row'>

                {categoriesWithImages.map((category, i) => {
                    return (
                        <div className={`mb-5 text-center col-md-12 col-6 category-item`} key={i} >
                            <Link style={{ textDecoration: "none" }}
                                to={`/products/${category.name === '所有商品' ? 'all' : category.name}`}
                                onClick={() => handleCategoryClick(category?.name)}
                            >
                                <div className="category-image-wrapper">

                                    <img src={category?.image} alt={category?.name}
                                        className="category-image rounded-circle"
                                    />
                                </div>

                                <h2 className={`fs-4 mt-3`} style={{
                                    color: selectedCategory === category.name ? '#AD8F7E' : 'black'
                                }}>{category?.name}</h2>
                            </Link>
                        </div>

                    )
                })}
            </div>
        </>

    )
}
export default ProductCategory;
