import { publicInstance } from "themes/utils/api.config";

export const fetchStore = () => publicInstance.get('/v1/stores');
export const fetchProducts = (payload) => publicInstance.get('/v1/stores/products', {params: payload});
export const fetchProduct = ({ id }) => publicInstance.get(`/v1/stores/products/${id}`);
export const fetchFilters = () => publicInstance.get('/v1/stores/filters');