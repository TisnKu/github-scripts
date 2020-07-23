import axios from 'axios';
import { commonUtils, OperationResult } from '../common/utils';
import { gitUtils } from '../common/gitUtils';
import { gitConstants } from '../common/constant';

const repos: string[] = [];
const sourceBranch = 'release_aries';
const targetBranchSequence = ['master'];

const compareBranch = (repoName: string, branch: string): Promise<OperationResult> =>
  axios.get(`${gitConstants.baseUrl}/repos/${repoName}/compare/${sourceBranch}...${branch}`, gitConstants.headers)
    .then((response) => ({
      repoName,
      status: response.data.status,
      message: 'success',
    }))
    .catch(({ response }) => Promise.reject({
      repoName,
      status: response.status,
      message: 'no source branch',
    }));

const logArguments = () => {
  console.log('####Branch compare####\n');
  console.log('####Repo：\n');
  console.log(repos.length === 0 ? 'ALL' : repos.join(',\n'));
  console.log('\n####target branch：\n');
  console.log(targetBranchSequence.join(', '));
  console.log('\n####source branch：\n');
  console.log(sourceBranch);
};

const executor = () => (repos.length == 0 ? gitUtils.getAllRepoNames() : Promise.resolve(repos))
  .then(repoNames => commonUtils.repoReducer(repoNames as string[], targetBranchSequence, compareBranch))
  .then(commonUtils.logActionResults);

export default {
  logArguments,
  executor,
}
