import { Link } from "react-router";
function Footer(){
    return(<>
        <footer className="bg-dark text-white py-5">
            <div className="container">
                <div className="row gy-4">
                    <div className="col-md-4 text-start">
                        <h3 className="fw-bold mb-3" style={{ letterSpacing: '2px' }}>夠可愛毛小孩</h3>
                        <p className="opacity-75 lh-lg">
                            為忙碌的生活點綴純粹的愛，<br />
                            讓毛孩成為家中最溫暖的陪伴，構築你理想中的幸福風景。
                        </p>
                    </div>
                    <div className="col-md-4 text-start text-md-center">
                        <h5 className="fw-bold mb-3">探索毛孩世界</h5>
                        <ul className="list-unstyled opacity-75">
                            <li className="mb-2"><Link to="/products" className="text-decoration-none text-white">所有萌寵</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4 text-start text-md-end">
                        <h5 className="fw-bold mb-3">聯絡萌寵管家</h5>
                        <p className="opacity-75 mb-1">客服專線:02-1234-5678</p>
                        <p className="opacity-75 mb-1">服務時間:Mon - Fri 09:00 - 18:00</p>
                        <p className="opacity-75">信箱:service@socute-pets.com</p>
                    </div>
                </div>
                <hr className="my-2 opacity-25" />
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center opacity-50 small">
                    <p className="mb-0">© 2026 夠可愛毛小孩 So Cute Pets. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </>)
}
export default Footer;