import * as _ from 'lodash';
import { commonUtils } from './common/utils';
import fs from 'fs';
import { config } from 'dotenv';

config();

if (!process.env.GIT_TOKEN) {
  console.log('Please set your personal GIT TOKEN');
  process.exit(-1);
}

function requireFeature(fileName: string) {
  return require("./features/" + fileName);
}

const listAllFilesUnderFeatures = () => {
  return fs.readdirSync('src/features').map((fileName: string) => fileName.replace(".ts", ""));
};
const firstArg = process.argv[2];
const filesNames = listAllFilesUnderFeatures();
const matchedFiles = filesNames.filter((fileName: string) => fileName.toLowerCase().includes(_.toLower(firstArg)));

if (matchedFiles.length === 1) {
  const feature = requireFeature(matchedFiles[0]);
  if (feature.default) {
    feature.default.logArguments();
    commonUtils.askQuestion('\nPlease confirm the arguments are correct？（Y/N)').then(answer => {
      if (answer == 'Y') {
        console.log('\nStart\n');
        feature.default.executor();
      }
    });
  }
} else {
  console.log(matchedFiles.length === 0 ? 'No Command Matched ' : 'More than 1 command matched: ', matchedFiles);
}
