/** @format */

// api.js

async function fetchData(baseUrl, url, options = {}) {
  try {
    const response = await fetch(`${baseUrl}${url}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}
export default fetchData;
