import { NavLink } from "react-router-dom"
import imgA from "../stylesheets/image/logo.svg"
import { useLocation } from 'react-router-dom';

function Navbar({ cartData }) {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const navbarClass = `navbar navbar-expand-lg py-5 ${isHomePage ? 'navbar-light sticky-top position-absolute w-100' : 'navbar-primary bg-primary text-white'}`;

    return (
        <nav className={navbarClass}  >
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
                                className="nav-link text-white" href="#">門店資訊</NavLink>
                        </li>
                    </ul>
                    <form className="d-flex align-items-center" role="search">
                        <input className="form-control me-3" type="search" placeholder="Search" aria-label="Search" style={{borderRadius: "30px"}}/>
                            {/* <li className="nav-item me-3 text-white"><i className="bi bi-heart-fill icon-size" ></i></li> */}
                        <NavLink to={'/cart'} className="navbar-nav position-relative ">{/*me-auto mb-2 mb-lg-0 */}
                       <i className="bi bi-bag text-white icon-size"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartData?.carts?.length}
                            </span>
                        </NavLink>
                    </form>
                </div>
            </div>
        </nav>
        // <nav className={`isHomePage ? 'navbar-home' : 'navbar-other' navbar navbar-expand-lg nav-bg`}>
        //     <ul>
        //         <li><a href="/">Home</a></li>
        //         <li className="nav-item">
        //             <NavLink
        //                 className="nav-link active" aria-current="page" to={"/products/all"}>所有商品</NavLink>
        //         </li>
        //     </ul>
        // </nav>
    )
}
export default Navbar