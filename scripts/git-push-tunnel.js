const http = require('http');
const net = require('net');
const dns = require('dns');
const { spawn } = require('child_process');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const server = http.createServer((req, res) => {
  res.writeHead(405);
  res.end('Method not allowed');
});

server.on('connect', (req, clientSocket, head) => {
  const [host, port] = req.url.split(':');
  dns.resolve4(host, (err, addresses) => {
    const ip = (addresses && addresses[0]) ? addresses[0] : host;
    const targetSocket = net.connect(parseInt(port, 10) || 443, ip, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      if (head && head.length) targetSocket.write(head);
      targetSocket.pipe(clientSocket);
      clientSocket.pipe(targetSocket);
    });
    targetSocket.on('error', () => {
      clientSocket.end();
    });
    clientSocket.on('error', () => {
      targetSocket.end();
    });
  });
});

server.listen(9999, '127.0.0.1', () => {
  console.log('Tunnel listening on 127.0.0.1:9999, executing git push...');
  const child = spawn('git', ['-c', 'http.proxy=http://127.0.0.1:9999', 'push', 'origin', 'main'], {
    stdio: 'inherit',
    shell: true,
  });
  child.on('close', (code) => {
    console.log('git push exited with code:', code);
    server.close(() => {
      process.exit(code);
    });
  });
});
