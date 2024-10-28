import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Pagination from "../../components/Pagintaion";
import { Link, useParams, useNavigate, } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Loading from "../../components/Loading";
import ProductsCard from "../../components/ProductsCard";
import prductsImg from "../../assets/img/S__219168919 1.png";
import ProductCategory from "../../components/PrductCategory";
import { createAsyncMessage, } from "../../slice/messageSlice";

function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('所有商品');
  const [categoriesData, setCategories] = useState([]);
  const { category } = useParams();
  const dispatch = useDispatch();

  const getProducts = useCallback(
    async (page = 1) => {
      try{

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
      }catch(error){
        console.error("Failed to fetch products or categories", error);
      }
    },
    [category, navigate]
  );



  
  useEffect(() => {
    if (category) {
      setSelectedCategory(category === 'all' ? '所有商品' : category);
    }
  }, [category]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
        const productsAll = res.data.products;
    
        const categories = [
          { name: '所有商品' },
          ...[...new Set(productsAll.map((product) => product.category))].map((category) => ({
            name: category,
          }))
        ];
        setIsLoading(true);
        setCategories(categories); 
        setIsLoading(false);
      } catch (error) {
        dispatch(createAsyncMessage(error.response.data));
        setIsLoading(false);
      }
    };
    getCategory();
    getProducts(1);
  }, [getProducts,dispatch]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  return (<>
    <div className="mt-6 mb-6 container-lg">
      <Loading isLoading={isLoading} />
      <div className="row">
        <div className="col-md-3 col-sm-12 d-none d-md-block ">
          <ProductCategory
            categories={categoriesData}
            selectedCategory={selectedCategory}
            handleCategoryClick={handleCategoryClick}
          />
        </div>
        <div className="col-md-9 col-sm-12">
          <div className="position-relative">
            <img src={prductsImg} className="img-fluid mb-6 w-100" alt="商品图片" style={{borderRadius:"10px"}} />
            <div className="product-img-text position-absolute top-50 start-50 translate-middle align-content-around text-center">
              <h2 className="text-primary">換季商品<br />秋冬商品新上市</h2>
            </div>
          </div>
          <div className="row">
          <h3 >
                {selectedCategory}
              </h3>
            {products.map((product) => (
              <div className="col-md-4 col-6 mb-4" key={product.id}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <ProductsCard product={product} />
                </Link>
              </div>
            ))}
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