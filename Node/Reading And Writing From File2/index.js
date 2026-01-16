const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            fs.readFile('data.txt', 'utf-8', (err, data) => {
                let messages = '';
                if (!err && data.trim() !== '') {
                    const lines = data.trim().split('\n').reverse();
                    messages = lines.map(line => `<p>${line}</p>`).join('');
                }
                fs.readFile(path.join(__dirname, 'form.html'), 'utf-8', (err, htmlData) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    } else {
                        const finalHTML = htmlData.replace('<div id="messages"></div>', messages);
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(finalHTML);
                    }
                });
            });
        } else if (req.url === '/script.js') {
            fs.readFile(path.join(__dirname, 'script.js'), 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.end(data);
                }
            });
        } else if (req.url === '/api/messages') {
            fs.readFile('data.txt', 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Cannot read file' }));
                } else {
                    const lines = data.trim() === '' ? [] : data.trim().split('\n').reverse();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(lines));
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page Not Found');
        }
    } else if (req.method === 'POST') {
        if (req.url === '/submit') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                const parsed = querystring.parse(body);
                const newMessage = parsed.message + '\n';
                fs.appendFile('data.txt', newMessage, err => {
                    res.writeHead(302, { 'Location': '/' });
                    res.end();
                });
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page Not Found');
        }
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
