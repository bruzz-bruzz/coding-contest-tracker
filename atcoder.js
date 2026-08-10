const axios = require('axios')
async function a(){
    let upcoming = []
    const ATCODER_BASE_URL = 'https://atcoder.jp';
    const officialPage = await axios.get(`${ATCODER_BASE_URL}/contests`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const html = officialPage.data;
        
        // Extract Upcoming Contests Table
        const upcomingSection = html.split('id="contest-table-upcoming"')[1];
        if (upcomingSection) {
            const tbody = upcomingSection.split('<tbody>')[1].split('</tbody>')[0];
            const rows = tbody.split('<tr');
            
            rows.forEach(row => {
                if (!row.trim()) return;
                
                // Extract Title & Path
                // <a href="/contests/abc387">AtCoder Beginner Contest 387</a>
                const titleMatch = row.match(/<a href="(\/contests\/[^"]+)">([^<]+)<\/a>/);
                
                // Extract Time (ISO-ish format in text)
                // <time class="fixtime fixtime-full">2025-01-11 21:00:00+0900</time>
                const timeMatch = row.match(/>(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\+0900)</);
                
                if (titleMatch && timeMatch) {
                    const path = titleMatch[1];
                    let title = titleMatch[2];
                    const timeStr = timeMatch[1];
                    const id = path.split('/').pop() || 'unknown';
                    
                    // Parse Time (Japan Time +0900)
                    const cleanTime = timeStr.replace(' ', 'T').replace('+0900', '+09:00');
                    const startTime = new Date(cleanTime).getTime() / 1000;
                    
                    // Filter Logic:
                    // 1. Remove "Job" / "Forecast"
                    if (title.toLowerCase().includes('job') || title.toLowerCase().includes('forecast')) return;

                    // 2. Decode specific HTML entities if present (e.g. &amp;)
                    title = title.replace(/&amp;/g, '&');

                    upcoming.push({
                        id: id,
                        start_epoch_second: startTime,
                        duration_second: 6000, // Default 100min fallback
                        title: title,
                        rate_change: '-' 
                    });
                }
            });
        }
        console.log(upcoming)
}
a()
//leetcode = 'https://alfa-leetcode-api.onrender.com/contests/upcoming'
//codeforces = https://codeforces.com/api/contest.list?gym=false
//codechef 