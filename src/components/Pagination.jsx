function Pagination({pages,handlePageChange}){
    return (<>
        <nav>
            <ul className="pagination">
                <li className={`page-item ${!pages.has_pre ? 'disabled':''}`}>
                    <a onClick={(e)=> {
                        e.preventDefault();
                        handlePageChange(pages.current_page-1)}}
                        className="page-link" href="#">
                        上一頁
                    </a>
                </li>
                {
                Array.from({length: pages.total_pages}).map((_,index)=>{
                    const pageNumber = index+ 1
                    return (
                    <li key={pageNumber} className={`page-item ${pages.current_page === pageNumber ? 'active': ''}`}>
                        <a onClick={(e)=> {
                            e.preventDefault();
                            handlePageChange(pageNumber)}} className="page-link" href="#">
                        {pageNumber}
                        </a>
                    </li>
                    )
                })
                }
                <li className={`page-item ${!pages.has_next ? 'disabled': ''}`}>
                    <a onClick={(e)=> {
                        e.preventDefault();
                        handlePageChange(pages.current_page+1)}} className="page-link" href="#">
                        下一頁
                    </a>
                </li>
            </ul>
        </nav>
    </>)
}

export default Pagination;