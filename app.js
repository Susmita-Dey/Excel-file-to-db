var express = require("express");
var mongoose = require("mongoose");
var multer = require("multer");
var path = require("path");
var userModel = require("./models/userModel");
var excelToJson = require("convert-excel-to-json");
var bodyParser = require("body-parser");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });
mongoose
  .connect("mongodb://localhost:27017/exceldemo", { useNewUrlParser: true })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public/uploads")));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

function importExcelData2MongoDB(filePath) {
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        name: "Customers",
        header: {
          rows: 1,
        },
        columnToKey: {
          A: "name",
          B: "email",
          C: "mobile",
          D: "dob",
          E: "work",
          F: "resume",
          G: "location",
          H: "address",
          I: "employer",
          J: "designation",
        },
      },
    ],
  });

  console.log(excelData);
  userModel.insertMany(jsonObj, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/");
    }
  });
  fs.unlinkSync(filePath);
}

app.post("/uploadfile", upload.single("uploadfile"), (req, res) => {
  importExcelData2MongoDB(__dirname + "/uploads/" + req.file.filename);
  console.log(res);
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log("server run at port " + port));
