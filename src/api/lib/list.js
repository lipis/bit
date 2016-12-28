/** @flow */
import path from 'path';
import glob from 'glob';
import { BIT_HIDDEN_DIR, BIT_SOURCES_DIRNAME } from '../../constants';
import { BitId } from '../../bit-id';
import PartialBit from '../../bit/partial-bit';
import BitJson from '../../bit-json';

const projectPath = process.cwd();

function loadBit(sourcePath: String, id: BitId): Promise<Bit> {
  const bitDir = path.join(sourcePath, id.box, id.name, id.version.toString());

  return PartialBit.load(bitDir, id.name)
    .then(partial => partial);
}

/**
 * list the bits in the bits directory
 **/
function listCurrentScope(sourcePath): Promise<Bit[]> {
  return new Promise((resolve, reject) =>
    glob(path.join('*', '*', '*'), { cwd: sourcePath }, (err, files) => {
      if (err) reject(err);
      const bitsP = files.map((bitRawId) => {
        return loadBit(sourcePath, BitId.parse(`@this/${path.dirname(bitRawId)}`, 1));
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

exports.list = function (scope): Promise<string[]> {
  const sourcePath = path.join(projectPath, BIT_HIDDEN_DIR, BIT_SOURCES_DIRNAME);
  return scope ? listRemoteScope(scope) : listCurrentScope(sourcePath);
};

exports.remoteList = function (sourcePath): Promise<string[]> {
  sourcePath = path.join(sourcePath, BIT_SOURCES_DIRNAME);
  return listCurrentScope(sourcePath);
};
