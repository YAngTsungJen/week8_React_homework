import { Outlet } from "react-router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
function Layout(){
    return(<>
    <Navbar/>
    <div className="content-area" style={{ paddingTop: '65px' }}>
        <Outlet />
    </div>
    <Footer/>
    </>)
}
export default Layout;
