import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Pagination from "../../components/Pagintaion";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/img2.jpg";
import img3 from "../../assets/img/img3.jpg";
import img4 from "../../assets/img/img4.jpg";
import img5 from "../../assets/img/img5.jpg";
import prductsImg from "../../assets/img/S__219168919 1.png";
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
    const [categoryList, setCategoryList] = useState([]);
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

    // const getCategory = async () => {
    //     const res = await axios.get(
    //         `/v2/api/${process.env.REACT_APP_API_PATH}/products/all`
    //     );
    //     const productsAll = res.data.products;
    
    //     const categories = [
    //         ...new Set(productsAll.map((product) => product.category)), // 將所有商品的類別加到 categories 中
    //     ];
    
    //     categories.unshift('所有商品'); // 在類別清單的最前面加上 '所有商品'
    
    //     setCategoryList(categories);
    // };
    const getCategory = async () => {
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
        const productsAll = res.data.products;
  
        const categories = [
          ...new Set(productsAll.map((product) => product.category)), // 将所有商品的类别加到 categories 中
        ];
  
        categories.unshift('所有商品'); // 在类别清单的最前面加上 '所有商品'
        setIsLoading(true);

        setCategoryList(categories);
  
        const categoriesWithImages = categories.map((category) => ({
          name: category,
          image: categoryImages[category] || '/images/default.jpg' // 如果没有找到匹配的图片，则使用默认图片
        }));
  
        setCategoriesWithImages(categoriesWithImages);
  
        
        setIsLoading(false);

      };

    useEffect(() => {
      
        getProducts(1);
        getCategory();
    }, [getProducts]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
      };
    return (<>

        <div className="container mt-md-6  mb-6">
            <Loading isLoading={isLoading} />
            <div className="row">
                <div className="col-md-3 justify-content-center align-items-center">
                    {categoriesWithImages.map((category, i) => {
                        return (
                            <div className={`mb-5 text-center `} key={i} >
                                    <Link style={{textDecoration:"none"}}
                                        to={`/products/${category.name}`}
                                        onClick={() => handleCategoryClick(category.name)}
                                    >
                                    <img src={category.image} alt={category.name}
                                        style={{ width: '183px', height: '183px', objectFit: 'cover', borderRadius: '100%', }}
                                    />
                                    <h2 className={`fs-4 mt-3`}      style={{
                                          color: selectedCategory === category.name ? '#AD8F7E' : 'black'
                                        }}>{category.name}</h2>
                            </Link>
                                </div>

                        )
                    })}
        
                </div>
                <div className="col-md-9">
             
                    <div className="position-relative">
                        <img src={prductsImg} className="object-fit-cover w-100 mb-6 "  alt="" />
                        <div className="product-img-text position-absolute top-50 start-50 translate-middle align-content-around ">
                        <h2 className="text-primary text-center">換季商品<br />秋冬商品新上市</h2>
                        </div>
                    </div>
                   
                    <div className="row">
                        
                        {products.map((product) => {
                            return (
                                <div className="col-md-4" key={product.id}>
                                    {/* <div className="card border-0 mb-4 position-relative position-relative">
                                        <img src={product.imageUrl} className="card-img-top rounded-0 object-cover" alt="..." />
                                        <div className="card-body p-0">
                                            <h4 className="mb-0 mt-2"><Link to={`/product/${product.id}`}>{product.title}</Link></h4>
                                            <p className="card-text text-muted mb-0">{product.description}</p>
                                            <p className="text-muted mt-1">{product.price}</p>
                                        </div>
                                    </div> */}
                                    <div className="card border-0 mb-4">
                                        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                                            <img src={product.imageUrl} className="card-img-top rounded-0 object-cover" alt="..." />
                                            <div className="card-body bg-primary text-white text-center p-0">
                                                <h4 className="card-text mb-0" >{product.title}</h4>
                                                <p className="card-text">{product.price}</p>
                                            </div>
                                        </Link>
                                    </div>
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