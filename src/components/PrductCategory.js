import React from "react";

import { Link } from 'react-router-dom'
function ProductCategory({ categories, handleCategoryClick, selectedCategory }) {
  return (
    <>
       {categories.map((category, i) => {
          return (
            <div className="mb-2" key={i} >
              <Link style={{ textDecoration: "none" }}
                to={`/products/${category.name === '所有商品' ? 'all' : category.name}`}
                onClick={() => handleCategoryClick(category?.name)}
              >
                <h5 className={`fs-5 mt-3`} style={{
                  color: selectedCategory === category.name ? '#AD8F7E' : 'black'
                }}>{category?.name}</h5>
              </Link>
            </div>
          )
        })}
    </>
  )
}
export default ProductCategory;
