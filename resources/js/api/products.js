import client from './client';

export const getProducts = (params = {}) =>
    client.get('/products', { params }).then((r) => r.data);

export const createProduct = (formData) =>
    client.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);

export const updateProduct = (id, formData) =>
    client.post(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);

export const deleteProduct = (id) =>
    client.delete(`/products/${id}`).then((r) => r.data);
