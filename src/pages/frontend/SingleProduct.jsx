import { useCallback, useEffect,useState } from "react";
import { useParams ,useNavigate,Link} from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping,faMinus,faPlus,faPaw } from '@fortawesome/free-solid-svg-icons';
import { ThreeCircles } from "react-loader-spinner";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import {thousandsStamp} from "../../utils/thousandsStamp";
import useMessage from '../../hooks/useMessage'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from "react-redux";
import { createAsyncAddCart, createAsyncGetCart } from "../../slices/cartSlice";
import { getSingleProductApi } from "../../service/product";
function SingleProduct(){

    const [product,setProduct] = useState({
        imagesUrl: []
    });
    const params = useParams();
    const [isLoading,setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const navigate = useNavigate();
    const carts = useSelector(state => state.cart.carts);
    const {showError,showSuccess} = useMessage();
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const {id} = params;
    const currentCartItem = carts.find(item => item.product.id === id);
    const cartsQty = currentCartItem ? currentCartItem.qty : 0;

    const getSingleProduct = useCallback(async()=> {
        setIsPageLoading(true);
        try {
            const res = await getSingleProductApi(id);
            setProduct(res.data.product);
            setMainImage(res.data.product.imageUrl);
        } catch (error) {
            console.log(error);
        }finally {
            setIsPageLoading(false);
        }
    },[id])
    useEffect(()=> {
        dispatch(createAsyncGetCart());
        getSingleProduct();
    },[dispatch,getSingleProduct]);
    
    const handleChangeQty = (type) => {
        setQty((i)=> {
            if(type === 'plus'){
                return i < 10 ?  i+1 : 10;
            }else{
                return i >1 ? i -1 : 1;
            }
        })
    }
    const changeToProducts = (e) => {
        e.preventDefault();
        setTimeout(()=> {
            navigate('/products')
        },500)
    }
    const addCart = async(e,product_id,currentQty)=> {
        e.preventDefault();
        setIsLoading(true);
        try {
            await dispatch(createAsyncAddCart({product_id,currentQty})).unwrap();
            showSuccess('已加入清單');
        } catch (error) {
            console.log(error.response.data)
            showError('購買失敗，請稍後再試')
        }finally{
            setIsLoading(false);
        }

    }
    if (isPageLoading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <ThreeCircles height="80" width="80" color="#6c757d" ariaLabel="loading" />
                <p className="mt-3 text-muted">正在把毛孩帶到你面前...</p>
            </div>
            );
        }

    if(!product || !product.id){
        return (
            <div className="container py-5 text-center">
                <h3>哎呀！這隻毛孩好像跑去玩耍了。</h3>
                <Link to="/products" className="btn btn-primary mt-3">回到清單</Link>
            </div>
        );
    }
        return (<>
            <div className="container py-5">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">首頁</Link></li>
                        <li className="breadcrumb-item"><Link to="/products">尋找萌寵</Link></li>
                        <li className="breadcrumb-item active"> {product.title}</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md-7 mb-4">
                        <div className="rounded-0 overflow-hidden shadow-sm" style={{ height: '500px' }}>
                            {mainImage && (
                                <img src={mainImage} className="w-100 h-100 object-fit-cover" alt={product.title} />
                            )}
                        </div>
                        <div className="mt-2">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={10}
                                slidesPerView={5}
                                pagination = {{clickable: true}}
                                loop = {true}
                                autoplay = {{
                                    delay: 3000,
                                }}
                                breakpoints={{
                                    768: { slidesPerView: 4 },
                                    576: { slidesPerView: 3 },
                                    0: { slidesPerView: 2 }
                                }}
                            >
                                {
                                    [product.imageUrl,...(product.imagesUrl || [])].map((url) => {
                                        return(
                                        <SwiperSlide key={url}>
                                            <div onClick={() => setMainImage(url)} className="overflow-hidden" style={{ height: '120px' }} key={url}>
                                                <img src={url} className="w-100 h-100 object-fit-cover"/>
                                            </div>
                                        </SwiperSlide>
                                    )})
                                }
                            </Swiper>
                        </div>
                    </div>
                    <div className="col-md-5 text-start">
                        <div className="ps-md-4">
                            <span className="badge bg-secondary mb-2">{product.category}</span>
                            <h1 className="display-6 fw-bold mb-3">{product.title}</h1>
                            <div className="mb-4">
                                <h5 className="fw-bold"><FontAwesomeIcon icon={faPaw} className="me-2" />萌寵性格</h5>
                                <p className="text-muted lh-lg">{product.description}</p>
                            </div>
                            <div className="mb-4">
                                <h5 className="fw-bold"><FontAwesomeIcon icon={faPaw} className="me-2" />品種資訊</h5>
                                <p className="text-muted">{product.content}</p>
                            </div>
                            <hr />
                            <div className="d-flex align-items-baseline mb-4">
                                <h3 className="text-danger fw-bold me-2">NT$ {thousandsStamp(product.price)}</h3>
                                <del className="text-muted small">NT$ {thousandsStamp(product.origin_price)}</del>
                            </div>
                            {cartsQty > 0 && (<div className="mb-3 text-success fw-bold"> <FontAwesomeIcon icon={faCartShopping} />清單內已有 {cartsQty} 筆</div>
        )}        
                            <div className="d-flex align-items-center mb-4">
                                <label style={{ width: "120px" }} className="fw-bold">購買數量：</label>
                                <div className="input-group"  style={{ width: "160px" }}>
                                    <button
                                        className="btn btn-outline-dark rounded-0"
                                        type="button"
                                        aria-label="Decrease quantity"
                                        onClick={()=> handleChangeQty('minus')}
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <input
                                        className="form-control text-center border-dark"
                                        type="number"
                                        min="1"
                                        max="10"
                                        readOnly
                                        value={qty}
                                    />
                                    <button
                                        className="btn btn-outline-dark rounded-0"
                                        type="button"
                                        aria-label="Decrease quantity"
                                        onClick={()=>handleChangeQty('plus')}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>
                            <div className="d-grid gap-2">
                                <button className="btn btn-dark btn-lg rounded-0 py-3 d-flex justify-content-center align-items-center" disabled={isLoading} onClick={(e)=> addCart(e,product.id,qty)}>
                                    {
                                    isLoading ? (
                                    <ThreeCircles wrapperStyle={{}} wrapperClass="" height="34" width="34" ariaLabel="three-circles-loading" color="#fff"/>): ('立即加入清單')
                                    }
                                </button>
                                <button className="btn btn-outline-secondary btn-lg rounded-0 py-3" onClick={(e)=> changeToProducts(e)}>返回列表</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}

export default SingleProduct;