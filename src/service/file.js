import { adminApi, API_PATH } from "./api"

export const postFile = (formData) => {
    return adminApi.post(`/api/${API_PATH}/admin/upload`,formData);
}