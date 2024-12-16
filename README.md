# *Runkeeper Tweet Report*

Submitted by: **Kavya Pabbaraju**

This web app: **Provides a detailed report to analyze and understand a week's worth of RunKeeper tweets, including summarizing tweet data, identifying popular activities, and offering a searchable interface for exploring tweets and activities.**

## Features

The following functionality is implemented:

- [x] **Tweet Summary (About Page):**
  - Display the dates of the earliest and latest tweets.
  - Categorize tweets into Completed Events, Live Events, Achievements, and Miscellaneous.
  - Calculate the percentage of tweets with user-written text and dynamically display it on the page.

- [x] **Popular Activities (Activities Page):**
  - Identify the most frequent activity types and their distances for completed tweets.
  - Display the longest and shortest activities and analyze trends for weekdays versus weekends.
  - Include interactive Vega-Lite visualizations:
    - Plot of activity type frequencies.
    - Plot of distances by day of the week for the top three activities.
    - Aggregate plot of mean distances by activity type and day of the week.
    - Toggle between detailed and aggregated plots with a button.

- [x] **Searchable Interface (Description Page):**
  - Search for tweets by text to filter results dynamically.
  - Display the corresponding tweet number, activity type, and clickable links for detailed exploration.
  - Update the search count and text dynamically as the researcher types.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='./RunkeeperTweetReportDemo.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with [Kap](https://getkap.co/) for macOS