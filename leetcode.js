const axios = require("axios")
async function a(){
    const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';
    const UPCOMING_CONTESTS_QUERY = `
  query {
    topTwoContests {
      title
      titleSlug
      startTime
      duration
    }
  }
`;
    const response = await axios.post(
        LEETCODE_GRAPHQL_URL,
        {
          query: UPCOMING_CONTESTS_QUERY,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.data.topTwoContests)
      return response.data.data.topTwoContests;
}a()