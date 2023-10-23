import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const PORT =  5050;

app.use(express.static('public'));

app.use(express.json());

// Check if the "TextFiles" directory exists; if not, create it.
const directoryPath = path.join(__dirname, 'TextFiles');
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
}


app.get(`/createfile`, (req, res) => {
    const currentDate = new Date();
   const fileName = `${new Date().toISOString().replace(/:/g, '-')}.txt`;
   const data = Date.now().toString();

    fs.writeFile(`./TextFiles/${fileName}`, data, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Unable to create file' });
        } else {
            console.log("File created");
            res.status(200).json({ message: 'File created', fileName: fileName });
        }
    });
});

app.get(`/readfile`, (req, res) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Unable to read file' });
        } else {
             const fileData = [];
      files.forEach((fileName) => {
        const filePath = path.join(directoryPath, fileName);
        const content = fs.readFileSync(filePath, 'utf8');
        fileData.push({ fileName, Timestamp: content });
      });
      res.status(200).json(fileData);
        }
    });
});


app.listen(PORT, () => {
    console.log('Application Started on port 5050');
  });