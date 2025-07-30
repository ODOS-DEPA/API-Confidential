import express from 'express';
import axios from 'axios';
import archiver from 'archiver';
import dotenv from "dotenv";


dotenv.config({ path: ['.env','./NameList.conf'] });

const app = express();

// ฟังก์ชันดึงรายชื่อไฟล์ในโฟลเดอร์
async function listFilesInFolder(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${process.env.API_KEYS}&fields=files(id,name,mimeType)`;
  const response = await axios.get(url);
  return response.data.files.filter(f => f.mimeType !== 'application/vnd.google-apps.folder');
}

app.get('/download-Confidential/Docx', async (req, res) => {
  try {
    let FOLDER_ID = process.env[req.query.studentid];
    const files = await listFilesInFolder(FOLDER_ID);

    res.setHeader('Content-Disposition', 'attachment; filename="all_files.zip"');
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('error', err => {
      throw err;
    });

    archive.pipe(res);

    // เพิ่มไฟล์ทีละไฟล์จาก Google Drive ลงใน ZIP โดยใช้ stream
    for (const file of files) {
      const fileStream = await axios({
        method: 'get',
        url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${process.env.API_KEYS}`,
        responseType: 'stream',
      });

      archive.append(fileStream.data, { name: file.name });
    }

    await archive.finalize();

  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating ZIP file');
  }
});

app.listen(process.env.PORT,"0.0.0.0", () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
