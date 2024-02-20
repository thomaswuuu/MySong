const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
const dotenv = require("dotenv");
dotenv.config();
const HOST = process.env.HOST;

const doc = {
  info: {
    version: "1.0.0", // by default: '1.0.0'
    title: "MySong", // by default: 'REST API'
    description: "Document of OpenAPI for MySong App",
  },
  servers: [
    {
      url: `http://${HOST}/api`,
      description: "",
    },
  ],
  components: {
    schemas: {
      users: {
        $name: "tester",
        $email: "tester@example.com",
        $password: "password",
        $thumbnail: "",
      },
      follows: {
        $type: "KKBOX",
        $track_id: "Gt0DxJP--2a5-4a5C4",
        $title: "Shape of You",
        $titleLink: "https://www.kkbox.com/tw/tc/song/Gt0DxJP--2a5-4a5C4",
        $artist: "Ed Sheeran (紅髮艾德)",
        $artistLink: "https://www.kkbox.com/tw/tc/artist/LZA5o1V1w4lbj0Rq2k",
        $cover: "https://i.kfs.io/album/global/21672225,1v1/fit/160x160.jpg",
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
};

const outputFile = "./swagger-out.json";
const routes = ["./routes/api.js"];

swaggerAutogen(outputFile, routes, doc);
