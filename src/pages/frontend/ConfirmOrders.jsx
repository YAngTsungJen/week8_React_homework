import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import StepCircle from '../../components/StepCircle';
import { thousandsStamp } from '../../utils/thousandsStamp';
import useMessage from '../../hooks/useMessage';
import { getOrder, payMoney } from '../../service/orderApi';
import { clearCart } from '../../slices/cartSlice';
import { useDispatch } from 'react-redux';

function Orders() {
  const { orderId } = useParams();
  const { showError, showSuccess } = useMessage();
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [touch, setTouch] = useState(false);
  const dispatch = useDispatch();
  const PAYMENT_METHODS = {
    credit_card: '信用卡',
    line_pay: 'LINE Pay',
    transfer: '銀行轉帳',
  };

  const handlePay = async () => {
    setTouch(true);
    if (!paymentMethod) {
      showError('請選擇一種付款方式');
      return;
    }
    setIsLoading(true);
    try {
      const res = await payMoney(orderId);
      if (res.data.success) {
        setIsPaid(true);
        localStorage.setItem(`payment_${orderId}`, paymentMethod);
        showSuccess('已付款成功');
        dispatch(clearCart());
      }
    } catch {
      showError('付款失敗');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        const res = await getOrder(orderId);
        if (isMounted) {
          setOrderData(res.data.order);
          const paidStatus = res.data.order.is_paid;
          setIsPaid(paidStatus);
          if (paidStatus) {
            const savedMethod = localStorage.getItem(`payment_${orderId}`);
            if (savedMethod) {
              setPaymentMethod(savedMethod);
            }
          }
        }
      } catch {
        if (isMounted) {
          showError('無法取得訂單資訊');
        }
      }
    };
    if (orderId) {
      fetchOrder();
    }
    return () => {
      isMounted = false;
    };
  }, [orderId, showError]);
  if (!orderData) return <p>載入中...</p>;
  return (
    <>
      <div className="container py-5">
        <StepCircle currentStep={3} />
        <div className="main-content">
          <div className="left-column">
            <div className="pay-card">
              <h3 className="sub">訂單資訊</h3>
              <div className="info-row">
                <span>訂購時間：</span>
                <span>
                  {new Date(orderData.create_at * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="info-row">
                <span>訂單編號：</span>
                <span>{orderData.id}</span>
              </div>
              <div className="info-row">
                <span>付款狀態：</span>
                <span
                  className={isPaid ? 'text-success fw-bold' : 'text-danger'}
                >
                  {isPaid
                    ? `${PAYMENT_METHODS[paymentMethod] || '線上'}已付款`
                    : '未付款'}
                </span>
              </div>
            </div>
            <div className="pay-card">
              <h3 className="sub">購買人資料</h3>
              <div className="info-row">
                <span>姓名：</span>
                <span>{orderData.user.name}</span>
              </div>
              <div className="info-row">
                <span>地址：</span>
                <span>{orderData.user.address}</span>
              </div>
              <div className="info-row">
                <span>電話：</span>
                <span>{orderData.user.tel}</span>
              </div>
              <div className="info-row">
                <span>Email：</span>
                <span>{orderData.user.email}</span>
              </div>
              <div className="info-row">
                <span>留言：</span>
                <span>{orderData.message || '無'}</span>
              </div>
            </div>
            {!isPaid && (
              <div className="pay-card">
                <h3 className="sub">
                  選擇付款方式 <span className="text-danger small">*必填</span>
                </h3>
                <div className="payment-options d-flex flex-column gap-2 mt-3">
                  {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                    <label
                      key={key}
                      className={`payment-label p-3 border rounded d-flex align-items-center cursor-pointer ${paymentMethod === key ? 'border-primary bg-light shadow-sm' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={key}
                        className="me-2"
                        checked={paymentMethod === key}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />{' '}
                      {value}
                    </label>
                  ))}
                  {touch && !paymentMethod && (
                    <div className="text-danger small mt-1 ps-1">
                      請務必選擇付款方式
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="d-grid gap-2">
              {!isPaid ? (
                <button
                  className="pay-btn btn-primary"
                  onClick={handlePay}
                  disabled={isLoading}
                >
                  {isLoading ? '處理中...' : '馬上付款'}
                </button>
              ) : (
                <button
                  className="pay-btn btn-success"
                  onClick={() => navigate('/completeOrders')}
                >
                  付款完成，前往下一頁
                </button>
              )}
            </div>
          </div>
          <div className="right-column">
            <div className="pay-card detail-card">
              <h3 className="sub">訂單明細</h3>
              {Object.values(orderData.products).map((order) => {
                return (
                  <div className="product-item" key={order.id}>
                    <img
                      src={order.product.imageUrl}
                      style={{
                        width: '80px',
                        height: '60px',
                        objectFit: 'cover',
                      }}
                      className="rounded me-3"
                      alt={order.product.title}
                    />
                    <div className="flex-grow-1 text-start">
                      <div className="fw-bold small">{order.product.title}</div>
                      <div className="text-muted extra-small">
                        {order.qty} {order.product.unit} 毛小孩
                      </div>
                    </div>
                    <div className="fw-bold">
                      ${thousandsStamp(order.total)}
                    </div>
                  </div>
                );
              })}
              <div className="total-section">
                總金額：<strong>NT$ {thousandsStamp(orderData.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Orders;
