import fetch, { Headers } from 'node-fetch';

import { RPCCOMMAND } from '@/type';
import { rpc_url, rpc_username, rpc_password } from 'src/consts';

export const rpcCommand = async ({ method, params = [] }: RPCCOMMAND) => {
  try {
    const rpccommand = {
      jsonrpc: '1.0',
      id: 'curltest',
      method,
      params,
    };

    const headers = new Headers();

    headers.set(
      'Authorization',
      'Basic ' + Buffer.from(`${rpc_username}:${rpc_password}`).toString('base64')
    );
    headers.set('Content-Type', 'text/plain');

    const response = await fetch(rpc_url, {
      method: 'POST',
      headers,
      body: JSON.stringify(rpccommand),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { value } = await response.json();

    return value;
  } catch (error) {
    console.log('error => ', error);
  }
};
