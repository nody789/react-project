import { useEffect, useState, } from "react";
import axios from "axios";
import { Link, } from "react-router-dom";
import ProductsCard from "../../components/ProductsCard";
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

        <div className="row my-7">


          <p className="h1">Esthetic_seoul</p>
          <p>提供您最需要的時尚單品</p>


          {categoriesWithImages.map((category, i) => {
            return (
              <div className={`pe-3 text-center col-md-2  col-lg-2 col-6 mb-60 `} key={i} >
                <div className="d-flex  align-items-center home-img-container">

                  <Link style={{ textDecoration: "none" }}
                    to={`/products/${category.name === '所有商品' ? 'all' : category.name}`}
                  >
                    <img src={category.image} alt={category.name}
                      className="home-img"
                    />
                    <h2 className="fs-4 mt-3 text-dark">{category.name}</h2>
                  </Link>
                </div>
              </div>

            )
          })}
        </div>
      </div>
      <div>
        <img src={HomeImg} className="d-block w-100" alt="" />
      </div>
      <div className="container my-7">
        <div className="row">
          {products.map((product) => (
            <div className="col-lg-3 col-6" key={product.id}>
              <ProductsCard product={product} />
            </div>
          ))}
        </div>


      </div>
      <div className="container-fluid p-0 ">
        <div className="row ">
          <div className="col-md-3 col-6 p-0">
            <img src={homelogo1} alt="" className="img-fluid" />
          </div>
          <div className="col-md-3   col-6 p-0">
            <img src={homelogo2} alt="" className="img-fluid" />
          </div>
          <div className="col-md-3  col-6 p-0">
            <img src={homelogo3} alt="" className="img-fluid" />
          </div>
          <div className="col-md-3  col-6 p-0" >
            <img src={homelogo4} alt="" className="img-fluid" />
          </div>
        </div>
      </div>
    </>
  )
}
export default Home;