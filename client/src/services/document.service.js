import api from './api.service';


const documentService = {

    upload: async (File, onUploadProgress) => {
        const formData = new FormData();
        formData.append('file', File);


        const response = await api.post("/documents/upload", formData, {

            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                if (onUploadProgress) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                }
                onUploadProgress(percent);
            },

        });

        return response.data;
    },

    getAll: async () => {
        const response = await api.get("/documents");
        return response.data;
    },

    delete: async(docId) => {
        const response = await api.delete(`/documents/${docId}`);   
        return response.data;
    }
};

export default documentService;

