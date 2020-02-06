import Axios from "axios";

export default class BaseAPI {
    
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    async getAll() {
        return await Axios.get(this.endpoint);
    }

    /**
     * @param {string} id 
     */
    async getById(id) {
        return await Axios.get(`${this.endpoint}/${id}`);
    }

    async get(queryParams) {
        return await Axios.get(this.endpoint, { params: queryParams });
    }

    async post(entity) {
        return await Axios.post(this.endpoint, entity);
    }

    async put(entity) {
        return await Axios.put(`${this.endpoint}/${entity.id}`, entity);
    }

    /**
     * @param {string} id 
     */
    async delete(id) {
        return await Axios.delete(`${this.endpoint}/${id}`);
    }
}