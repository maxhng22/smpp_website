import apiClient from './../apiClient';

export const sendMessageSMPP = async (source, destination,message, registerDevivery) => {
    return apiClient.post('/api/send-message', { source, destination,message ,registerDevivery});
};

export const txOnlySMPP = async (host, port,systemId,password,systemType,version) => {
    return apiClient.post('/api/txonlysmpp', { host, port,systemId,password,systemType,version });
};

export const rxOnlySMPP = async (host, port,systemId,password,systemType,version) => {
    return apiClient.post('/api/rxonlysmpp', { host, port,systemId,password,systemType,version });
}

export const loadTest = async (host, port,systemId,password,systemType,version) => {
    return apiClient.post('/api/loadtest', { host, port,systemId,password,systemType,version });
}

export const connectSMPP = async (host, port,systemId,password,systemType,version) => {
    return apiClient.post('/api/connectsmpp', { host, port,systemId,password,systemType,version });
}

export const disConnectSMPP = async (host, port,systemId,password,systemType,version) => {
    return apiClient.post('/api/disconnectsmpp', { host, port,systemId,password,systemType,version });
}

export const getSMPPConnection = async () => {
    return apiClient.get('/api/smppConnection');
}