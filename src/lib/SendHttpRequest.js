import axios from "axios";

export async function SendHttpRequest(method, url, data, successMessage) {
  try {
    const response = await axios.request({
      method,
      url,
      data,
    });
    return { success: true, data: response.data, message: successMessage };
  } catch (error) {
    return { success: false, error };
  }
}
