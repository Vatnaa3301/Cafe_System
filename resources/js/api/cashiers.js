import client from './client';

/** Fetch active cashiers (for cashier-select popup) */
export const getCashiers = () =>
    client.get('/cashiers').then((r) => r.data);

/** Fetch ALL cashiers including inactive (admin use) */
export const getAllCashiers = () =>
    client.get('/cashiers/all').then((r) => r.data);

export const createCashier = (data) =>
    client.post('/cashiers', data).then((r) => r.data);

export const updateCashier = (id, data) =>
    client.put(`/cashiers/${id}`, data).then((r) => r.data);

export const deleteCashier = (id) =>
    client.delete(`/cashiers/${id}`).then((r) => r.data);
