import { Link } from 'react-router';
import StepCircle from '../../components/StepCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
function Orders() {
  return (
    <>
      <div className="container py-5">
        <StepCircle currentStep={4} />
        <div className="success-card text-center">
          <div className="success-icon">
            <FontAwesomeIcon icon={faCheck} />
          </div>

          <h1 className="h1">付款完成</h1>

          <p className="order-number">
            您的訂單編號：<strong>-Om8q5u08EYOu4eavlX8</strong>
          </p>

          <p className="thank-you-msg">
            感謝您的支持，後續會盡快連絡您，為您實現暢遊您所購買的景點～
          </p>

          <div className="complete-button-group">
            <Link className="btn btn-secondary complete-btn" to="/products">
              繼續選購
            </Link>
            <Link className="btn btn-primary complete-btn" to="/">
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Orders;
