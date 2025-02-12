const { TwitterApi } = require('twitter-api-v2');

class TwitterService {
  constructor() {
    // Log to verify environment variables are loaded
    console.log('Initializing Twitter Service');
    console.log('API Key exists:', !!process.env.TWITTER_API_KEY);
    
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
  }

  async tweet(message) {
    try {
      console.log('Attempting to tweet:', message);
      const tweet = await this.client.v2.tweet(message);
      console.log('Tweet successful:', tweet);
      return tweet;
    } catch (error) {
      console.error('Error in TwitterService:', error);
      throw error;
    }
  }
}

module.exports = new TwitterService(); 