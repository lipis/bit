/** @flow */
import jsdocParser from 'jsdoc3-parser';

function filterDoclets(doclet) {
  if (doclet.kind === 'package') return false;
  if (doclet.memberof && doclet.memberof === 'module') return false;
  // TODO: remove private methods
  return true;
}

function parse(file: string) {
  return new Promise((resolve, reject) => {
    jsdocParser(file, (error, doclets) => {
      if (error) return reject(error);
      const filteredDoclets = doclets.filter(filterDoclets);
      return resolve(filteredDoclets);
    });
  });
}

module.exports = {
  parse,
};
