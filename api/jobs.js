import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await axios.get('https://www.job-maldives.com');
        const $ = cheerio.load(response.data);
        const jobs = [];

        $('.recent-posts-list').each((i, element) => {
            const titleElement = $(element).find('.recent-post-title a');
            const dateElement = $(element).find('.recent-posts-details');
            
            const title = titleElement.text().trim();
            const url = titleElement.attr('href');
            const date = dateElement.text().trim();
            
            if (title && url) {
                jobs.push({
                    title,
                    url,
                    date,
                    id: url.split('/').pop().replace('.html', '')
                });
            }
        });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error('Error scraping jobs:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch job listings'
        });
    }
}