import {adminApi, api,API_PATH} from './api';

// 前台
export const getProductApi = (page = 1,category) => {
    const params = {page};
    if(category &category !== 'all'){
        params.category = category;
    }
    return api.get(`/api/${API_PATH}/products`,{params});
}

export const getAllProductApi = () => {
    return api.get(`/api/${API_PATH}/products/all`)
}

export const getSingleProductApi = (id) => {
    return api.get(`/api/${API_PATH}/product/${id}`);
}


//後台
export const getAdminProductApi = (page = 1) => {
    return adminApi.get(`/api/${API_PATH}/admin/products?page=${page}`)
}

export const deleteAdminProductApi = (id) => {
    return adminApi.delete(`/api/${API_PATH}/admin/product/${id}`)
}

export const saveAdminProductApi = (modalType,tempProduct) => {
        const productData = {
            data: {
                ...tempProduct,
                origin_price: Number(tempProduct.origin_price),
                price: Number(tempProduct.price),
                is_enabled: tempProduct.is_enabled ? 1 : 0,
                imagesUrl:tempProduct.imagesUrl.map(img => img.url).filter(url =>  url.trim() !== '')
            }
        }
    if(modalType === 'edit'){
        return adminApi.put(`/api/${API_PATH}/admin/product/${tempProduct.id}`,productData);
    }
    return adminApi.post(`/api/${API_PATH}/admin/product/${tempProduct.id}`,productData);
        
}