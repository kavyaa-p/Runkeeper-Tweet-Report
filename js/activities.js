let showAggregate = false; // boolean to track which plot to show

// wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
	function parseTweets(runkeeper_tweets) {
		// Do not proceed if no tweets loaded
		if (runkeeper_tweets === undefined || runkeeper_tweets.length === 0) {
			window.alert('No tweets returned');
			return;
		}

		const tweet_array = runkeeper_tweets.map(function (tweet) {
			return new Tweet(tweet.text, tweet.created_at);
		});

		// count activity types
		const activityCount = {};
		tweet_array.forEach(tweet => {
			if (tweet.source === 'completed_event') {
				const activity = tweet.activityType;
				if (activity in activityCount) {
					activityCount[activity]++;
				} else {
					activityCount[activity] = 1;
				}
			}
		});

		// find top three tweeted activities
		const sortedActivities = Object.entries(activityCount).sort((a, b) => b[1] - a[1]);
		const [mostTweeted1, count1] = sortedActivities[0] || ['unknown', 0];
		const [mostTweeted2, count2] = sortedActivities[1] || ['unknown', 0];
		const [mostTweeted3, count3] = sortedActivities[2] || ['unknown', 0];

		// update text with the most tweeted activities
		document.getElementById('numberActivities').innerText = Object.keys(activityCount).length;
		document.getElementById('firstMost').innerText = mostTweeted1 + ' (' + count1 + ')';
		document.getElementById('secondMost').innerText = mostTweeted2 + ' (' + count2 + ')';
		document.getElementById('thirdMost').innerText = mostTweeted3 + ' (' + count3 + ')';

		// calculate longest and shortest distances for top three activities
		let longestDistance = 0;
		let shortestDistance = Infinity;
		let longestActivityType = '';
		let shortestActivityType = '';
		tweet_array.forEach(tweet => {
			if (tweet.source === 'completed_event' && [mostTweeted1, mostTweeted2, mostTweeted3].includes(tweet.activityType)) {
				const distance = tweet.distance;
				if (distance > longestDistance) {
					longestDistance = distance;
					longestActivityType = tweet.activityType;
				}
				if (distance < shortestDistance && distance > 0) {
					shortestDistance = distance;
					shortestActivityType = tweet.activityType;
				}
			}
		});

		// update text with longest and shortest activity types
		document.getElementById('longestActivityType').innerText = longestActivityType;
		document.getElementById('shortestActivityType').innerText = shortestActivityType;

		// determine days with longest activities
		const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const activityByDay = new Array(7).fill(0);
		tweet_array.forEach(tweet => {
			if (tweet.source === 'completed_event') {
				const dayOfWeek = tweet.time.getDay();
				const distance = tweet.distance;
				if (distance === longestDistance) {
					activityByDay[dayOfWeek]++;
				}
			}
		});
		const longestDayIndex = activityByDay.indexOf(Math.max(...activityByDay));
		const longestDay = daysOfWeek[longestDayIndex];

		// update text with longest day
		document.getElementById('weekdayOrWeekendLonger').innerText = longestDay;


		// daily distances for top three tweeted-about activities
		const dailyDistances = {};
		tweet_array.forEach(tweet => {
			if (tweet.source === 'completed_event' && (tweet.activityType === mostTweeted1 || tweet.activityType === mostTweeted2 || tweet.activityType === mostTweeted3)) {
				const dayOfWeek = tweet.time.getDay();
				const activity = tweet.activityType;
				if (!(dayOfWeek in dailyDistances)) {
					dailyDistances[dayOfWeek] = {};
				}
				if (!(activity in dailyDistances[dayOfWeek])) {
					dailyDistances[dayOfWeek][activity] = [];
				}
				dailyDistances[dayOfWeek][activity].push(tweet.distance);
			}
		});

		// determine which scatter plot to show based on showAggregate flag
        if (showAggregate) {
            document.getElementById('distanceVisAggregated').style.display = 'block'; // Show the scatter plot with aggregated data
            document.getElementById('distanceVis').style.display = 'none'; // Hide the scatter plot with regular data
        } else {
            document.getElementById('distanceVisAggregated').style.display = 'none'; // Hide the scatter plot with aggregated data
            document.getElementById('distanceVis').style.display = 'block'; // Show the scatter plot with regular data
        }

		// first graph
		const activity_vis_spec = {
			"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
			"description": "A graph of the number of Tweets containing each type of activity.",
			"data": {
				"values": Object.entries(activityCount).map(([activity, count]) => ({ activity, count }))
			},
			"mark": "bar",
			"encoding": {
				"x": { "field": "activity", "type": "ordinal", "title": "Activity" },
				"y": { "field": "count", "type": "quantitative", "title": "Number of Tweets" },
				"config": {
					"axis": {"grid": true}
				}
			}
		};

		vegaEmbed('#activityVis', activity_vis_spec, { actions: false });


		// data for first plot
		const plotData = [];
		for (const dayOfWeek in dailyDistances) {
			for (const activity in dailyDistances[dayOfWeek]) {
				const distances = dailyDistances[dayOfWeek][activity];
				distances.forEach(distance => {
					plotData.push({ "dayOfWeek": daysOfWeek[parseInt(dayOfWeek)], "distance": distance, "activity": activity });
				});
			}
		}

		// second plot
		const scatterPlotSpec = {
			"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
			"description": "A plot of the distances by day of the week for all of the three most tweeted-about activities",
			"data": { "values": plotData },
			"mark": "point",
			"encoding": {
				"x": {
					"field": "dayOfWeek",
					"type": "ordinal",
					"axis": {
						"labelExpr": "substring(datum.value, 0, 3)",
						"title": "Day of the week",
						"sort": { "field": "dayOrder" }
					},
					"config": {
						"axis": {"grid": true}
					}
				},
				"y": { "field": "distance", "type": "quantitative", "title": "Distance" },
				"color": { "field": "activity", "type": "nominal", "title": "Activity Type" }
			}
		};

		vegaEmbed('#distanceVis', scatterPlotSpec, { actions: false });

		// last plot (aggregates)
		const scatterPlotSpecAggregate = {
			"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
			"description": "A scatter plot of distances by day of the week for the three most tweeted-about activities, aggregating by mean",
			"data": { "values": plotData },
			"mark": "point",
			"encoding": {
				"x": {
					"field": "dayOfWeek",
					"type": "ordinal",
					"axis": {
						"labelExpr": "substring(datum.value, 0, 3)",
						"title": "Day of the Week",
						"sort": { "op": "min", "field": "dayOrder" }
					},
					"config": {
						"axis": {"grid": true}
					}
				},
				"y": { "field": "distance", "type": "quantitative", "aggregate": "mean", "title": "Mean Distance" },
				"color": { "field": "activity", "type": "nominal", "title": "Activity Type" }
			}
		};

		vegaEmbed('#distanceVisAggregated', scatterPlotSpecAggregate, {actions: false});
	}

	// Wait for the DOM to load and then execute loadSavedRunkeeperTweets
	loadSavedRunkeeperTweets().then(parseTweets);

	// add event listener for button with id 'aggregate'
	document.getElementById('aggregate').addEventListener('click', function () {
		showAggregate = !showAggregate;
		if (showAggregate) {
            this.textContent = 'Show all activities';
        } else {
            this.textContent = 'Show means';
        }
        loadSavedRunkeeperTweets().then(parseTweets);
	});
});


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});