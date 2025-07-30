import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env', './NameList.conf'] });

async function getFileByName(folderId, targetFileName) {
  const url = `https://www.googleapis.com/drive/v3/files`;
  const query = `'${folderId}' in parents and name = '${targetFileName}'`;

  try {
    const response = await axios.get(url, {
      params: {
        q: query,
        key: process.env.API_KEYS,
        fields: 'files(id, name, mimeType, size, modifiedTime)',
        pageSize: 1 // get only one file if matched
      }
    });

    const file = response.data.files[0];

    if (!file) {
      console.log('File not found.');
      return null;
    }

    return {
      ...file,
      directDownloadLink: `https://drive.google.com/uc?export=download&id=${file.id}`
    };
  } catch (error) {
    console.error('Error fetching file:', error.response?.data || error.message);
    return null;
  }
}

// Usage:
getFileByName(process.env.FoderID, 'Copy of 7.txt').then(file => {
  console.log(file);
});
