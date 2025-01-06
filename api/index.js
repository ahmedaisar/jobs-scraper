import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to get all job listings
app.get('/api/jobs', async (req, res) => {
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

        res.json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error('Error scraping jobs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch job listings'
        });
    }
});

// Route to get individual job details
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const url = req.params.url;
        // Construct the URL using the pattern from your example
        
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Extract job details
        const jobDetails = {
            title: $('.post-title').text().trim(),
            image: $('.post-body img').attr('src'),
            description: $('.post-body').text().trim(),
            postedDate: $('.post-header .date').text().trim()
        };

        res.json({
            success: true,
            data: jobDetails
        });
    } catch (error) {
        console.error('Error scraping job details:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch job details'
        });
    }
});

// Simple test route
app.get('/test', (req, res) => {
    res.json({ message: 'Scraper API is working!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});