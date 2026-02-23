import client from './client';

export const getCategories = () =>
    client.get('/categories').then((r) => r.data);

export const createCategory = (formData) =>
    client.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);

export const updateCategory = (id, formData) =>
    client.post(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);

export const deleteCategory = (id) =>
    client.delete(`/categories/${id}`).then((r) => r.data);
