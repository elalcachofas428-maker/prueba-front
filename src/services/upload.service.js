import axios from 'axios';

const UploadService = {
  uploadBase64ToCloudinary: async (base64String) => {
    if (!base64String || !base64String.startsWith('data:')) {
      return base64String || null;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpqgbgilw';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'leadbook_preset';

    try {
      const fetchRes = await fetch(base64String);
      const blob = await fetchRes.blob();

      const fd = new FormData();
      fd.append('file', blob);
      fd.append('upload_preset', uploadPreset);
      fd.append('folder', 'leadbook/pdfs');

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        fd
      );

      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Error al subir la imagen a la nube');
    }
  }
};

export default UploadService;
