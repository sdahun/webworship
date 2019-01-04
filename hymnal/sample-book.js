book['sample-book'] = {
	title: 'Sample Book',
	abbreviation: 'SB',
	lang: 'en',
	publisher: 'Publisher of Sample Book',
	year: '2000',
	description: 'Description of Sample Book',
	version: '1.0',
	speed: [], // speed variations; eg. "speed: [20, 30]" --> directory: sample-book-20, sample-book-30
	defaultSpeed: 0, // default speed
	markedSpeed: 0 // speed value where "speed: true"
}

category["sample-book"] = {
	1: "First category (1-4)",
	5: "Second category (from 5)",
}

song['sample-book/1'] = {
	connect: "sample-book/2",
	music: '001*',
	
	title: 'Sample Song',
	composer: "Sample Composer",
	poet: "Sample Poet",
	arranger: "Sample Arranger",
	
	tune: "Sample Tune",
	scripture: "Psalm 1:1-5",
	info: "Sample Info",
	copyright: "free",
	
	artist: 'Sample Artist',
	error: 'Verse 4 missing!',
	
	lily_score: {
	},
		
	1: "First...",
	2: "Second...",
	3: "Third..."
}

song['sample-book/2'] = {
	music: '002',
	title: 'Sample Song with one music file',
	verse: {
		1: "<!--0:10.0|1.-->First verse A",
		2: "<!--0:15.0-->First verse B",
		3: "<!--0:20.0|Refr.-->Refrain",
		4: "<!--0:25.0|2.-->Second verse A",
		5: "<!--0:30.0-->Second verse B",
		6: "<!--0:35.0|Refr.-->Refrain"
	}
}

song['sample-book/3'] = {
	music: '001*',
	title: 'Sample Song with music of first song',
	verse: {
		1: "First...",
		2: "Second...",
		3: "Third..."
	}
}

song['sample-book/4'] = {
	music: 'another-book/050*',
	title: 'Sample Song with music of another book\'s song',
	verse: {
		1: "First...",
		2: "Second...",
		3: "Third..."
	}
}
