import { spawn } from 'node-pty';
import { platform } from 'os';
import { WebSocketServer } from 'ws';
const shell = platform() === 'win32' ? 'powershell.exe' : 'bash';

const wss = new WebSocketServer({ port: 4001 });
console.log("web socket 运行中")
wss.on('connection', (ws) => {
    console.log('socket connection success');
    const ptyProcess = spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    });
    //接受数据
    ws.on('message', (res) => {
        ptyProcess.write(res)
    });
    //发送数据
    ptyProcess.on('data', function (data) {
        process.stdout.write(data);
        ws.send(data)
    });
});
