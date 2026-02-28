function Pagination({pages,handlePageChange}){
    return (<>
        <nav>
            <ul className="pagination">
                <li className={`page-item ${!pages.has_pre ? 'disabled':''}`}>
                    <button onClick={() => handlePageChange(pages.current_page-1)} className="page-link" type="button">
                        上一頁
                    </button>
                </li>
                {
                Array.from({length: pages.total_pages}).map((_,index)=>{
                    const pageNumber = index+ 1
                    return (
                    <li key={pageNumber} className={`page-item ${pages.current_page === pageNumber ? 'active': ''}`}>
                        <button onClick={() => handlePageChange(pageNumber)} className="page-link" type="button">
                        {pageNumber}
                        </button>
                    </li>
                    )
                })
                }
                <li className={`page-item ${!pages.has_next ? 'disabled': ''}`}>
                    <button onClick={() => handlePageChange(pages.current_page+1)} className="page-link" type="button">
                        下一頁
                    </button>
                </li>
            </ul>
        </nav>
    </>)
}

export default Pagination;