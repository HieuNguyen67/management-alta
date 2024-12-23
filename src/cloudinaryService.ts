import axios from "axios";

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Project-Alta"); 

  const response = await axios.post(
    "https://api.cloudinary.com/v1_1/da2alfbg9/image/upload", 
    formData
  );
  console.log("Cloudinary response:", response.data);

  return response.data.secure_url;
};
  