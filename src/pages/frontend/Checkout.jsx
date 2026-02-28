import { useForm } from "react-hook-form"
import { Link,useNavigate} from "react-router";
import 'swiper/css';
import StepCircle from "../../components/StepCircle";
import { useEffect} from "react";
import {emailValidition} from '../../utils/validition';
import {thousandsStamp} from "../../utils/thousandsStamp";
import useMessage from '../../hooks/useMessage'
import { useDispatch, useSelector } from "react-redux";
import { createAsyncGetCart } from "../../slices/cartSlice";
import { postOrder } from "../../service/order";
function Checkout (){
    const {carts,final_total} = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {showError,showSuccess} = useMessage();
    const {
        register,
        handleSubmit,
        formState: {errors,isValid},
        reset
    } = useForm({
        mode: "onChange"
    })
    const onSubmit = async(formData) => {
        if(carts.length === 0){
            showError("購物車內無商品");
            return;
        }
        try {
            const data = {
                user: formData,
                message: formData.message
            }
            const res = await postOrder(data);
            const orderId = res.data.orderId;
            showSuccess('預約成功')
            reset();
            navigate(`/confirmorders/${orderId}`);
        } catch (error) {
            showError(error.response?.data?.message)
        }
    }
    useEffect(()=> {
        dispatch(createAsyncGetCart())
    },[dispatch])
    return (<>
    <div className="container py-5">
        <StepCircle currentStep= {2}/>
        <div className="row g-5">
            <div className="col-md-7 text-start">
                <h4 className="border-start border-success border-4 ps-2 mb-4 fw-bold text-success">訂購人資訊</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="請輸入 Email"
                        {
                            ...register('email',emailValidition)
                        }
                    />
                        {errors.email && (
                            <p className="text-danger">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        收件人姓名 <span className="text-danger">*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="請輸入姓名"
                        {
                            ...register('name',{
                                required: '請輸入收件人姓名',
                                minLength: {
                                    value: 2,
                                    message: '姓名至少 2 個字'
                                }
                            })
                        }
                    />
                    {
                        errors.name && (<p className="text-danger">{errors.name.message}</p>)
                    }
                    </div>
                    <div className="mb-3">
                    <label htmlFor="tel" className="form-label">
                        收件人電話 <span className="text-danger">*</span>
                    </label>
                    <input
                        id="tel"
                        name="tel"
                        type="tel"
                        className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
                        placeholder="請輸入電話"
                        {
                            ...register('tel',{
                                required: '請輸入收件人電話',
                                minLength: {
                                    value: 2,
                                    message: '電話至少 8 碼'
                                },
                                pattern: {
                                    value:/^(0\d{1,2}-?(\d{6,8})|09\d{8})$/,
                                    message: "請輸入正確的電話或手機格式"
                                }
                            })
                        }
                    />
                    {
                        errors.tel && (<p className="text-danger">{errors.tel.message}</p>)
                    }
                    </div>

                    <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        收件人地址 <span className="text-danger">*</span>
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        className= {`form-control ${errors.address ? 'is-invalid' : ''}`}
                        placeholder="請輸入地址"
                        {
                            ...register('address',{
                                required: '請輸入收件人地址',
                            })
                        }
                    />
                    {
                        errors.address && (<p className="text-danger">{errors.address.message}</p>)
                    }
                    </div>

                    <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                        留言
                    </label>
                    <textarea
                        id="message"
                        className="form-control"
                        cols="30"
                        rows="10"
                        {...register('message')}
                    ></textarea>
                    </div>
                    <div className="text-end">
                        <Link to="/carts" className="btn btn-dark me-2">返回購物車</Link>
                        <button type="submit" className="btn btn-danger" disabled={!isValid}>
                            下一步
                        </button>
                    </div>
                </form>
            </div>
            <div className="col-md-5">
                <div className="card border-0 shadow-sm p-4 bg-white sticky-top" style={{ top: '100px' }}>
                    <h4 className="fw-bold text-success mb-4 text-center">訂單明細</h4>
                    {
                        carts.map((cart)=> {
                            return (
                            <div className="d-flex mb-3 align-items-center" key={cart.id}>
                                <img 
                                    src={cart.product.imageUrl} 
                                    style={{ width: '80px', height: '60px', objectFit: 'cover' }} 
                                    className="rounded me-3" 
                                    alt={cart.product.title}
                                />
                                <div className="flex-grow-1 text-start">
                                    <div className="fw-bold small">{cart.product.title}</div>
                                    <div className="text-muted extra-small">{cart.qty}{cart.product.unit}毛小孩</div>
                                </div>
                                <div className="fw-bold">${thousandsStamp(cart.product.price)}</div>
                            </div>
                            )
                        })
                    }
                    <div className="d-flex justify-content-between h5 fw-bold text-success mt-3 border-top pt-3">
                        <span>預購總金額</span>
                        <span>NT ${thousandsStamp(final_total)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>)
}
export default Checkout;