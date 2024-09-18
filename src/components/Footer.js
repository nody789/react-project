import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Facekbook from "../assets/Icon/facebook.svg";
import Instagram from "../assets/Icon/instagram.svg";
import Line from "../assets/Icon/line.svg"
function Footer() {
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
        const productsAll = res.data.products;

        // 獲取分類
        const categories = [
          ...new Set(productsAll.map((product) => product.category)),
        ];

        setCategoryList(categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    getCategory();
  }, []);
  return (
    <footer>
      <div className="bg-primary">
        <div className='container'>
          <div className="row pt-5">
            <div className="col-md-4 col-12 text-white">
              <h5>Esthetic_seoul</h5>
              <p className="mt-0 mt-md-3">韓國是時尚與潮流的搖籃之一，<br />平凡卻充滿時尚，<br />Esthetic_seoul強調實用性和舒<br />適感的設計而聞名。</p>
              <div className="p-0">
                <ul className="d-flex p-0 fs-4 " style={{ listStyleType: "none", }}>
                  <li><Link to="" className="text-white ms-0 "><img src={Facekbook} alt="Facebook" /></Link></li>
                  <li><Link to="" className="text-white ms-3"><img src={Instagram} alt="Instagram" /></Link></li>
                  <li><Link to="" className="text-white ms-3"><img src={Line} alt="Line" /></Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-5 col-12 text-white mb-0 mb-md-4">
              <h5>service</h5>
              <div>
                <ul className="p-0 d-flex d-md-block" style={{ listStyleType: "none" }}>
                  {categoryList.map((category, index) => (
                    <li className={`mt-0 mt-md-3 ${index === 0 ? '' : 'ms-3 ms-md-0'}`}
                      key={index}>
                      <Link
                        className="text-white" aria-current="page" style={{ textDecoration: "none" }} to={`/products/${category}`}>{category}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-3 col-12 mb-4 mb-md-0">
              <h5 className="text-white">Policy </h5>
              <div>
                <ul className="p-0 d-flex d-md-block" style={{ listStyleType: "none", }}>
                  <li className="mt-0 mt-md-3"><Link to="" className="text-white list-group-item" style={{ textDecoration: "none", }}>隱私權政策</Link></li>
                  <li className="mt-0 mt-md-3 ms-3 ms-md-0"><Link to="" className="text-white  " style={{ textDecoration: "none", }}>購物須知</Link></li>
                  <li className="mt-0 mt-md-3 ms-3 ms-md-0"><Link to="" className="text-white  " style={{ textDecoration: "none", }}>退換貨須知</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <small className="d-flex align-items-center justify-content-center flex-column flex-md-row   py-2">
        Copyright © 2023 Esthetic_seoul. All rights reserved. 版權所有© 2023 Esthetic_seoul
      </small>
    </footer>
  )
}



export default Footer;