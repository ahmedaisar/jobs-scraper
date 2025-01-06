import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query;
        const url = `https://www.job-maldives.com/2025/01/${id}.html`;
        
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const jobDetails = {
            title: $('.post-title').text().trim(),
            image: $('.post-body img').attr('src'),
            description: $('.post-body').text().trim(),
            postedDate: $('.post-header .date').text().trim()
        };

        return res.status(200).json({
            success: true,
            data: jobDetails
        });
    } catch (error) {
        console.error('Error scraping job details:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch job details'
        });
    }
}