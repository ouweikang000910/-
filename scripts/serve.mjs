import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readShotTree} from './shot-catalog.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.mp4':'video/mp4','.m4v':'video/mp4','.webm':'video/webm','.mov':'video/quicktime','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server = http.createServer(async (req,res) => {
  try {
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end('Method not allowed');return;}
    const url = new URL(req.url, 'http://127.0.0.1');
    const route = decodeURIComponent(url.pathname);
    if (route === '/api/shot-tree') {
      res.writeHead(200, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
      res.end(req.method === 'HEAD' ? undefined : JSON.stringify(await readShotTree(root)));
      return;
    }
    if (route.split('/').some(p=>p.startsWith('.'))) {res.writeHead(404);res.end('Not found');return;}
    const file = path.resolve(root, '.' + (route === '/' ? '/index.html' : route));
    if (!file.startsWith(root+path.sep)) {res.writeHead(404);res.end('Not found');return;}
    const data = await fs.readFile(file);
    const headers = {'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes','Content-Length':data.length};
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      const start = match && match[1] ? Number(match[1]) : match && match[2] ? Math.max(0, data.length-Number(match[2])) : NaN;
      const end = match && match[1] && match[2] ? Math.min(Number(match[2]),data.length-1) : data.length-1;
      if (!Number.isSafeInteger(start) || start<0 || start>=data.length || end<start) {
        res.writeHead(416, {'Content-Range':'bytes */'+data.length});res.end();return;
      }
      res.writeHead(206, {...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});
      res.end(req.method === 'HEAD' ? undefined : data.subarray(start,end+1));return;
    }
    res.writeHead(200, headers);
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.on('error', err=>{console.error(err.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log('Motion Effect Library: http://127.0.0.1:'+port));
