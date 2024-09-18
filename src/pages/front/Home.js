import React, { useEffect, useState, } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import ProductsCard from "../../components/ProductsCard";
import Carousel1 from "../../assets/img/Carousel-1.png"
import Carousel2 from "../../assets/img/Carousel-2.png"
import HomeImg from "../../assets/img/homeImg.png"
import homelogo1 from "../../assets/img/homelogo-1.png"
import homelogo2 from "../../assets/img/homelogo-2.png"
import homelogo3 from "../../assets/img/homelogo-3.png"
import homelogo4 from "../../assets/img/homelogo-4.png"
import homelogo5 from "../../assets/img/homelogo-5.png"

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        // 获取所有商品
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
        const productsAll = res.data.products;
        setProducts(getLatestProducts(productsAll));
        // 获取分类
        const categories = [
          ...new Set(productsAll.map((product) => product.category)),
        ];
        categories.unshift("所有商品"); // 在最前面添加“所有商品”
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch products or categories", error);
      }
    };

    getProducts(); // 调用函数以获取数据
  }, []);
  const getLatestProducts = (productsAll) => {
    return productsAll.slice(0, 8);
  };


  const getImageByIndex = (index) => {
    const images = [homelogo1, homelogo2, homelogo3, homelogo4, homelogo5];
    return images[index % images.length]; // 确保图片的索引不超过数组长度
  }
  return (
    <>

      <div className="hero-section">
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={Carousel1} className="d-block w-100" alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src={Carousel2} className="d-block w-100" alt="Slide 2" />
            </div>
            <div className="container-lg">
              <div className="hero-text">
                <p className="text-white h1 mb-4">Esthetic_seoul</p>
                <p className="text-white h1 mb-4">「平凡卻充滿時尚」</p>
                <p className="text-white">韓國服飾首選品牌</p>
                <Link to="/products/all">
                  <button className="btn btn-primary text-white btn-item-1">前往選購</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-7">
        <div className="row">
          <p className="h1">Esthetic_seoul</p>
          <p>提供您最需要的時尚單品</p>
          {products.map((product) => (
            <div className="col-lg-3 col-6" key={product.id}>
              <Link to={`/product/${product.id}`}
                style={{ textDecoration: 'none' }}
              >
                <ProductsCard product={product} />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div>
        <img src={HomeImg} className="d-block w-100" alt="" />
      </div>
      <div className="container-fluid p-0 my-7">
        <div className="row g-0">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`col-md-${index < 2 ? '6' : '4'} col-6 ${index === categories.length - 1 ? 'col-12' : ''} py-1 pe-1 position-relative`}
            >
              <NavLink
                className="nav-link active text-white"
                aria-current="page"
                to={`/products/${category === '所有商品' ? 'all' : category}`}
              >
                <img
                  src={getImageByIndex(index)}
                  alt={category}
                  className="category-image img-fluid w-100"
                  style={{ objectFit: 'cover' }}
                />
                <div className="category-overlay">
                  <span className="category-text">{category}</span>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </div>


    </>
  )
}
export default Home;