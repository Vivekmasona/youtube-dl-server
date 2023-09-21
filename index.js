const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
// const fs = require("fs");

const corsOptions = {
  origin: "https://vidr-sp.netlify.app", // change this origin as your like
  // origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.static("./static"));
const port = process.env.PORT || 5000;

app.get("/", (res) => {
  res.render("index.html");
});

app.get("/get", async (req, res) => {
  const url = req.query.url;
  console.log(url);
  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;
  const thumbnail = info.videoDetails.thumbnails[0].url;
  let formats = info.formats;

  const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
  const format = ytdl.chooseFormat(info.formats, { quality: "136" });
  formats = formats.filter((format) => format.hasAudio === true);

  res.send({ title, thumbnail, audioFormats, formats });
});

app.get('/download', async (req, res) => {
  try {
    const videoURL = req.query.url; // Get the YouTube video URL from the query parameter

    if (!videoURL) {
      return res.status(400).send('Missing video URL');
    }

    // Get information about the video (including title)
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title; // Get the video's title

    // Set response headers to specify a downloadable file with the video's title
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    // Pipe the audio stream into the response
    ytdl(videoURL, { quality: 'highestaudio' }).pipe(res);
 } catch (error) {
    //console.error('Error:', error);
    //res.status(500).send('Internal Server Error');
  }
});

// app.get('*', (req, res) => {
//   res.render('error')
// })

app.listen(port, () => {
  console.log("Running ...");
});
