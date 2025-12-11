export async function uploadToImgBB(file) {
    const apiKey = import.meta.env.VITE_IMGBB_KEY;
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await res.json();
  
      // If ImgBB returns an error
      if (!data.success) {
        console.error("ImgBB Error:", data);
        return null;
      }
  
      return data?.data?.url || null;
  
    } catch (error) {
      console.error("Upload failed:", error);
      return null; // Prevent breaking React
    }
  }
  