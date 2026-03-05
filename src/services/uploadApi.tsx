import api from '../lib/api';
import axios from 'axios';

export const uploadApi = {
  getPresignedUrl: (filename: string, contentType: string) =>
    api.post('/uploads/presign', { filename, contentType }).then((r) => r.data.data),

  uploadToS3: (uploadUrl: string, file: File) =>
    axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type },
    }),

  // 통합 메서드 — presign 발급 후 S3 업로드, fileUrl 반환
  uploadImage: async (file: File): Promise<string> => {
    const { uploadUrl, fileUrl } = await uploadApi.getPresignedUrl(file.name, file.type);
    await uploadApi.uploadToS3(uploadUrl, file);
    return fileUrl;
  },
};
