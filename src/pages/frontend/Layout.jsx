import { Outlet } from 'react-router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="content-area" style={{ paddingTop: '65px' }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
export default Layout;
