/** @flow */
import path from 'path';
import { Readable } from 'stream'; 
import Bit from '../bit/';
import BitDependencies from '../scope/bit-dependencies';
import parser from './parser';
import serverlesindexInstancendex from './serverless-index';

let localIndex;

function tokenizeStr(str) {
  return str.trim().split(/(?=[A-Z])/).join(' ').toLowerCase().split(/ |_|-/).join(' ');
}

function prepareDoc(doclets: Object, bit: Bit): Object {
  const name = bit.bitJson.name;
  const box = bit.bitJson.box;
  const functionNames = doclets.map(doclet => doclet.name).join(' ');
  return {
    id: `${name}_${box}`,
    name,
    tokenizedName: tokenizeStr(name),
    box,
    tokenizedBox: tokenizeStr(box),
    functionNames,
    tokenizedFunctionNames: tokenizeStr(functionNames),
    description: doclets.map(doclet => doclet.description).join(' ')
  };
}

function addToLocalIndex(doclets: Object, bit: Bit): Promise<any> {
  return new Promise((resolve, reject) => {
    const doc = prepareDoc(doclets, bit);
    localIndex.then((indexInstance) => {
      const docStream = new Readable({ objectMode: true });
      docStream.push(doc);
      docStream.push(null);
      docStream
        .pipe(indexInstance.defaultPipeline())
        .pipe(indexInstance.add())
        .on('data', (d) => {
          // this function needs to be called if you want to listen for the end event
        })
        .on('end', () => {
          resolve('The indexing has been completed');
        });
    });
  });
}

function indexForCLI(bit: BitDependencies) {
  return new Promise((resolve, reject) => {
    const implFile = path.join(bit.bit.bitDir, bit.bit.bitJson.impl);
    parser.parse(implFile).then((doclets) => {
      addToLocalIndex(doclets, bit.bit).then(() => resolve(doclets));
    }).catch(err => reject(err));
  });
}

function indexForWeb() {} // TODO

function index(bit: Bit, scopePath: string) {
  localIndex = serverlesindexInstancendex.initializeIndex(scopePath);
  return indexForCLI(bit);
}

module.exports = {
  index,
  tokenizeStr
};
