# pdf_page_loading_server

简易的PDF分页加载文件服务器

## Description

⚠️低技术力警告，这是一个没有任何样式的单纯用来浏览PDF文件的服务器。主要功能就是在首页显示服务器特定目录下的所有PDF文件，点击对应PDF文件名跳转到PDF文件浏览页。

个人平时主要用这个来看漫画，由于有的漫画PDF文件非常庞大，如果等加载完整个文件再浏览等待时间将会长得难以接受，于是就有了这个项目。项目主要的功能就是将PDF文件分页并按顺序实时渲染收到的PDF页的画面，这样一页一页加载PDF就不会影响正常浏览。

## 基本配置

```shell
sudo apt update
sudo apt install nodejs npm
npm install express
```
这样就完成了基本环境配置

## 使用

将`server.mjs`中21行和34、35行里的`/srv/comic`替换为你存储需要浏览的文件的文件夹地址

```JavaScript
// 提供 /srv/comic 目录下的文件
app.use('/srv/comic', express.static('/srv/comic'));
```

```JavaScript
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

```

配置完后使用以下命令启动服务器

```shell
node server.mjs
```
服务器默认启动在3000端口，可以修改`server.mjs`中15行的PORT变量使用你喜欢的端口

```JavaScript
const PORT = process.env.PORT || 3000;
```
