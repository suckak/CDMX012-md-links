import * as nodePath from 'path'
import * as nodeFs from 'fs';
import fs from 'fs/promises';
import axios from "axios";

export const handleResponse = (link, response) => {
  const data = {
    ...link,
    status: '404',
    ok: 'fail',
  };

  if (response.status) {
    data.status = response.status;
    data.ok = 'ok';
    return data;
  }

  if (response.response) {
    data.status = response.response.status;
    return data;
  }

  data.status = response.errno;
  return data;
};

export const getValidatePromise = (link) => {
  const { href } = link;
  return axios.get(href)
    .then((response) => handleResponse(link, response)).catch((response) => handleResponse(link, response));
};

export const getLinks = (content, file) => {
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;
  const matches = content.match(regexMdLinks);
  return matches
    .filter((mat) => mat.includes("http"))
    .map((result) => {
      const arr = result.split("]");
      return {
        text: arr[0].replace("[", "").replace("]", ""),
        href: arr[1].replace("(", "").replace(")", ""),
        file,
      };
    });
};

const readFile = (file) =>
  fs.readFile(file, { encoding: 'utf8' }).then(data => getLinks(data, file));

const readFiles = (path) =>
  getFilesR(path).then(files => Promise.all(files.map(readFile))).then(arrs => arrs.flat());

const filterMD = file => file.includes('.md')

const getFiles = (path) =>
  fs.readdir(path).then(files => files.filter(filterMD));

const getFilesR = (path) => {
  if (!nodeFs.lstatSync(path).isDirectory()) {
    return path;
  }

  const arrPaths = fs.readdir(path).then(files => files.map(file => `${path}/${file}`));
  return arrPaths
    .then(paths => paths.map(getFilesR))
    .then(arr => Promise.all(arr)).then(arr => arr.flat().filter(filterMD));
};

const validateFile = (file) =>
  readFile(file).then(arr => arr.map(getValidatePromise)).then(arr => Promise.all(arr));

const createErrorReject = (reject, message) => reject(new Error(message));

const validateFiles = (path) =>
  getFilesR(path).then(files => Promise.all(files.map(validateFile))).then(arrs => arrs.flat());

const mdLinks = (path, options = { validate: false, stats: false }) => {

  if (options.stats) {
    const result = mdLinks(path, { ...options, stats: false });

    return result.then(data => {

      const stats = {
        total: data.length,
        unique: new Set(data.map(link => link.href)).size,
      };

      if (options.validate) {
        stats.broken = data.filter(link => link.ok === 'fail').length;
      }

      return stats;

    });
  }

  return new Promise((resolve, reject) => {

    if (!path) {
      createErrorReject(reject, 'no path');
    }

    if (!nodePath.isAbsolute(path)) {
      path = nodePath.resolve(path);
    }

    if (!nodeFs.existsSync(path)) {
      createErrorReject(reject, 'no existe el path');
    }

    if (nodeFs.lstatSync(path).isDirectory()) {

      if (options.validate) {
        resolve(validateFiles(path));
      }

      resolve(readFiles(path));

    } else {

      if (!path.includes('.md')) {
        createErrorReject(reject, 'no MD file');
      }

      if (options.validate) {
        resolve(validateFile(path));
      }

      resolve(readFile(path));
    }

  });
};

export default mdLinks;
