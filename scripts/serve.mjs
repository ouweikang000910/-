import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server = http.createServer(async (req,res) => {
  try {
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end('Method not allowed');return;}
    const url = new URL(req.url, 'http://127.0.0.1');
    const route = decodeURIComponent(url.pathname);
    if (route.split('/').some(p=>p.startsWith('.'))) {res.writeHead(404);res.end('Not found');return;}
    const file = path.resolve(root, '.' + (route === '/' ? '/index.html' : route));
    if (!file.startsWith(root+path.sep)) {res.writeHead(404);res.end('Not found');return;}
    const data = await fs.readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.on('error', err=>{console.error(err.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log('Motion Effect Library: http://127.0.0.1:'+port));
