import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { thousandsStamp } from '../../utils/thousandsStamp';
import Loading from '../../components/Loading';
import StepCircle from '../../components/StepCircle';
import useMessage from '../../hooks/useMessage';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAsyncDeleteAllCart,
  createAsyncDeleteSingleCart,
  createAsyncGetCart,
  createAsyncUpdateCart,
} from '../../slices/cartSlice';

function Carts() {
  const { carts, final_total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useMessage();
  useEffect(() => {
    const getCart = async () => {
      setIsLoading(true);
      await dispatch(createAsyncGetCart());
      setIsLoading(false);
    };
    getCart();
  }, [dispatch]);
  const handleCheckout = (e) => {
    e.preventDefault();
    if (!carts || carts.length === 0) {
      return;
    }
    navigate('/checkout');
  };
  const updateCart = async (cartId, product_id, qty = 1) => {
    if (qty < 1) {
      return;
    }
    setIsLoading(true);
    try {
      await dispatch(
        createAsyncUpdateCart({
          cartId,
          product_id,
          qty,
        }),
      ).unwrap();
      showSuccess('已更新成功');
    } catch {
      showError('更新失敗');
    } finally {
      setIsLoading(false);
    }
  };
  const deleteSingleCart = async (cartId) => {
    setIsLoading(true);
    try {
      await dispatch(createAsyncDeleteSingleCart(cartId)).unwrap();
      showSuccess('成功刪除');
    } catch {
      showError('刪除失敗');
    } finally {
      setIsLoading(false);
    }
  };
  const deleteAllCart = async () => {
    setIsLoading(true);
    try {
      await dispatch(createAsyncDeleteAllCart()).unwrap();
      showSuccess('成功刪除');
    } catch {
      showError('刪除失敗');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container py-5">
        <StepCircle currentStep={1} />
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
              <h2 className="fw-bold mb-0">購物車清單</h2>
              {carts?.length > 0 && (
                <button
                  onClick={deleteAllCart}
                  className="btn btn-outline-danger btn-sm rounded-0"
                >
                  清空購物車
                </button>
              )}
            </div>
          </div>
        </div>
        {carts && carts.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle mt-2">
              <thead className="table-light">
                <tr className="text-muted">
                  <th style={{ width: '80px' }}></th>
                  <th>商品資訊</th>
                  <th style={{ width: '150px' }} className="text-center">
                    數量
                  </th>
                  <th style={{ width: '120px' }} className="text-end">
                    小計
                  </th>
                </tr>
              </thead>
              <tbody>
                {carts.map((cart) => (
                  <tr key={cart.id} className="border-bottom">
                    <td className="ps-0">
                      <button
                        type="button"
                        onClick={() => deleteSingleCart(cart.id)}
                        className="btn btn-outline-danger"
                      >
                        刪除
                      </button>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={cart.product.imageUrl}
                          alt={cart.product.title}
                          className="rounded-0 object-fit-cover me-3"
                          style={{ width: '60px', height: '60px' }}
                        />
                        <div>
                          <h6 className="mb-0 fw-bold">{cart.product.title}</h6>
                          <small className="text-muted">
                            單價: {thousandsStamp(cart.product.price)}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-dark rounded-0"
                          onClick={() =>
                            updateCart(cart.id, cart.product.id, cart.qty - 1)
                          }
                          disabled={isLoading || cart.qty <= 1}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control text-center border-dark border-start-0 border-end-0"
                          value={cart.qty}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-dark rounded-0"
                          onClick={() =>
                            updateCart(cart.id, cart.product.id, cart.qty + 1)
                          }
                          disabled={isLoading}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-end text-dark fw-bold">
                      NT$ {thousandsStamp(cart.final_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-light p-4 mt-4 d-flex flex-column align-items-end">
              <div
                className="d-flex justify-content-between align-items-center w-100 mb-2"
                style={{ maxWidth: '300px' }}
              >
                <span className="flex-shrink-0">總計</span>
                <span className="fs-5 fw-bold text-end text-nowrap text-danger">
                  NT$ {thousandsStamp(final_total)}
                </span>
              </div>
              <div className="mt-auto mb-3 mt-2">
                <Link
                  to="/products"
                  className="btn btn-outline-secondary btn-lg rounded-0 px-5 mt-3 me-2"
                >
                  繼續購買
                </Link>
                <button
                  type="button"
                  className="btn btn-dark btn-lg rounded-0 px-5 mt-3"
                  onClick={handleCheckout}
                  disabled={!carts?.length}
                >
                  前往結帳
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 border border-dashed">
            <p className="text-muted mb-4">購物車目前是空的唷</p>
            <Link
              to="/products"
              className="btn btn-outline-dark rounded-0 px-4"
            >
              尋找萌寵
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Carts;
