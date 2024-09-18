import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from "axios";
import Loading from "../../components/Loading";
import ProductsCard from '../../components/ProductsCard';

function Search() {
  // 使用 useSearchParams 取得 URL 中的查詢參數
  const [searchParams] = useSearchParams()
  // 定義 state 來存放產品資料和載入狀態
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  //從查詢參數中取得搜尋字串
  const searchString = searchParams?.get('query')

  useEffect(() => {
    const getFilteredProduct = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
        setProducts(
          // 過濾產品資料，僅保留標題包含搜尋字串的產品
          res.data?.products?.filter((item) =>
            item.title.includes(searchString)
          )
        )
      } catch (error) {
        setProducts([])
        // Toast.fire({ icon: 'error', title: '發生錯誤，請重新整理再試一次' })
      } finally {
        setIsLoading(false)
      }
    }
    if (searchString) {
      // 如果有搜尋字串，調用 getFilteredProduct 來獲取過濾後的產品
      getFilteredProduct()
    } else {
      setProducts([])
    }
  }, [searchString])

  return (
    <>
      <div className="container mt-5">
        <Loading isLoading={isLoading} />
        <div className="row">
          <div className="col-md-3">
            {/* <Side /> */}
          </div>
          <div className="col-md-9">
            {searchString ? (
              <p className="mb-2">
                關鍵字 {searchString} ，找到 {products.length} 筆商品{' '}
              </p>
            ) : (
              <p className="mb-2">請輸入搜尋關鍵字</p>
            )}
            <hr />
            {products?.length ? (
              ''
            ) : (
              <p>
                很抱歉，查無相關商品，您可以調整關鍵字再試試看
              </p>
            )}
            <div className="row">
              {products.map((product) => {
                return (
                  <div className="col-md-4 col-6" key={product.id}>

                    <ProductsCard product={product} />
                  </div>

                )

              })}
            </div>
            <button
              type="button"
              className="btn btn-primary mb-4 text-white"
              onClick={() => navigate('/')}
            >
              回首頁
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default Search;