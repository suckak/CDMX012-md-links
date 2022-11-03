import { jest } from '@jest/globals';
import axios from 'axios';

import mdLinks, { getValidatePromise, handleResponse, getLinks } from '../index2.js';

describe('handleResponse', () => {
  it('should return an object with link props plus status and ok:ok props when response includes status', () => {
    const link = { prop1: 'prop1' };
    const response = { status: 200 };
    const result = { ...link, status: 200, ok: 'ok' };
    expect(handleResponse(link, response)).toEqual(result);
  });

  it('should return an object with link props plus status and ok:fail props when response includes status', () => {
    const link = { prop1: 'prop1' };
    const response = { response: { status: 400 } };
    const result = { ...link, status: 400, ok: 'fail' };
    expect(handleResponse(link, response)).toEqual(result);
  });

  it('should return an object with link props plus status:errno and ok:fail props when response includes status', () => {
    const link = { prop1: 'prop1' };
    const response = { errno: 'errno' };
    const result = { ...link, status: 'errno', ok: 'fail' };
    expect(handleResponse(link, response)).toEqual(result);
  });
});

describe('getValidatePromise', () => {

  it('should return a promise', () => {
    const promise = getValidatePromise({ href: 'link' });
    expect(Object.prototype.toString.call(promise) === "[object Promise]").toBe(true);
  });

  it('it should call axios.get', () => {
    const response = { status: 200 };
    axios.get = jest.fn(() => Promise.resolve(response));
    const spy = jest.spyOn(axios, 'get');
    const args = { href: 'link' };
    getValidatePromise(args);
    expect(spy).toHaveBeenCalledWith('link');
  });

});

describe('getLinks', () => {

  it('should return an array with each link object info', () => {
    const file = 'myFile.exe';
    const content = `[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
    ligero muy popular entre developers. Es usado en muchísimas plataformas que
    manejan texto plano (GitHub, foros, blogs, ...), y es muy común
    Dentro de una comunidad de código abierto, nos han propuesto crear una
    herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos
    en formato \`Markdown\`, para verificar los links que contengan y reportar
    algunas estadísticas.`;
    const result = [
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file,
      },
      {
        href: 'https://nodejs.org/',
        text: 'Node.js',
        file,
      }
    ];

    expect(getLinks(content, file)).toEqual(result);
  });

});
