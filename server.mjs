import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// 设置 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 提供静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 提供 /srv/comic 目录下的文件
app.use('/srv/comic', express.static('/srv/comic'));

// 路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/pdf-viewer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pdf-viewer.html'));
});

// 处理 /files 请求
app.get('/files', async (req, res) => {
    const dirPath = req.query.dir || '/srv/comic';
    if (dirPath !== '/srv/comic') {
        return res.status(403).send('No Auth');
    }
    
    try {
        const files = await readdir(dirPath);
        const pdfFiles = [];

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const fileStat = await stat(filePath);

            if (fileStat.isFile() && path.extname(file).toLowerCase() === '.pdf') {
                pdfFiles.push(file);
            }
        }

        res.json(pdfFiles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to read directory');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
