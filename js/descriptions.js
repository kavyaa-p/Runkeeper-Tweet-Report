function parseTweets(runkeeper_tweets) {
    // Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    const writtenTweets = runkeeper_tweets.filter(tweet => tweet.written);
    
    populateTable(writtenTweets);
}

function populateTable(tweets) {
    const searchTextElement = document.getElementById('searchText');
    const searchCountElement = document.getElementById('searchCount');
    const tweetTableBody = document.getElementById('tweetTable');

    // clear table
    tweetTableBody.innerHTML = '';

    // get search text
    const searchText = document.getElementById('textFilter').value.trim().toLowerCase();

    // update search count and text
    searchCountElement.textContent = tweets.length;
    searchTextElement.textContent = searchText === '' ? 'None' : `${searchText}`;

    // fill table rows
    tweets.forEach((tweet, index) => {
        const row = document.createElement('tr');

        // tweet number
        const tweetNumberCell = document.createElement('td');
        tweetNumberCell.textContent = index + 1;
        row.appendChild(tweetNumberCell);

        // activity type
        const activityTypeCell = document.createElement('td');
        activityTypeCell.textContent = tweet.activityType || 'N/A'; // 'N/A' if activity type not available
        row.appendChild(activityTypeCell);

        // tweet text
        const tweetTextCell = document.createElement('td');
        const tweetLink = document.createElement('a');
        tweetLink.textContent = tweet.text;
        tweetLink.href = tweet.link;
        tweetTextCell.appendChild(tweetLink);
        row.appendChild(tweetTextCell);

        tweetTableBody.appendChild(row);
    });
}

function addEventHandlerForSearch() {
    const textFilterInput = document.getElementById('textFilter');

    textFilterInput.addEventListener('input', function () {
        const searchText = this.value.trim().toLowerCase();
        loadSavedRunkeeperTweets()
            .then(tweets => {
                const filteredTweets = tweets.filter(tweet => tweet.text.toLowerCase().includes(searchText));
                populateTable(filteredTweets);
            })
            .catch(error => {
                console.error('Error loading tweets:', error);
            });
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});