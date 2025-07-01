require('dotenv').config();
const puppeteer = require('puppeteer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const Article = require('../models/Article');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fetchTrends = async () => {
    console.log('🌐 Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🔍 Navigating to Google Trends...');
    await page.goto('https://trends.google.com/trends/trendingsearches/daily', { timeout: 60000 });

    const trends = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.mZ3RIc'))
            .map(el => el.textContent.trim())
            .filter(Boolean)
    );

    console.log('📊 Trends found:', trends.length);
    await browser.close();
    return trends;
};

const generateContent = async (topic) => {
    const prompt = `
    Act as an expert SEO content writer and web copywriter.
    
    Write a long-form, comprehensive, SEO-optimized article about the topic: "${topic}". The article should be written in **valid HTML5** format and must include:
    
    1. A clear and keyword-rich <title> tag.
    2. A compelling <meta> description (150–160 characters).
    3. A well-structured heading hierarchy using <h1> for the main title, <h2> for subheadings, and <h3> for deeper sections.
    4. Keyword-rich and engaging <p> paragraphs that provide valuable and accurate information.
    5. Use <ul> and <li> where bullet points or steps are appropriate (e.g., benefits, steps, tips).
    6. Include internal linking placeholders using <a href="#"> for navigation.
    7. Embed relevant image or video references using valid <img> or <iframe> tags with proper alt attributes and descriptive filenames (e.g., <img src="images/topic-overview.jpg" alt="Overview of Topic">).
    8. Ensure the article is informative, easy to read, and conversational but professional in tone.
    9. Use semantic HTML wherever possible.
    10. End with a conclusion section and a call-to-action (CTA).
    
    Structure the article like this:
    - <head> with <title> and <meta name="description">
    - <body> containing all content from <h1> to conclusion and CTA
    - Optional: Add <section> and <article> tags for grouping content
    
    Ensure the entire output is valid HTML and production-ready. Avoid boilerplate content. Do not include <html>, <head>, or <body> tags unless specified.
    
    Topic: ${topic}
    `;
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text(); // This should be HTML
    } catch (err) {
        console.error('Gemini API error:', err);
        return '';
    }
  };
const processTrends = async () => {
    try {
        console.log('🚀 Starting trend processing');
        const trends = await fetchTrends();

        if (!trends || trends.length === 0) {
            console.log('⚠️ No trends found');
            return;
        }

        for (const trend of trends.slice(0, 10)) {
            console.log(`🔎 Checking: ${trend}`);
            const existing = await Article.findOne({ title: trend });

            if (!existing) {
                const content = await generateContent(trend);

                // Validate content before saving
                if (!content || content.trim().length === 0) {
                    console.error(`❌ Empty content for: ${trend}`);
                    continue;
                }

                const slug = trend.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

                await Article.create({
                    title: trend,
                    slug,
                    content,
                    meta: {
                        title: `${trend} - TrendWise`,
                        description: `Latest trends about ${trend}`,
                        keywords: [trend]
                    }
                });
                console.log(`✅ Saved: ${trend}`);
            } else {
                console.log(`⏩ Exists: ${trend}`);
            }
        }
    } catch (err) {
        console.error('🔥 Error:', err);
    }
};

// Execute if run directly
if (require.main === module) {
    processTrends()
        .then(() => {
            console.log('🏁 Process completed');
            mongoose.connection.close();
        })
        .catch(err => {
            console.error('💥 Critical error:', err);
            mongoose.connection.close();
        });
}
