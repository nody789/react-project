import img1 from "../../assets/img/store.png"
function ShoppingStore(){
 return(
    <>
    <div className="container">
        <h2 className="text-primary mt-sm-7 mb-sm-6 mt-6 mb-3">門店資訊</h2>
    <div className="d-sm-flex mb-sm-7 mb-6">
        <img className="col-sm-4 col-12 mb-sm-0 mb-5" src={img1} alt="" />
    <div className="storebg col-sm-8 align-content-around "><h3 className="p-3">土城門市</h3><p className="ps-3 fw-bold">新北市新北路新北街20號1樓</p><p className="ps-3 fw-bold">0912-345-678</p><p className="ps-3 fw-bold">營業時間 11:00-22:00</p></div>
    </div>

    </div>

    </>
 )
}

export default ShoppingStore;