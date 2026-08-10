const axios = require("axios")
async function a(){
    const BASE_URL = "https://www.codechef.com";
    const response = await axios.get(`${BASE_URL}/api/list/contests/all`, {
        params: {
          sort_by: "START",
          sorting_order: "asc",
          offset: 0,
          mode: "all",
        },
        headers: {
          // Standard headers to look like a browser if needed
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
      });

      // The API returns { present_contests: [], future_contests: [], past_contests: [] }
      const present = response.data.present_contests || [];
      const future = response.data.future_contests || [];
    console.log(future)
      return [...present, ...future];
}
a()