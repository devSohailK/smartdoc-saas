import api from './api.service';


const chatService = {

    sendMessage: async(docId, message) => {
        const response = await api.post('/chat/message', {
            docId,
            message
         })
        return response.data;
    },
        
    getHistory: async(docId) => {
        const response = await api.get(`/chat/${docId}`);
        return response.data;
    }
}


export default chatService;