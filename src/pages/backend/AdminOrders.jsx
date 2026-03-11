import { useEffect, useState, useRef } from 'react';
import { Modal } from 'bootstrap';
import Pagination from '../../components/Pagination';
import { thousandsStamp } from '../../utils/thousandsStamp';
import useMessage from '../../hooks/useMessage';
import {
  getAdminOrdersApi,
  updateAdminOrderApi,
  deleteAdminOrderApi,
  deleteAdminOrdersAllApi,
} from '../../service/orderApi';
import { Link } from 'react-router';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pages, setPages] = useState({});
  const [tempOrder, setTempOrder] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(false);

  const orderModalRef = useRef(null);
  const modalInstance = useRef(null);
  const { showError, showSuccess } = useMessage();
  useEffect(() => {
    modalInstance.current = new Modal(orderModalRef.current);

    const modalElement = orderModalRef.current;
    const handleHide = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    modalElement.addEventListener('hide.bs.modal', handleHide);
    return () => {
      modalElement.removeEventListener('hide.bs.modal', handleHide);
    };
  }, []);

  const getOrders = async (page = 1) => {
    setIsPageLoading(true);
    try {
      const res = await getAdminOrdersApi(page);
      setOrders(res.data.orders);
      setPages(res.data.pagination);
    } catch {
      showError('讀取訂單失敗');
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  const handlePageChange = (page) => {
    getOrders(page);
  };
  const openModal = (order) => {
    setTempOrder(order);
    modalInstance.current.show();
  };

  const closeModal = () => {
    modalInstance.current.hide();
  };

  const deleteAllOrders = async () => {
    if (!window.confirm('確定要刪除『全部』訂單嗎？此動作無法復原！')) return;
    try {
      await deleteAdminOrdersAllApi();
      showSuccess('已清除所有訂單');
      getOrders(1);
    } catch {
      showError('清除失敗');
    }
  };

  const updatePaymentStatus = async (order) => {
    try {
      await updateAdminOrderApi(order.id, {
        ...order,
        is_paid: !order.is_paid,
      });
      showSuccess('付款狀態已更新');
      getOrders(pages.current_page);
    } catch {
      showError('更新失敗');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('確定要刪除此訂單嗎？')) return;
    try {
      await deleteAdminOrderApi(id);
      showSuccess('訂單已刪除');
      getOrders(pages.current_page);
    } catch {
      showError('刪除失敗');
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col">
          <div
            className="sticky-top bg-white py-3"
            style={{ top: '65px', zIndex: 1020 }}
          >
            <h2 className="mb-4">訂單管理</h2>
            <div className="text-end mt-3">
              <button
                className="btn btn-outline-danger"
                onClick={deleteAllOrders}
                disabled={orders.length === 0}
              >
                清除所有訂單
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>下單時間</th>
                  <th>訂單編號</th>
                  <th>聯絡信箱</th>
                  <th>訂單金額</th>
                  <th>付款狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {isPageLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="spinner-border"></div>
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        {new Date(order.create_at * 1000).toLocaleDateString()}
                      </td>
                      <td className="small text-muted">{order.id}</td>
                      <td>{order.user.email}</td>
                      <td>NT$ {thousandsStamp(order.total)}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={order.is_paid}
                            onChange={() => updatePaymentStatus(order)}
                          />
                          <span
                            className={
                              order.is_paid ? 'text-success' : 'text-danger'
                            }
                          >
                            {order.is_paid ? '已付款' : '未付款'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-dark"
                            onClick={() => openModal(order)}
                          >
                            查看
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => deleteOrder(order.id)}
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-0">
                      <div className="text-center py-5 border border-dashed">
                        <p className="text-muted mb-4">目前沒有訂單唷</p>
                        <Link
                          to="/admin/adminProducts"
                          className="btn btn-outline-dark rounded-0 px-4"
                        >
                          回到產品列表
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {orders.length > 0 && (
        <div className="d-flex justify-content-center">
          <Pagination pages={pages} handlePageChange={handlePageChange} />
        </div>
      )}

      <div className="modal fade" ref={orderModalRef} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">訂單詳情 - {tempOrder.id}</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4">
                  <h6>用戶資料</h6>
                  <p className="mb-1">姓名：{tempOrder.user?.name}</p>
                  <p className="mb-1">電話：{tempOrder.user?.tel}</p>
                  <p className="mb-1">地址：{tempOrder.user?.address}</p>
                </div>
                <div className="col-md-8">
                  <h6>選購商品</h6>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>品名</th>
                        <th>數量</th>
                        <th className="text-end">金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tempOrder.products &&
                        Object.values(tempOrder.products).map((item) => (
                          <tr key={item.id}>
                            <td>{item.product.title}</td>
                            <td>
                              {item.qty} / {item.product.unit}
                            </td>
                            <td className="text-end">
                              {thousandsStamp(item.final_total)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="text-end fw-bold">
                    總計：NT$ {thousandsStamp(tempOrder.total)}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
