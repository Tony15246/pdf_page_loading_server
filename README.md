# pdf_page_loading_server

简易的PDF分页加载文件服务器

Simple PDF Page Loading File Server

## Description

⚠️低技术力警告，这是一个没有任何样式的单纯用来浏览PDF文件的服务器。主要功能就是在首页显示服务器特定目录下的所有PDF文件，点击对应PDF文件名跳转到PDF文件浏览页。

⚠️Low-tech warning, this is a purely functional server for browsing PDF files without any styling. The main function is to display all PDF files in a specific directory on the server's homepage and allow clicking on the corresponding PDF file name to jump to the PDF file viewing page.

个人平时主要用这个来看漫画，由于有的漫画PDF文件非常庞大，如果等加载完整个文件再浏览等待时间将会长得难以接受，于是就有了这个项目。项目主要的功能就是将PDF文件分页并按顺序实时渲染收到的PDF页的画面，这样一页一页加载PDF就不会影响正常浏览。

Personally, I mainly use this to read comics. Some comic PDF files are very large, and waiting for the entire file to load before browsing would be unbearably long, so this project was created. The main function of the project is to paginate the PDF files and render the received PDF pages in sequence in real-time. This way, loading the PDF page by page will not affect normal browsing.

## 基本配置/Basic Configuration

```shell
sudo apt update
sudo apt install nodejs npm
npm install express
```
这样就完成了基本环境配置

This completes the basic environment setup.

## 使用/Usage

将`server.mjs`中21行和34、35行里的`/srv/comic`替换为你存储需要浏览的文件的文件夹地址

Replace `/srv/comic` on lines 21 and 34, 35 in `server.mjs` with the folder address where you store the files you want to browse.

```JavaScript
// 提供 /srv/comic 目录下的文件
// Serve files from the /srv/comic directory
app.use('/srv/comic', express.static('/srv/comic'));
```

```JavaScript
// 处理 /files 请求
// Handle /files requests
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

```

配置完后使用以下命令启动服务器

After configuration, start the server with the following command:

```shell
node server.mjs
```
服务器默认启动在3000端口，可以修改`server.mjs`中15行的PORT变量使用你喜欢的端口

The server starts on port 3000 by default. You can modify the PORT variable on line 15 in `server.mjs` to use your preferred port.

```JavaScript
const PORT = process.env.PORT || 3000;
```

