export const uploadToCloudinary = async (pics: File) => {
  const cloud_name = "dp2o2kj4p";
  const upload_preset = "anjalicart_preset";

  if (!pics) {
    console.log("Error: No file selected");
    return null;
  }

  const data = new FormData();
  data.append("file", pics);
  data.append("upload_preset", upload_preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  const fileData = await res.json();
  return fileData.secure_url; 
};
