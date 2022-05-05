const nodePath = require('path');
const fs = require('node:fs');
const axios = require('axios');

const mdLinks = (path, options = { validate: false }) => {
  return new Promise((resolve, reject) => {
    if (!path) {
      reject(new Error('No path'));
    }

    if(!nodePath.isAbsolute(path)){
      path = nodePath.resolve(path);
    }

    const files = getFiles(path).filter(file => file.substr(-3) === '.md');

    if (files.length < 1) {
      reject(new Error('no .md file'));
    }

    const links = [];

    files.map(file => {
      const data = fs.readFileSync(file, 'utf8');
      links.push(...getLinks(data, file));
    });

    if(options.validate) {
      resolve(Promise.all(links.map(link => validate(link))));
    }

    resolve(links);
  });
};

const getFiles = (path) => {
  if(fs.lstatSync(path).isDirectory()){
    const files = fs.readdirSync(path);
    return files.map(file => getFiles(`${path}/${file}`)).flat();
  } else {
    return [path];
  }
};

const getLinks = (content, file) => {
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;
  const matches = content.match(regexMdLinks)
  return matches.filter(mat => mat.includes('http')).map(result =>{
      const arr = result.split(']');
      return {
        text: arr[0].replace('[','').replace(']',''),
        href: arr[1].replace('(','').replace(')',''),
        file
      }
    });
};

const validate = (link) => {
  const { href } = link;

  const responseHandler = (response) => ({...link,
    status: response.status,
    ok: response.statusText || 'fail',
  })

  return axios.get(href)
    .then(responseHandler,responseHandler);
};


mdLinks('./dir/README.md',{validate:true}).then(console.log).catch(console.error);
//mdLinks('./dir').then(console.log).catch(console.log);
//mdLinks('./dir/README.md', {validate:true}).then(console.log).catch(console.log);

module.exports = mdLinks;
