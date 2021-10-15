const flickrAPI = jest.fn(() => {
    return Promise.resolve({
        stat: "", 
        code: "",
        message: ""
    });
})  

export default flickrAPI;