const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; // You can set your desired port number

// Define a route to handle direct URL with parameters
app.get('/download', (req, res) => {
  const { url } = req.query; // Extract the 'url' parameter from the query string

  const options = {
    method: 'GET',
    url: 'https://youtube-mp3-download1.p.rapidapi.com/dl',
    params: { id: url }, // Use the provided URL directly
    headers: {
      'X-RapidAPI-Key': 'dfb9b7d5b7msh58605fff4558064p180b18jsnce10425639e1',
      'X-RapidAPI-Host': 'youtube-mp3-download1.p.rapidapi.com'
    }
  };

  // Send a request to the external API
  axios.request(options)
    .then(function (response) {
      // Handle the response data here
      const responseData = response.data;
      res.json(responseData); // Send the response back to the client
    })
    .catch(function (error) {
      // Handle any errors that occur during the request
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
