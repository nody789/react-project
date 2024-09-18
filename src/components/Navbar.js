import { useLocation, Link, useSearchParams, useNavigate, NavLink } from 'react-router-dom';
import imgA from "../stylesheets/image/logo.svg"
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from "react";
import { Collapse } from "bootstrap";
import axios from 'axios';

function Navbar({ cartData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const [searchParams] = useSearchParams()
  const { pathname } = useLocation()
  const searchString = searchParams.get('query')
  const [searchInput, setSearchInput] = useState('')

  const isHomePage = location.pathname === '/';
  const navbarClass = `navbar navbar-expand-lg py-3 ${isHomePage ? 'navbar-home' : 'navbar-primary bg-primary text-white'}`;
  const favoriteCount = useSelector((state) => state.favorites?.length || 0);
  const handleChange = (e) => {
    setSearchInput(e.target.value)
  }
  const closeCollapse = () => {
    let navCollapse = new Collapse('#navbarNav');
    navCollapse.hide();

  }
  const handleSearch = (e) => {
    const searchString = searchInput.trim()
    if (!searchString.length) return
    if (
      e.key === 'Enter' ||
      e.target.id === 'searchNav' ||
      e.target.id === 'searchNavIcon'
    ) {
      navigate(`/search?query=${searchString}`);

    }
  }
  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
        const productsAll = res.data.products;

        // 獲取分類
        const categories = [
          ...new Set(productsAll.map((product) => product.category)),
        ];
        categories.unshift('所有商品');

        setCategoryList(categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    getCategory();
  }, []);
  useEffect(() => {
    if (pathname.startsWith('/search') && searchString) {
      setSearchInput(searchString)
    } else {
      setSearchInput('')
    }
  }, [pathname, searchString])
  useEffect(() => {
    const navCollapse = new Collapse('#navbarNav', {
      toggle: false
    });

    navCollapse.hide();

    return () => {
      navCollapse.dispose();
    };
  }, [pathname]);
  return (
    <nav className={navbarClass}  >
      <div className="container-lg mb-0 ">
        <NavLink
          className="nav-link py-0 " aria-current="page" to={"/"} ><img src={imgA} alt="" /></NavLink>
        <div className="d-flex order-lg-3">
          <NavLink to={'/favorite'} className="navbar-nav position-relative me-3">
            <i className="bi bi-heart-fill text-white icon-size"></i>
            {favoriteCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {favoriteCount}
              </span>
            )}
          </NavLink>
          <NavLink to={'/cart'} className="navbar-nav position-relative ">
            <i className="bi bi-bag text-white icon-size"></i>
            {cartData?.carts?.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartData?.carts?.length}
              </span>
            )}
          </NavLink>
          <button style={{ border: 'none', outline: 'none' }}
            className="navbar-toggler btn border-0 btn-none ms-2 p-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <i className="bi bi-list navbar-toggler   border-0  text-white"></i>
          </button>
        </div>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">

          <ul className="navbar-nav  align-items-center bg-">
            {categoryList.map((category, index) => (
              <li className="nav-item" key={index}>
                <NavLink onClick={() => closeCollapse()}
                  className="nav-link active py-lg-0 py-3 text-white" aria-current="page" to={`/products/${category === '所有商品' ? 'all' : category}`}>{category}</NavLink>
              </li>
            ))}
            <li className="nav-item">
              <NavLink onClick={() => closeCollapse()}
                to={'/ShoppingStore'}
                className="nav-link text-white" href="#">門店資訊</NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center justify-content-center " role="search">
            <div className="input-group me-3 mt-2 " id="search-container">
              <input
                className="form-control border-end-0 border"
                type="search"
                id="example-search-input"
                style={{ borderRadius: "30px" }} // Adjust width to 50%
                value={searchInput}
                onChange={handleChange}
                onKeyDown={handleSearch}
              />
              <Link className="input-group-append" onClick={handleSearch}>
                <button
                  className="btn bg-white border-start-0 border-top-0 border-bottom-0 border"
                  style={{ marginLeft: "-40px", borderRadius: "30px" }}
                  type="Search"
                >
                  <i className="bi bi-search"></i>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>


  )
}
export default Navbar