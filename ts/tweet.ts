class Tweet {
    private text: string;
    time: Date;

    constructor(tweet_text: string, tweet_time: string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time);
    }

    get source(): string {
        if (this.text.toLowerCase().includes("just completed") || this.text.toLowerCase().includes("just posted")) {
            return "completed_event";
        } else if (this.text.toLowerCase().includes("watch my")) {
            return "live_event";
        } else if (this.text.toLowerCase().includes("achieved")) {
            return "achievement";
        } else {
            return "miscellaneous";
        }
    }

    get written(): boolean {
        // check if tweet contains extra text beyond standard pattern
        // regular expression to match #RunKeeper hashtag and tweet link
        const regex = /#RunKeeper|(https:\/\/t\.co\/\w+)/gi;
        // remove hashtag and tweet link from text
        const cleanedText = this.text.replace(regex, "").trim();
        // check if cleaned text contains any non-whitespace characters
        return /\S/.test(cleanedText) && !cleanedText.toLowerCase().includes("my sports watch") && 
        (cleanedText.toLowerCase().includes("-") || cleanedText.startsWith("#"));
    }

    get writtenText(): string {
        if (!this.written) {
            return "";
        }
        let writtenText = this.text.replace("#RunKeeper", "").replace(/http\S+/g, "").trim();
        console.log(writtenText);
        return writtenText;
    }

    get activityType(): string {
        if (this.source !== 'completed_event') {
            return "unknown";
        }
        const regex = /(?:completed a|posted a)\s+[\d.]+\s+(mi|km)\s+(\w+)(?=\s*with|\s*-\s*)/i;
        const match = this.text.match(regex);
        return match ? match[2] : "unknown";
    }        

    get distance(): number {
        if (this.source !== 'completed_event') {
            return 0;
        }
        const regex = /([\d.]+)\s*(mi|kilometers?)/i;
        const match = this.text.match(regex);
        if (!match) return 0;

        const distance = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        if (unit === 'mi') {
            return distance;
        } else if (unit === 'kilometer' || unit === 'kilometers') {
            return distance / 1.609;
        }
        return 0;
    }

    getHTMLTableRow(rowNumber: number): string {
        return "<tr></tr>";
    }
}