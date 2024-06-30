import { useLocation, Link, useSearchParams, useNavigate, NavLink } from 'react-router-dom';
import imgA from "../stylesheets/image/logo.svg"
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
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
    const navbarClass = `navbar navbar-expand-lg py-5 ${isHomePage ? 'navbar-light sticky-top position-absolute w-100' : 'navbar-primary bg-primary text-white'}`;
    const favoriteCount = useSelector((state) => state.favorites?.length || 0);
    const handleChange = (e) => {
        setSearchInput(e.target.value)
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
    }, [searchString])

    return (
        <nav className={navbarClass}  >
<<<<<<< HEAD
            <div className="container-fluid mb-0 px-md-7 ">

                <NavLink
                    className="nav-link py-0 " aria-current="page" to={"/"} ><img src={imgA} alt="" /></NavLink>
                <div className="d-flex order-lg-3">
                    <NavLink to={'/favorite'} className="navbar-nav position-relative me-3">{/*me-auto mb-2 mb-lg-0 */}
                        <i className="bi bi-heart-fill text-white icon-size"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {favoriteCount}
                        </span>
                    </NavLink>
                    <NavLink to={'/cart'} className="navbar-nav position-relative ">{/*me-auto mb-2 mb-lg-0 */}
                        <i className="bi bi-bag text-white icon-size"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartData?.carts?.length}
                        </span>
                    </NavLink>
                    <button className="navbar-toggler btn border-0 btn-none ms-2 p-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="bi bi-list navbar-toggler   border-0  text-white"></i>

                    </button>
                </div>

                <div className="collapse navbar-collapse justify-content-end" id="navbarContent">

                    <ul className="navbar-nav  align-items-center bg-">
                        {categoryList.map((category, index) => (
                               <li className="nav-item" key={index}>
                               <NavLink
                                   className="nav-link active py-lg-0 py-3 text-white" aria-current="page" to={`/products/${category === '所有商品' ? 'all' : category}`}>{category}</NavLink>
                           </li>
                        ))}
 
=======
            <div className="container-fluid">
                <div className="collapse navbar-collapse justify-content-center align-items-baseline" id="navbarSupportedContent">
                    <h1 className="mb-0 pe-5">                       
                            <NavLink
                                className="nav-link py-0 " aria-current="page" to={"/"} ><img src={imgA} alt="" /></NavLink>
                     </h1>
                    <ul className="navbar-nav mb-2 mb-lg-0 me-3 align-items-center">
                        {/* <li className="nav-item">
                            <NavLink
                                className="nav-link py-0 " aria-current="page" to={"/"} ><img src={imgA} alt="" /></NavLink>
                        </li> */}
                        <li className="nav-item">
                            <NavLink
                                className="nav-link active text-white" aria-current="page" to={"/products/all"}>所有商品</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link text-white" >熱銷商品</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link text-white" >上衣類</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link text-white" >下身類</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link text-white" >洋裝</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link text-white" >配件</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                            to={'/ShoppingStore'}
                                className="nav-link text-white" href="#">門店資訊</NavLink>
                        </li>
>>>>>>> 5999229de6fa979cdb6f1c2b5bb6afd637ddc53f
                    </ul>
                    <div className="d-flex align-items-center " role="search">
                        <div className="input-group me-3 " id="search-container">


                            <input className="form-control border-end-0 border" type="search" id="example-search-input" style={{ borderRadius: "30px" }} value={searchInput}
                                onChange={handleChange}
                                onKeyDown={handleSearch} />
                            <Link className={`input-group-append `} onClick={handleSearch}>
                                <button className="btn  bg-white border-start-0 border-top-0 border-bottom-0 border " style={{ marginLeft: "-40px", borderRadius: "30px" }} type="Search">
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