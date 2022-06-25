const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const userModel = require("./Models/userModel");
const xlsxtojson = require("xlsx-to-json-lc");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
mongoose
  .connect("mongodb://localhost:27017/exceldemo", { useNewUrlParser: true })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

function importExcelData2MongoDB(filePath, res) {
  xlsxtojson({
    input: filePath,
    output: "output.json",
    lowerCaseHeaders: true
  }, function (error, result) {
    if (!error) {
      userModel.insertMany(result, (error, _data) => {
        if (!error) {
          return res.status(200).send({ success: true, message: "Imported Data success" });
          // or you can just redirect them back to the root.
        } else {
          return res.redirect("/");
        }
      })
    } else {
      console.log(error);
    }
  });
}

app.post("/uploadfile", upload.single("uploadfile"), (req, res) => {
  importExcelData2MongoDB(__dirname + "/public/uploads/" + req.file.filename, res);
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log("server run at port " + port));
