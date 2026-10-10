import fs from 'node:fs';
const base=process.argv[2];if(!base||!/^https?:\/\/[a-zA-Z0-9.-]+$/.test(base))throw Error('Pass a plain absolute origin');
for(const file of ['index.html','embed.html']){const source=fs.readFileSync(new URL(`./templates/${file}`,import.meta.url),'utf8');fs.writeFileSync(new URL(`./dist/${file}`,import.meta.url),source.replaceAll('__BASE__',base));}
