import { NavLink } from 'react-router';
import { useEffect, useRef } from 'react';
import { Collapse } from 'bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { createAsyncGetCart } from '../slices/cartSlice';
function Navbar() {
  const {isLoggedIn,isInBackend} = useSelector((state)=> state.auth);
  const carts = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch();
  const toggleRef = useRef(null);
  const bsCollapse = useRef(null);
  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);
  useEffect(() => {
    if (toggleRef.current) {
      bsCollapse.current = new Collapse(toggleRef.current, {
        toggle: false,
      });
    }
  }, []);
  const closeNavbar = () => {
    if (bsCollapse.current) {
      bsCollapse.current.hide();
    }
  };
  const navLinkClass = ({ isActive }) => {
    return isActive
      ? 'nav-link linkisActive position-relative px-3'
      : 'nav-link position-relative px-3';
  };
  const brandClass = ({ isActive }) => {
    return isActive ? 'navbar-brand linkisActive' : 'navbar-brand';
  };
  return (
    <>
      <nav className="navbar navbar-wood  navbar-expand-lg fixed-top shadow-sm">
        <div className="container-fluid">
          <NavLink className={brandClass} onClick={closeNavbar} to="/">
            <span className="brand-logo"></span>
            夠可愛毛小孩
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
            ref={toggleRef}
          >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  onClick={closeNavbar}
                  to="/products"
                >
                  尋找萌寵
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  onClick={closeNavbar}
                  to="/wishlist"
                >
                  收藏
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  onClick={closeNavbar}
                  to="/carts"
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                  {carts.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {carts.length > 99 ? '99+' : carts.length}
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item">
                {
                  !isLoggedIn ? (
                  <NavLink className={navLinkClass} onClick={closeNavbar} to="/login">
                    後台管理
                  </NavLink>
                  ) : (<NavLink className={navLinkClass} onClick={closeNavbar} to={isInBackend ? '/' : '/admin/adminProducts'}>
                    {isInBackend ? "回到前台" : "返回後台"}
                  </NavLink>)
                }
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
