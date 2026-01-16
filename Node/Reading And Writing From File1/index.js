const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {

    if (req.method === 'GET') {
        if (req.url === '/') {
            const filePath = path.join(__dirname, 'form.html');
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page Not Found');
        }

    } else if (req.method === 'POST') {
        if (req.url === '/submit') {
            let body = '';

        
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const parsedData = querystring.parse(body);
                const line = `Name: ${parsedData.username}, Email: ${parsedData.email}\n`;

                fs.appendFile('data.txt', line, err => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error writing file');
                    } else {
                        res.writeHead(302, { 'Location': '/' });
                        res.end();
                    }
                });
            });

        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page Not Found');
        }
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});


