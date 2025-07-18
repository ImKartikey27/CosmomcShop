import { NextRequest } from 'next/server';
import dgram from 'dgram';

export async function POST(req: NextRequest) {
  const { command } = await req.json();

  if (!command)
    return new Response(JSON.stringify({ error: 'Command is required' }), {
      status: 400,
    });

  const udpClient = dgram.createSocket('udp4');
  const message = Buffer.from(command);

  const HOST = '64.227.165.17'; // Replace with your Minecraft server IP
  const PORT = 8090;

  return new Promise((resolve) => {
    

    udpClient.send(message, PORT, HOST, (err) => {
      if (err) {
        udpClient.close();
        clearTimeout(timeout);
        resolve(
          new Response(JSON.stringify({ error: 'Failed to send command' }), {
            status: 500,
          })
        );
      }
    });

    udpClient.on('message', (msg) => {
      console.log(msg.toString()); //TODO:remove this
      udpClient.close();
      clearTimeout(timeout);
      resolve(
        new Response(JSON.stringify({ output: msg.toString() }), {
          status: 200,
        })
      );
    });
    
    const timeout = setTimeout(() => {
      udpClient.close();
      resolve(
        new Response(JSON.stringify({ error: 'No response from server' }), {
          status: 504,
        })
      );
    }, 3000); // timeout in 3s
  });

    
}
