// Bible Word Array
let bibleWords = [
    {word: 'Aaron', scriptureRef: 'Exodus 6:27', link: 'https://www.biblegateway.com/passage/?search=Exodus+6&version=NIV', scripture: 'It was they who spoke to Pharaoh king of Egypt to bring the Israelites out of Egypt, the same Moses and Aaron.', clue: 'This person was best known for being an "excellent speaker" and later became the first High Priest of Israel.', clueBook: 'Exodus'},
    {word: 'Bread', scriptureRef: 'John 6:35', link: 'https://www.biblegateway.com/passage/?search=john+6&version=NIV', scripture: 'Then Jesus declared, "I am the bread of life. Whoever comes to me will never go hungry, and whoever believes in me will never be thirsty.', clue: 'A common food referenced in the Lord"s prayer.', clueBook: 'N/A'},   
    {word: 'Egypt', scriptureRef: 'Exodus 12:40', link: 'https://www.biblegateway.com/passage/?search=Exodus%2012&version=NIV', scripture: 'Now the length of time the Israelite people lived in Egypt was 430 years.', clue: 'This location was where Joseph was sold into slavery.', clueBook: 'N/A'}    
];

// Calculate Todays Number
let today = new Date();
let todaysNumber = Math.ceil((today - new Date(today.getFullYear(),0,1)) / 86400000);

// Temp Overide for testing
todaysNumber = 0;

// Return Corresponding Word Array
export let todaysWord = bibleWords[todaysNumber];