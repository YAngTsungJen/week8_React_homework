import { useNavigate,Link} from "react-router";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import {thousandsStamp} from "../../utils/thousandsStamp";
import useMessage from '../../hooks/useMessage'
import { useDispatch, useSelector } from "react-redux";
import { createAsyncAddCart } from "../../slices/cartSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { createAsyncGetAllProducts, createAsyncGetProduct, setCurrentCategory } from "../../slices/productSlice";

function Products(){
    const carts = useSelector(state => state.cart.carts);
    const {products,pages,isPageLoading,categories,currentCategory} = useSelector(state => state.product);
    const dispatch = useDispatch();
    const [isLoading,setIsLoading] = useState({});

    const [wishList,setWithList] = useState(()=> {
        const initWithList = localStorage.getItem('wishList') ? JSON.parse(localStorage.getItem('wishList')) : {};
        return initWithList;
    })
    const toggleWishListItem = (product_id) => {
        const newWishList = {
            ...wishList,
            [product_id] : !wishList[product_id]
        }
        localStorage.setItem('wishList',JSON.stringify(newWishList));
        setWithList(newWishList);
    }
    const navigate = useNavigate();
    const {showError,showSuccess} = useMessage();

    useEffect(()=> {
        dispatch(createAsyncGetAllProducts());
    },[dispatch])
    useEffect(()=>{
        dispatch(createAsyncGetProduct({page :1,category:currentCategory}));
    },[dispatch,currentCategory]);
    const handlePageChange = (page) =>{
        dispatch(createAsyncGetProduct({page,category:currentCategory}));
    }
    const changeWebsite = (e,product) => {
        setIsLoading((pre) => ({
            ...pre,
            [product.id]: 'details'
        }));
        e.preventDefault();
        setTimeout(()=> {
            navigate(`/singleProduct/${product.id}`)
        setIsLoading((pre) => ({
            ...pre,
            [product.id]: null
        }));
        },500)
    }
    const AddCart = async(e,product_id,qty=1)=> {
        e.preventDefault();
        setIsLoading((pre) => ({
            ...pre,
            [product_id]: 'cart'
        }));
        try {
            await dispatch(createAsyncAddCart({product_id,currentQty:qty})).unwrap();
            showSuccess('已加入清單')
        } catch (error) {
            console.log(error.response.data)
            showError('購買失敗，請稍後再試')
        }finally{
            setIsLoading((pre) => ({
                ...pre,
                [product_id]: null
            }));
        }

    }

    return (<>
    <div className="container">
        <h1 className="mt-4 text-center">尋找萌寵</h1>
        <nav style={{"--bs-breadcrumb-divider": "'>'"}} aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to={'/'} className="text-decoration-none">首頁</Link>
                </li>
                <li className={`breadcrumb-item ${currentCategory === 'all' ? 'active' : ''}`}>
                    {currentCategory === 'all' ? (
                        "萌寵列表"
                    ) : (
                        <a href="#" className="text-decoration-none" onClick={(e) => { e.preventDefault(); dispatch(setCurrentCategory('all'))}}>
                            萌寵列表
                        </a>
                    )}
                </li>
                {currentCategory !== 'all' && (
                    <li className="breadcrumb-item active text-danger fw-bold" aria-current="page">
                        {currentCategory}
                    </li>
                )}
            </ol>
        </nav>
        <div className="row mt-4">
            <div className="col-lg-12 mb-4">
                <div className="category-sidebar">
                    <div className="d-flex overflow-auto pb-2 category-scroll-container">
                        {categories.map((category) => (
                            <button 
                                key={category}
                                type="button"
                                className={`btn category-pill-btn me-3 text-nowrap ${category === currentCategory ? "active" : ""}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(setCurrentCategory(category));
                                }}
                            >
                                <span className="ms-2">{category === 'all' ? '全部產品' : category}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="col-12 d-flex flex-column" style={{ minHeight: '60vh' }}>
                <div className="row">
                    {
                        isPageLoading ? (
                        <div className="col-12 text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2">正在尋找可愛的毛孩...</p>
                        </div>
                        ) : products.length > 0 ? (<>
                            {products.map(product => {
                                const cartItem = carts.find(item => item.product_id === product.id);
                                const cartQty = cartItem ? cartItem.qty : 0;
                                    return (
                                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={product.id}>
                                            <div className="card h-100 border-0 shadow-sm product-card">
                                                <div className="ratio ratio-4x3 overflow-hidden">
                                                    <img src={product.imageUrl} className="object-fit-cover h-100 w-100" alt={product.title}/>
                                                </div>
                                                {
                                                    <button type="button" className="btn wishlist-btn position-absolute top-0 start-0 m-3" 
                                                        onClick={(e) => {e.preventDefault();
                                                            toggleWishListItem(product.id);
                                                    }}>
                                                        
                                                        <FontAwesomeIcon className={wishList[product.id] ? "active" : ""} icon={faHeart} />
                                                    </button>
                                                }
                                                {cartQty > 0 && (
                                                    <span className="position-absolute top-0 end-0 badge bg-success m-2" style={{ zIndex: 1 }}>
                                                        已選購 {cartQty} 
                                                    </span>
                                                )}
                                                
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title mb-1">{product.title}
                                                        <span className="badge bg-primary ms-2">{product.category}</span>
                                                    </h5>
                                                    <div className="text-muted small mb-2" style={{minHeight:"72px"}}>
                                                        <div className="text-truncate">性格描述：{product.description}</div>
                                                        <div className="text-truncate">品種細節：{product.content}</div>
                                                    </div>
                                                    <div className="mt-auto d-flex align-items-baseline gap-2">
                                                        <span className="text-danger fw-bold fs-5">
                                                            NT$ {thousandsStamp(product.price)}
                                                        </span>
                                                        <div className="mb-0">
                                                            <del className="text-muted sx-small">{thousandsStamp(product.origin_price)}</del>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <button type="button" className="btn btn-outline-primary flex-fill" disabled={isLoading[product.id] === 'cart'} onClick={(e)=> changeWebsite(e,product)}>了解更多
                                                            {
                                                                isLoading[product.id] === 'details' && (<span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>)
                                                            }
                                                        </button>
                                                        <button className="btn btn-dark flex-fill" disabled={isLoading[product.id] === 'details'} onClick={(e)=> AddCart(e,product.id,1)}>立即購買
                                                            {
                                                                isLoading[product.id] === 'cart' && (<span className="spinner-border spinner-border-sm ms-2"></span>)
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                            <div className="col-12 d-flex justify-content-center mt-auto py-4">
                                <Pagination pages={pages} handlePageChange = {handlePageChange}/>
                            </div>
                        </>): 
                        (<div className="col-12 text-center py-5">
                            <p className="fs-4">目前暫時沒有毛孩在尋找新家喔</p>
                            <Link to="/" className="btn btn-outline-dark">回到首頁</Link>
                        </div>)
                    }
                </div>
            </div>
        </div>
    </div>
    </>)
}

export default Products;