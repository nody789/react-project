import { useEffect, useState, } from "react";
import axios from "axios";
import { Link, } from "react-router-dom";
import Carousel1 from "../../assets/img/Carousel-1.png"
import Carousel2 from "../../assets/img/Carousel-2.png"
import HomeImg from "../../assets/img/homeImg.png"
import homelogo1 from "../../assets/img/homelogo1.png"
import homelogo2 from "../../assets/img/homelogo2.png"
import homelogo3 from "../../assets/img/homelogo3.png"
import homelogo4 from "../../assets/img/homelogo4.png"

import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/img2.jpg";
import img3 from "../../assets/img/img3.jpg";
import img4 from "../../assets/img/img4.jpg";
import img5 from "../../assets/img/img5.jpg";


const categoryImages = {
  '所有商品': img1,
  '上身': img2,
  '下身': img3,
  '洋裝': img4,
  '配件': img5
};
function Home() {
  const [categoryList, setCategoryList] = useState([]);
  const [categoriesWithImages, setCategoriesWithImages] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
      const productsAll = res.data.products;

      const categories = [
        ...new Set(productsAll.map((product) => product.category)), // 将所有商品的类别加到 categories 中
      ];

      categories.unshift('所有商品'); // 在类别清单的最前面加上 '所有商品'

      setCategoryList(categories);

      const categoriesWithImages = categories.map((category) => ({
        name: category,
        image: categoryImages[category] || '/images/default.jpg' // 如果没有找到匹配的图片，则使用默认图片
      }));

      setCategoriesWithImages(categoriesWithImages);

      // 只取最新的8笔数据
      const latestProducts = productsAll.slice(0, 8);
      setProducts(latestProducts);
    };

    getCategory();
  }, []);
  return (
    <>
      {/* <header id="lokiMenu" class="fixed-top">
    <nav class="navbar navbar-expand-md navbar-light navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="#lokiSlider">泰山渡假飯店</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#lokiNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="lokiNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#lokiRoom"><i class="fas fa-bed me-2"></i>房型介紹</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#lokiFacility"><i class="fas fa-gamepad me-2"></i>服務設施</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#lokiFood"><i class="fas fa-utensils me-2"></i>餐飲美食</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#lokiTrans"><i class="fas fa-map-marker-alt me-2"></i>交通資訊</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#lokiContact"><i class="fas fa-envelope me-2"></i>聯絡我們</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header> */}
      <div className="container-fluid">
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          </div>
          <div className="carousel-inner position-relative">
            <div className="carousel-item active">
              <img src={Carousel1} className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src={Carousel2} className="d-block w-100" alt="..." />
            </div>
            <div className="position-absolute top-50 " style={{ left: "8%" }}>
              <p className="text-white h1">Esthetic_seoul</p>
              <p className="text-white h1">「平凡卻充滿時尚」</p>
              <p className="text-white">韓國服飾首選品牌</p>
            </div>
          </div>
        </div>
        </div>
        <div className="container">

        <div className="row">
          
          <div className="col-12 my-7">
            <p className="h1">Esthetic_seoul</p>
            <p>提供您最需要的時尚單品</p>
            <div className="d-flex">

            {categoriesWithImages.map((category, i) => {
              return (
                <div className={`pe-3 text-center `} key={i} >
                  <Link style={{ textDecoration: "none" }}
                    to={`/products/${category.name}`}
                  >
                    <img src={category.image} alt={category.name}
                      style={{ width: '183px', height: '183px', objectFit: 'cover', borderRadius: '100%', }}
                    />
                    <h2 className="fs-4 mt-3 text-dark">{category.name}</h2>
                  </Link>
                </div>

              )
            })}
            </div>
          </div>
        </div>
        </div>
        <div>
          <img src={HomeImg} className="d-block w-100" alt="" />
        </div>
        <div className="container my-7">
        <div className="row">
        {products.map((product) => (
          <div className="col-3" key={product.id}>
            <div className="card product-card border-0 mb-6">
              <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                <img src={product.imageUrl} className="card-img-top rounded-0 object-cover" alt={product.title} />
                <div className="card-body bg-primary text-white text-center p-0">
                  <h4 className="card-text mb-0">{product.title}</h4>
                  <p className="card-text">{product.price}</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
        </div>
    

        </div>
        <div className="container-fluid p-0">
          <div className="d-flex">
            <img src={homelogo1} alt="" />
            <img src={homelogo2} alt="" />
            <img src={homelogo3} alt="" />
            <img src={homelogo4} alt="" />
          </div>
      </div>
    </>
  )
}
export default Home;