import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Pagination from "../../components/Pagintaion";
import { Link, useParams, useNavigate, } from "react-router-dom";
import Loading from "../../components/Loading";
import ProductsCard from "../../components/ProductsCard";

import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/img2.jpg";
import img3 from "../../assets/img/img3.jpg";
import img4 from "../../assets/img/img4.jpg";
import img5 from "../../assets/img/img5.jpg";

import prductsImg from "../../assets/img/S__219168919 1.png";
import ProductCategory from "../../components/PrductCategory";
const categoryImages = {
    '所有商品': img1,
    '上身': img2,
    '下身': img3,
    '洋裝': img4,
    '配件': img5
};
function Products() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('所有商品');
    const [categoriesWithImages, setCategoriesWithImages] = useState([]);
    const { category } = useParams();
    const getProducts = useCallback(
        async (page = 1) => {
            setIsLoading(true);
            const filterCategory = category === 'all' ? '' : category;
            const productRes = await axios.get(
                `/v2/api/${process.env.REACT_APP_API_PATH
                }/products?page=${page}&category=${filterCategory}`
            );
            if (productRes.data.products.length === 0) {
                navigate('/products/all');
            }
            setProducts(productRes.data.products);
            setPagination(productRes.data.pagination);
            setIsLoading(false);
        },
        [category, navigate]
    );


    const getCategory = async () => {
        try {
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
            const productsAll = res.data.products;
      
            const categories = [
              ...new Set(productsAll.map((product) => product.category)), // 將所有商品的類別加到 categories 中
            ];
      
            categories.unshift('所有商品'); // 在類別清單的最前面加上 '所有商品'
            setIsLoading(true);
      
            const categoriesWithImages = categories.map((category) => ({
              name: category,
              image: categoryImages[category] || '/images/default.jpg' // 如果沒有找到匹配的圖片，則使用默認圖片
            }));
            setCategoriesWithImages(categoriesWithImages);
            setIsLoading(false);
          } catch (error) {
            console.error("Error fetching categories:", error);
            setIsLoading(false);
          }
        

    };
    useEffect(() => {
        if (category) {
            setSelectedCategory(category === 'all' ? '所有商品' : category);
        }
    }, [category]);

    useEffect(() => {
        getCategory()
        getProducts(1);
    }, [getProducts]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };
    return (<>

        <div className="container-lg mt-6  mb-6">
            <Loading isLoading={isLoading} />
            <div className="row">
                <div className=" col-md-3 col-sm-12 justify-content-center align-items-center">
                            < ProductCategory 
                            categoriesWithImages={categoriesWithImages} 
                                selectedCategory={selectedCategory}
                                handleCategoryClick={handleCategoryClick} />
              
                </div>
                <div className=" col-md-9 col-sm-12 ">
                    <div className="position-relative">
                        <img src={prductsImg} className="object-fit-cover img-fluid mb-6 " alt="" />
                        <div className="product-img-text position-absolute top-50 start-50 translate-middle align-content-around ">
                            <h2 className="text-primary text-center">換季商品<br />秋冬商品新上市</h2>
                        </div>
                    </div>

                    <div className="row">

                        {products.map((product) => {
                            return (
                                <div className="col-md-4 col-6" key={product.id}>

                                 <ProductsCard product={product}/>
                                </div>

                            )

                        })}
                    </div>
                    <nav className="d-flex justify-content-center">
                        <Pagination pagination={pagination} changePage={getProducts} />
                    </nav>
                </div>
            </div>
        </div>
    </>)
}
export default Products;