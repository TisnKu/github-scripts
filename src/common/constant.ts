const baseUrl = '';
const headers = {
  headers: {
    Authorization: `token ${(process.env.GIT_TOKEN)}`,
  }
};

export const gitConstants = {
  baseUrl,
  headers,
};

export const allReleasedRepos = [
];
