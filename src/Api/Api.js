import axios from "axios";

export default class ApiService {
    static endpoint = "http://localhost:8080/index.php?r=api";

    static getFullTree = async () => {
        let response = await axios.get(ApiService.endpoint + "/get-tree");
        return response.data;
    };
    static getClassObjects = async (classId) => {
        let response = await axios.get(
            ApiService.endpoint +
                `/get-class-individuals&class_id=${encodeURIComponent(classId)}`
        );
        return response.data;
    };
    static getObjectById = async (objectId) => {
        let response = await axios.get(
            ApiService.endpoint +
                `/get-individual&individual_id=${encodeURIComponent(objectId)}`
        );
        return response.data;
    };
    static extendedSearch = async (query) => {};
}