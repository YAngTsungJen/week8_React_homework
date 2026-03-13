import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAllProductApi } from '../../service/productApi';
import { thousandsStamp } from '../../utils/thousandsStamp';
import useMessage from '../../hooks/useMessage';
import { useDispatch, useSelector } from 'react-redux';
import { createAsyncAddCart } from '../../slices/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function Wishlist() {
  const { showError, showSuccess } = useMessage();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const carts = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch();
  const [loadingStates, setLoadingStates] = useState({});

  const [wishList, setWithList] = useState(() => {
    const initWithList = localStorage.getItem('wishList')
      ? JSON.parse(localStorage.getItem('wishList'))
      : {};
    return initWithList;
  });
  const toggleWishListItem = (product_id) => {
    const newWishList = {
      ...wishList,
      [product_id]: !wishList[product_id],
    };
    localStorage.setItem('wishList', JSON.stringify(newWishList));
    setWithList(newWishList);
    if (!newWishList[product_id]) {
      setProducts(products.filter((p) => p.id !== product_id));
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishListObj = JSON.parse(
          localStorage.getItem('wishList') || '{}',
        );
        const wishIds = Object.keys(wishListObj).filter(
          (id) => wishListObj[id],
        );

        if (wishIds.length > 0) {
          const res = await getAllProductApi();
          const filteredProducts = res.data.products.filter((product) =>
            wishIds.includes(product.id.toString()),
          );
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('獲取收藏失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);
  const changeWebsite = (e, product) => {
    setLoadingStates((pre) => ({
      ...pre,
      [product.id]: 'details',
    }));
    e.preventDefault();
    setTimeout(() => {
      navigate(`/singleProduct/${product.id}`);
      setLoadingStates((pre) => ({
        ...pre,
        [product.id]: null,
      }));
    }, 500);
  };
  const AddCart = async (e, product_id, qty = 1) => {
    e.preventDefault();
    setLoadingStates((pre) => ({
      ...pre,
      [product_id]: 'cart',
    }));
    try {
      await dispatch(
        createAsyncAddCart({ product_id, currentQty: qty }),
      ).unwrap();
      showSuccess('已加入清單');
    } catch {
      showError('購買失敗，請稍後再試');
    } finally {
      setLoadingStates((pre) => ({
        ...pre,
        [product_id]: null,
      }));
    }
  };

  if (isLoading) {
    return <div className="container py-5 text-center">載入中...</div>;
  }

  return (
    <div className="container py-5">
      <h1>我的收藏</h1>
      {products.length === 0 ? (
        <p>還沒有收藏任何產品。</p>
      ) : (
        <div className="row">
          {products.map((product) => {
            const cartItem = carts.find(
              (item) => item.product_id === product.id,
            );
            const cartQty = cartItem ? cartItem.qty : 0;
            return (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={product.id}>
                <div className="card h-100 border-0 shadow-sm product-card">
                  <div className="ratio ratio-4x3 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      className="object-fit-cover h-100 w-100"
                      alt={product.title}
                    />
                  </div>
                  {
                    <button
                      type="button"
                      className="btn wishlist-btn position-absolute top-0 start-0 m-3"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishListItem(product.id);
                      }}
                    >
                      <FontAwesomeIcon
                        className={wishList[product.id] ? 'active' : ''}
                        icon={faHeart}
                      />
                    </button>
                  }
                  {cartQty > 0 && (
                    <span
                      className="position-absolute top-0 end-0 badge bg-success m-2"
                      style={{ zIndex: 1 }}
                    >
                      已選購 {cartQty}
                    </span>
                  )}

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1">
                      {product.title}
                      <span className="badge bg-primary ms-2">
                        {product.category}
                      </span>
                    </h5>
                    <div
                      className="text-muted small mb-2"
                      style={{ minHeight: '72px' }}
                    >
                      <div className="text-truncate">
                        性格描述：{product.description}
                      </div>
                      <div className="text-truncate">
                        品種細節：{product.content}
                      </div>
                    </div>
                    <div className="mt-auto d-flex align-items-baseline gap-2">
                      <span className="text-danger fw-bold fs-5">
                        NT$ {thousandsStamp(product.price)}
                      </span>
                      <div className="mb-0">
                        <del className="text-muted sx-small">
                          {thousandsStamp(product.origin_price)}
                        </del>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary flex-fill"
                        disabled={loadingStates[product.id] === 'cart'}
                        onClick={(e) => changeWebsite(e, product)}
                      >
                        了解更多
                        {loadingStates[product.id] === 'details' && (
                          <span
                            className="spinner-border spinner-border-sm ms-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                      </button>
                      <button
                        className="btn btn-dark flex-fill"
                        disabled={loadingStates[product.id] === 'details'}
                        onClick={(e) => AddCart(e, product.id, 1)}
                      >
                        立即購買
                        {loadingStates[product.id] === 'cart' && (
                          <span className="spinner-border spinner-border-sm ms-2"></span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
