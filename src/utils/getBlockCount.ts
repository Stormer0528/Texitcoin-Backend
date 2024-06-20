import fetch, { Headers } from 'node-fetch';

export const getBlockCount = async () => {
  try {
    const url = 'http://127.0.0.1:15739/';
    const username = 'texitcoin';
    const password = 'texitcoin';
    const rpccommand = {
      jsonrpc: '1.0',
      id: 'curltest',
      method: 'getblockcount',
      params: [],
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

    const { value } = await response.json();

    return value;
  } catch (error) {
    console.log('error => ', error);
  }
};
