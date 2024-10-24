
function Pagination({ pagination, changePage }) {
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination m-0">
        <li className="page-item">
          <a className={`page-link ${pagination.has_pre ? '' : 'disabled'}`} href="/" aria-label="Previous"
            //上面用來判斷是否有前頁
            onClick={(e) => {
              e.preventDefault();
              //i換成當前頁面pagination.current_page
              changePage(pagination.current_page - 1);//加上索引位置
            }}>
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {
          [...new Array(pagination.total_pages)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li className="page-item" key={`${i}_page`}>
              <a
                className={`page-link ${(i + 1 === pagination.current_page) && 'active'}`}
                href="/" onClick={(e) => {
                  e.preventDefault();
                  changePage(i + 1);//加上索引位置
                }}
              >
                {i + 1}
              </a>

            </li>
          ))
        }
        <li className="page-item">
          <a className={`page-link ${pagination.has_next ? '' : 'disabled'}`} href="/" aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              //i換成當前頁面pagination.current_page
              changePage(pagination.current_page + 1);//加上索引位置
            }}>
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}
export default Pagination;