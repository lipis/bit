/** @flow */
import path from 'path';
import glob from 'glob';
import { BIT_HIDDEN_DIR, BIT_SOURCES_DIRNAME } from '../../constants';
import { BitId } from '../../bit-id';
import PartialBit from '../../bit/partial-bit';
import BitJson from '../../bit-json';

const projectPath = process.cwd();

function loadBit(sourcePath: string, id: BitId): Promise<PartialBit> {
  const bitDir = path.join(sourcePath, id.box, id.name, id.version.toString());
  return PartialBit.load(bitDir, id.name);
}

/**
 * list the bits in the source directory
 **/
function listCurrentScope(sourcePath: string): Promise<PartialBit[]> {
  return new Promise((resolve, reject) =>
    glob(path.join('*', '*', '*'), { cwd: sourcePath }, (err, files) => {
      if (err) reject(err);
      const bitsP = files.map((bitRawId) => {
        return loadBit(sourcePath, BitId.parse(`@this/${path.dirname(bitRawId)}`, path.basename(bitRawId)));
      });

      return Promise.all(bitsP)
      .then(resolve);
    })
  );
}

function listRemoteScope(rawRemote: string) {
  return BitJson.load(projectPath).then((bitJson) => {
    const remote = bitJson.getRemotes().get(rawRemote);
    return remote.list();
  });
}

exports.listScope = function (scope: string): Promise<PartialBit[]> {
  if (scope) return listRemoteScope(scope);
  const sourcePath = path.join(projectPath, BIT_HIDDEN_DIR, BIT_SOURCES_DIRNAME);
  return listCurrentScope(sourcePath);
};

exports.remoteList = function (sourcePath: string): Promise<PartialBit[]> {
  sourcePath = path.join(sourcePath, BIT_SOURCES_DIRNAME);
  return listCurrentScope(sourcePath);
};
