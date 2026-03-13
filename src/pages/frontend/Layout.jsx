import { Outlet, useLocation } from 'react-router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setIsInBackend } from '../../slices/authSlice';
function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
useEffect(() => {
    // 只要是在這個佈局下，都視為不在後台
    dispatch(setIsInBackend(false));
  }, [dispatch, location.pathname]);
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
