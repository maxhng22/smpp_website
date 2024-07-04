import apiClient from './../apiClient';


export const getLog = async () => {
    return apiClient.get('/api/getlog');
}