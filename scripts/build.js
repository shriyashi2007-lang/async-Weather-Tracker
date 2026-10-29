import { access } from 'node:fs/promises';

const required = [
  '../public/index.html',
  '../public/style.css',
  '../public/app.js',
  '../public/api/weatherClient.js',
  '../server/app.js',
  '../api/index.js'
];

await Promise.all(required.map(file => access(new URL(file, import.meta.url))));
console.log('Static frontend and Vercel server entry verified. Output directory: public/');
