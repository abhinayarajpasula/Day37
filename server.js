const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const filesDirectory = path.join(__dirname, 'files');

// Ensure the directory exists
if (!fs.existsSync(filesDirectory)) {
    fs.mkdirSync(filesDirectory);
}

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the File System API!');
});

// Endpoint to create a text file with current timestamp
app.post('/create-file', (req, res) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `${timestamp}.txt`;
    const filePath = path.join(filesDirectory, fileName);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).json({ message: 'Failed to create file.' });
        }
        res.json({ message: 'File created successfully.', fileName });
    });
});

// Endpoint to retrieve all text files in the directory
app.get('/files', (req, res) => {
    fs.readdir(filesDirectory, (err, files) => {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(500).json({ message: 'Failed to retrieve files.' });
        }

        const textFiles = files.filter(file => path.extname(file) === '.txt');
        res.json({ files: textFiles });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});