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
  // const format = ytdl.chooseFormat(info.formats, { quality: "136" });
  formats = formats.filter((format) => format.hasAudio === true);

  res.send({ title, thumbnail, audioFormats, formats });
});

//const express = require('express');
//const ytdl = require('ytdl-core');
//const app = express();
//const port = 3000;

app.get("/download", async (req, res) => {
  const url = req.query.url;
  const type = "mp3"; // Set the type to "mp3" for audio download

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    // Find the MP3 format directly
    const mp3Format = info.formats.find(format => format.container === 'mp3');

    if (!mp3Format) {
      res.status(404).send("MP3 format not available for this video.");
      return;
    }

    res.header("Content-Disposition", `attachment; filename="${title}.${type}"`);
    ytdl(url, { format: mp3Format }).pipe(res); // Download audio in MP3 format
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred.");
  }
});

app.listen(port, () => {
  console.log("Server is running...");
});
