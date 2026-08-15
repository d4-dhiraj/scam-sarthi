import axios from 'axios';

export const investigateURL = async (url) => {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    console.log('Using Mock Firecrawl Response');
    // Mock response
    if (url.includes('suspicious-link.example')) {
      return {
        title: 'Bank Verification - Urgent',
        content: 'Your account is locked. Please enter your username and password below to unlock your account immediately.',
        links: ['http://suspicious-link.example/login'],
        hasForms: true
      };
    } else {
      return {
        title: 'Normal Website',
        content: 'Welcome to our website. We provide good services.',
        links: [],
        hasForms: false
      };
    }
  }

  try {
    const response = await axios.post(
      'https://api.firecrawl.dev/v0/scrape',
      { url: url },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract relevant data for AI
    const data = response.data.data;
    return {
      title: data.metadata?.title || 'Unknown Title',
      content: data.content || '',
      // Can extract more specific things here based on Firecrawl's output
    };
  } catch (error) {
    console.error('Firecrawl Error:', error.response?.data || error.message);
    throw new Error('URL investigation failed');
  }
};
