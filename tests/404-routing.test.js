const assert = require('assert');
const fs = require('fs');

const notFound = fs.readFileSync('404.html', 'utf8');
const vercel = fs.readFileSync('vercel.json', 'utf8');

assert.ok(fs.existsSync('404.html'), 'root 404.html should exist for Vercel static 404 handling');
assert.ok(notFound.includes('href="/"'), '404 page home links should be root-relative for nested invalid routes');
assert.ok(notFound.includes('href="/#url-input"'), 'generate resume link should work from nested invalid routes');
assert.equal(notFound.includes('href="index.html"'), false, '404 page should not use relative index.html links');
assert.equal(vercel.includes('"rewrites"'), false, 'Vercel config should not rewrite unknown routes to a 200 page');
assert.equal(vercel.includes('"routes"'), false, 'Vercel config should avoid legacy routes that can conflict with headers');

console.log('404 routing tests passed');
