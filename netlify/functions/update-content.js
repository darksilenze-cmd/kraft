const axios = require('axios');

exports.handler = async (event) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'your-username/your-repo';
  const FILE_PATH = 'content/posts/hello-world.md';
  const BRANCH = 'main';

  const content = `# Hello from the backend\n\nUpdated at ${new Date().toISOString()}`;
  const encodedContent = Buffer.from(content).toString('base64');

  try {
    // Get the current file SHA (required for update)
    const res = await axios.get(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const sha = res.data.sha;

    // Update the file
    await axios.put(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      message: 'Update content from backend',
      content: encodedContent,
      sha,
      branch: BRANCH,
    }, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return {
      statusCode: 200,
      body: 'Content updated successfully!',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`,
    };
  }
};
