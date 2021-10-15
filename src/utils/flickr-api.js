const API_KEY = "9f7d0ad0ef2a216d9506553da2af4a7a";
const API_URL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&media=photos&content_type=1&sort=relevance&extras=description%2C+owner_name%2C+tags%2C+icon_server%2C+url_m&format=json&nojsoncallback=1`

const flickrAPI = (text, safeSearch, page) => {
    let url = `${API_URL}&text=${text}&safe_search=${safeSearch}&page=${page}`
    console.debug(`Calling API: ${url}`);    
    return fetch(url)
      .then( (response) => {
        return response.json();
      })
      .catch( (error) => {
        return error;
      });
}

export default flickrAPI;