import uuid from "react-native-uuid";
import BaseAPI from "../apis/baseAPI";

export default class BaseService {

    constructor(endpoint) {
        this.restClient = new BaseAPI(endpoint);
    }

    async getAll() {
        return await this.restClient.getAll();
    }

    async query(queryParams) {
        return await this.restClient.get(queryParams);
    }

    async create(entity) {
        const id = uuid.v1();
        entity.id = id;
        return await this.restClient.post(entity);
    }

    async update(newEntity) {
        return await this.restClient.put(newEntity);
    }
    
    async delete(id) {
        return await this.restClient.delete(id);
    }
}