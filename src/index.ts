import {config} from "dotenv"

import * as fs from 'fs';
import fetch from 'node-fetch';

console.log('some');

// Считайте содержимое файла в память.
let file = fs.readFileSync(`${__dirname}/../public/image_with_eng_text.png`);

// Получите содержимое файла в формате Base64.
let encoded = Buffer.from(file).toString('base64');

// console.log(encoded);

let body = {
  folderId: process.env.FOLDER_ID,
  "analyze_specs": [{
    "content": encoded,
    "features": [{
      "type": "TEXT_DETECTION",
      "text_detection_config": {
        "language_codes": ["en", "ru"]
      }
    }]
  }]
}

console.log(body);

fetch("https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze", {
  body: JSON.stringify(body),
  headers: {
    Authorization: `Bearer ${process.env.YANDEX_CLOUD_TOKEN}`,
    "Content-Type": "application/json"
  },
  method: "POST"
})
  .then(res => res.json()) // expecting a json response
  .then(json => {
      let str = JSON.stringify(json, undefined, 2);
      console.log(str);
      fs.writeFile(`${__dirname}/../out/data.json`, str, function (err) {
        if (err) return console.log(err);
      });
    }
  )
  .catch(err => console.error(err))