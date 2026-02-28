function Pagination({pages,handlePageChange}){
    return (<>
        <nav>
            <ul className="pagination">
                <li className={`page-item ${!pages.has_pre && 'disabled'}`}>
                    <a onClick={(e)=> {
                        e.preventDefault();
                        handlePageChange(pages.current_page-1)}}
                        className="page-link" href="#">
                        上一頁
                    </a>
                </li>
                {
                Array.from({length: pages.total_pages}).map((_,index)=>{
                    return (
                    <li key={index} className={`page-item ${pages.current_page === index+1 && 'active'}`}>
                        <a onClick={(e)=> {
                            e.preventDefault();
                            handlePageChange(index+1)}} className="page-link" href="#">
                        {index+1}
                        </a>
                    </li>
                    )
                })
                }
                <li className={`page-item ${!pages.has_next && 'disabled'}`}>
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