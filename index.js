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

  res.header("Content-Disposition", `attachment; filename="file.${type}"`);
  
  try {
    ytdl(url, { filter: 'audioonly' }).pipe(res); // Download audio only
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log("Server is running...");
});
