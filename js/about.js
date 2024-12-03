function parseTweets(runkeeper_tweets) {
    // Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined || runkeeper_tweets.length === 0) {
        window.alert('No tweets returned');
        return;
    }

    const tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });
    
    // find earliest and latest tweet dates
    const sortedDates = tweet_array.map(tweet => tweet.time).sort((a, b) => a - b);
    const firstDate = sortedDates[0].toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const lastDate = sortedDates[sortedDates.length - 1].toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // update spans with earliest and latest tweet dates
    document.getElementById('numberTweets').innerText = tweet_array.length;
    document.getElementById('firstDate').innerText = firstDate;
    document.getElementById('lastDate').innerText = lastDate;

    // counting tweet categories
    const categories = {
        'completed_event': 0,
        'live_event': 0,
        'achievement': 0,
        'miscellaneous': 0
    };
    tweet_array.forEach(tweet => {
        categories[tweet.source]++;
    });

    // update spans with tweet category counts
    document.querySelector('.completedEvents').innerText = categories['completed_event'];
    document.querySelector('.liveEvents').innerText = categories['live_event'];
    document.querySelector('.achievements').innerText = categories['achievement'];
    document.querySelector('.miscellaneous').innerText = categories['miscellaneous'];

    // calculate and format percentages
    const totalTweets = tweet_array.length;
    const percentage = (count) => (count / totalTweets * 100).toFixed(2);
    document.querySelector('.completedEventsPct').innerText = percentage(categories['completed_event']) + "%";
    document.querySelector('.liveEventsPct').innerText = percentage(categories['live_event']) + "%";
    document.querySelector('.achievementsPct').innerText = percentage(categories['achievement']) + "%";
    document.querySelector('.miscellaneousPct').innerText = percentage(categories['miscellaneous']) + "%";

    // count completed event tweets with user-written text
    const completedWithText = tweet_array.filter(tweet => tweet.source === 'completed_event' && tweet.written).length;
    const completedEventTotal = categories['completed_event'];
    const writtenPercentage = ((completedWithText / completedEventTotal) * 100).toFixed(2);
    document.querySelector('.written').innerText = completedWithText;
    document.querySelector('.writtenPct').innerText = writtenPercentage + "%";

    // update total number of completed events
    document.querySelector('.completedEventsTotal').innerText = completedEventTotal;
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
    loadSavedRunkeeperTweets().then(parseTweets);
});