import { adminApi, api, API_PATH } from "./api"

export const payMoney = (orderId) => {
    return api.post(`/api/${API_PATH}/pay/${orderId}`);
}

export const getOrder = (orderId) => {
    return api.get(`/api/${API_PATH}/order/${orderId}`);
}

export const postOrder = (data) => {
    return api.post(`/api/${API_PATH}/order`,{data});
}

export const getAdminOrdersApi = (page) => {
    return adminApi.get(`/api/${API_PATH}/admin/orders?page=${page}`);
}

export const updateAdminOrderApi = (id,data) => {
    return adminApi.put(`/api/${API_PATH}/admin/order/${id}`,{data});
}

export const deleteAdminOrderApi = (id) => {
    return adminApi.delete(`/api/${API_PATH}/admin/order/${id}`);
}

export const deleteAdminOrdersAllApi = () => {
    return adminApi.delete(`/api/${API_PATH}/admin/orders/all`);
}