import { Link } from "react-router-dom";
import Facekbook from "../assets/Icon/facebook 1.svg";
import Instagram from "../assets/Icon/instagram 1.svg";
import Line from "../assets/Icon/line (1) 1.svg"
function Footer() {
    return (
        <footer>
        <div className="bg-primary">
            <div className='container'>
                <div className="row pt-5">
                    <div className="col-md-4 col-12 text-white">
                        <h2>Esthetic_seoul</h2>
                        <p>韓國是時尚與潮流的搖籃之一，<br />平凡卻充滿時尚，<br />Esthetic_seoul強調實用性和舒<br />適感的設計而聞名。</p>
                        <div className="p-0">
                            <ul className="d-flex p-0 fs-4 " style={{ listStyleType: "none", }}>
                                <li><Link to="" className="text-white ms-0 "><img src={Facekbook} alt="" /></Link></li>
                                <li><Link to="" className="text-white ms-3"><img src={Instagram} alt="" /></Link></li>
                                <li><Link to="" className="text-white ms-3"><img src={Line} alt="" /></Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-5 col-12 text-white">
                        <h2>service</h2>
                        <div>
                            <ul className="p-0" style={{ listStyleType: "none", }}>
                                <li><Link to="" className="text-white" style={{ textDecoration: "none", }}>熱門排行</Link></li>
                                <li><Link to="" className="text-white" style={{ textDecoration: "none", }}>上身類</Link></li>
                                <li><Link to="" className="text-white" style={{ textDecoration: "none", }}>下身類</Link></li>
                                <li><Link to="" className="text-white" style={{ textDecoration: "none", }}>洋裝</Link></li>
                                <li><Link to="" className="text-white" style={{ textDecoration: "none", }}>配件</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3 col-12">
                        <h2 className="text-white">Policy </h2>
                        <div>
                            <ul className="p-0" style={{ listStyleType: "none", }}>
                                <li><Link to="" className="text-white list-group-item" style={{ textDecoration: "none", }}>隱私權政策</Link></li>
                                <li className="mt-3"><Link to="" className="text-white" style={{ textDecoration: "none", }}>購物須知</Link></li>
                                <li className="mt-3"><Link to="" className="text-white" style={{ textDecoration: "none", }}>退換貨須知</Link></li>
                                <li className="mt-3"><Link to="" className="text-white" style={{ textDecoration: "none", }}>購物須知</Link></li>
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
};



export default Footer;