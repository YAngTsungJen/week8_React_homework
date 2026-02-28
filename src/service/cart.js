import { api, API_PATH } from "./api"

export const getCartApi = () => {
    return api.get(`/api/${API_PATH}/cart`);
}

export const postCartApi = (data) => {
    return api.post(`/api/${API_PATH}/cart`,{data});
}

export const updateCartApi = (cartId,data) => {
    return api.put(`/api/${API_PATH}/cart/${cartId}`,{data});
}

export const deleteSingleCartApi = (cartId) => {
    return api.delete(`/api/${API_PATH}/cart/${cartId}`);
}

export const deleteAllCartApi = () => {
    return api.delete(`/api/${API_PATH}/carts`)
}