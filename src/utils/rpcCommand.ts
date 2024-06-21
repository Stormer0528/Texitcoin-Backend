import fetch, { Headers } from 'node-fetch';
import { RPCCOMMAND } from '@/type';

export const rpcCommand = async ({ method, params = [] }: RPCCOMMAND) => {
  try {
    const url = process.env.RPC_URL;
    const username = process.env.RPC_USERNAME;
    const password = process.env.RPC_PASSWORD;

    const rpccommand = {
      jsonrpc: '1.0',
      id: 'block_info',
      method,
      params,
    };

    const headers = new Headers();

    headers.set(
      'Authorization',
      'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    );
    headers.set('Content-Type', 'text/plain');

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(rpccommand),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { result }: any = await response.json();

    return result;
  } catch (error) {
    console.log('error => ', error);
  }
};
