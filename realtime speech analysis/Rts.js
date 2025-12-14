

const loadingEl = document.getElementById('loading');


// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Prompts data with real images and descriptive alt text
const prompts = [
    {
        image: "/realtime speech analysis/assets/SunSet.jpg",
        alt: "A beautiful sunset beach scene with tall palm trees silhouetted against an orange and pink sky, gentle waves lapping the shore",
        title: "Speak about this scene:",
        text: "Describe the feelings and memories this sunset beach evokes in you."
    },
    {
        image: "/realtime speech analysis/assets/BuzyCity.webp",
        alt: "A busy city street at night illuminated by neon signs and headlights, people walking and cars moving in a lively urban environment",
        title: "Talk about this scene:",
        text: "Explain what you think life is like in this bustling city at night."
    },
    {
        image: "/realtime speech analysis/assets/SnowMountain.jpg",
        alt: "A majestic snowy mountain peak under a clear blue sky with crisp white snow covering the rugged terrain",
        title: "Describe this scene:",
        text: "Share your thoughts and emotions when looking at this snowy mountain peak."
    },
    {
        image: "/realtime speech analysis/assets/CozyLibrary.webp",
        alt: "A cozy library interior with wooden shelves filled with books, warm lighting, and a comfortable reading nook",
        title: "Speak about this scene:",
        text: "Describe what makes this library a perfect place for reading and learning."
    },
    {
        image: "/realtime speech analysis/assets/autum.jpg",
        alt: "A colorful autumn forest with trees showing vibrant red, orange, and yellow leaves under a bright sky",
        title: "Talk about this scene:",
        text: "Explain the beauty and atmosphere of this autumn forest."
    }
];

// Elements
const promptImage = document.getElementById('prompt-image');
const promptTitle = document.getElementById('prompt-title');
const promptText = document.getElementById('prompt-text');
const changePromptBtn = document.getElementById('change-prompt-btn');

// Speech recognition and analysis elements
const micButton = document.getElementById('mic-button');
const micRipple = document.getElementById('mic-ripple');
const transcriptEl = document.getElementById('transcript');
const wpmEl = document.getElementById('wpm');
const fillersEl = document.getElementById('fillers');
const longestPauseEl = document.getElementById('longest-pause');
const confidenceEl = document.getElementById('confidence');

// State
let currentPromptIndex = 0;
let recognition;
let recognizing = false;
let startTime = null;
let lastSpeechTime = null;
let longestPause = 0;
let fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'right', 'okay', 'well'];
let fillerCount = 0;
let wordCount = 0;
let transcriptText = '';

// Initialize prompt
function setPrompt(index) {
    const prompt = prompts[index];
    promptImage.src = prompt.image;
    promptImage.alt = prompt.alt;
    promptTitle.textContent = prompt.title;
    promptText.textContent = prompt.text;
    resetAnalysis();
}

// Reset analysis data and UI
function resetAnalysis() {
    transcriptText = '';
    wordCount = 0;
    fillerCount = 0;
    longestPause = 0;
    startTime = null;
    lastSpeechTime = null;
    transcriptEl.textContent = 'Your speech transcript will appear here in real time...';
    wpmEl.textContent = '0';
    fillersEl.textContent = '0';
    longestPauseEl.textContent = '0.0s';
    confidenceEl.textContent = 'N/A';
    if (recognizing) {
        recognition.stop();
    }
}

// Change prompt button handler
changePromptBtn.addEventListener('click', () => {
    currentPromptIndex = (currentPromptIndex + 1) % prompts.length;
    setPrompt(currentPromptIndex);
});


// Speech recognition setup
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    transcriptEl.textContent = 'Sorry, your browser does not support Speech Recognition.';
    micButton.classList.add('cursor-not-allowed', 'bg-gray-400', 'hover:bg-gray-400');
    micButton.removeEventListener('click', startStopRecognition);
} else {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        recognizing = true;
        startTime = Date.now();
        lastSpeechTime = Date.now();
        longestPause = 0;
        fillerCount = 0;
        wordCount = 0;
        transcriptText = '';
        transcriptEl.textContent = '';
        wpmEl.textContent = '0';
        fillersEl.textContent = '0';
        longestPauseEl.textContent = '0.0s';
        confidenceEl.textContent = 'N/A';
        micRipple.classList.add('animate-ping', 'opacity-60');
        micButton.setAttribute('aria-pressed', 'true');
    };

    recognition.onend = async () => {
        recognizing = false;
        micRipple.classList.remove('animate-ping', 'opacity-60');
        micButton.setAttribute('aria-pressed', 'false');

        if (transcriptText.trim().length > 0) {
            analyzeSpeech(transcriptText.trim());
        }
    };


    recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            transcriptEl.textContent = 'Microphone access denied. Please allow microphone usage.';
            micButton.classList.add('cursor-not-allowed', 'bg-gray-400', 'hover:bg-gray-400');
            micButton.removeEventListener('click', startStopRecognition);
        }
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        let highestConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
                finalTranscript += result[0].transcript;
                if (result[0].confidence > highestConfidence) {
                    highestConfidence = result[0].confidence;
                }
            } else {
                interimTranscript += result[0].transcript;
            }
        }

        if (finalTranscript.trim().length > 0) {
            transcriptText += finalTranscript + ' ';
            transcriptEl.textContent = transcriptText + interimTranscript;

            // Update word count
            const words = transcriptText.trim().split(/\s+/);
            wordCount = words.length;

            // Count filler words
            fillerCount = 0;
            const lowerText = transcriptText.toLowerCase();
            fillerWords.forEach((filler) => {
                const regex = new RegExp(`\\b${filler}\\b`, 'g');
                const matches = lowerText.match(regex);
                if (matches) fillerCount += matches.length;
            });

            // Calculate WPM
            const elapsedMinutes = (Date.now() - startTime) / 60000;
            const wpm = elapsedMinutes > 0 ? Math.round(wordCount / elapsedMinutes) : 0;

            // Calculate pauses
            const now = Date.now();
            const pauseDuration = (now - lastSpeechTime) / 1000;
            if (pauseDuration > longestPause) {
                longestPause = pauseDuration;
            }
            lastSpeechTime = now;

            // Update UI
            wpmEl.textContent = wpm;
            fillersEl.textContent = fillerCount;
            longestPauseEl.textContent = longestPause.toFixed(1) + 's';
            confidenceEl.textContent = (highestConfidence * 100).toFixed(1) + '%';
        } else {
            transcriptEl.textContent = transcriptText + interimTranscript;
        }
    };

    function startStopRecognition() {
        if (recognizing) {
            recognition.stop();
        } else {
            recognition.start();
        }
    }

    micButton.addEventListener('click', startStopRecognition);
    micButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startStopRecognition();
        }
    });
}

// Initialize first prompt on load
setPrompt(currentPromptIndex);

function extractJsonFromCodeBlock(text) {
    if (!text) return '';
    // Remove starting ```json or ```
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
    // Remove trailing ```
    text = text.replace(/```\s*$/, '');
    return text.trim();
}

async function getSpeechReview(transcript) {
    // Current stable model name
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyC9nR1VuCI9MIrrAEXQNFhg9e_o7vazvxY`;

    const body = {
        contents: [
            {
                parts: [
                    {
                        // 🌟 REVISED PROMPT TEXT AND JSON STRUCTURE 🌟
                        text: `You are a public speaking coach. Analyze the following speech and respond ONLY in JSON format like this:
{
  "clarity": "...",
  "structure": "...",
  "filler_words": "...",    
  "enthusiasm": "...",
  "sentiment": "{category} ({probability}%)", 
  "suggestions": "...",
  "score": "X/10"
}
For the "sentiment" field, determine the dominant emotion (e.g., "Positive", "Neutral", "Excited", "Confident", "Anxious", "Frustrated", "Sad") and estimate its probability as a percentage based on the text's tone, content, and word choice. The format MUST be "{category} ({probability}%)".
In the "suggestions" field, if you think the user would benefit, recommend one or more of these modules from our app: Professional Coaching Modules, Articulation Exercises, Breathing Exercises, Tongue Twisters, Expert and Coach Consultation, Regular Meets, Community Practice Rooms, Speech Challenge Tournaments. Be specific about which and why.
Here is the speech:
"${transcript}"`
                        // 🌟 END OF REVISIONS 🌟
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            // Enhanced logging for better debugging (as suggested previously)
            const errorBody = await response.text(); 
            console.error('API Error Response Status:', response.status);
            console.error('API Error Response Body:', errorBody);
            throw new Error(`API request failed with status: ${response.status}. See console for details.`);
        }

        const data = await response.json();
        const reviewRaw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        // Log the raw response for debugging parsing issues
        console.log('Gemini Raw Response Text:', reviewRaw); 

        try {
            // NOTE: You still need to ensure 'extractJsonFromCodeBlock' is defined!
            const cleanJson = extractJsonFromCodeBlock(reviewRaw);
            const reviewJson = JSON.parse(cleanJson);
            return reviewJson;
        } catch (e) {
            console.error('Failed to parse Gemini JSON:', reviewRaw);
            return null;
        }

    } catch (error) {
        console.error('Error getting review:', error);
        throw error; 
    }
}
function highlightModules(text) {
    if (!text) return '';
    const modules = [
        "Professional Coaching Modules",
        "Articulation Exercises",
        "Breathing Exercises",
        "Tongue Twisters",
        "Expert and Coach Consultation",
        "Regular Meets",
        "Community Practice Rooms",
        "Speech Challenge Tournaments"
    ];
    modules.forEach(module => {
        text = text.replace(
            new RegExp(module, 'g'),
            `<span style="font-weight:bold; color:#2563eb;">${module}</span>`
        );
    });
    return text;
}


async function analyzeSpeech(transcript) {
    loadingEl.classList.remove('hidden');
    // Ensure retryBtn is defined or passed in scope if it's not global
    const retryBtn = document.getElementById('retryBtn'); 
    if (retryBtn) retryBtn.classList.add('hidden');

    // Clear old review
    document.getElementById('clarity-text').textContent = 'Waiting...';
    document.getElementById('structure-text').textContent = 'Waiting...';
    document.getElementById('filler-text').textContent = 'Waiting...';
    document.getElementById('enthusiasm-text').textContent = 'Waiting...';
    // 🌟 ADDED: Reset the new Sentiment card 🌟
    document.getElementById('sentiment-text').textContent = 'Waiting...'; 
    
    document.getElementById('suggestions-text').textContent = 'Waiting...';
    document.getElementById('score-text').textContent = '- /10';

    try {
        const review = await getSpeechReview(transcript);
        loadingEl.classList.add('hidden');
        if (review) {
            document.getElementById('clarity-text').textContent = review.clarity || 'No data';
            document.getElementById('structure-text').textContent = review.structure || 'No data';
            document.getElementById('filler-text').textContent = review.filler_words || 'No data';
            document.getElementById('enthusiasm-text').textContent = review.enthusiasm || 'No data';
            
            // 🌟 ADDED: Populate the new Sentiment card 🌟
            document.getElementById('sentiment-text').textContent = review.sentiment || 'No data'; 
            
            document.getElementById('suggestions-text').innerHTML = highlightModules(review.suggestions) || 'No data';
            document.getElementById('score-text').textContent = review.score || '- /10';
        } else {
            document.getElementById('clarity-text').textContent = 'Error loading review.';
            if (retryBtn) retryBtn.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error getting review:', error);
        loadingEl.classList.add('hidden');
        document.getElementById('clarity-text').textContent = 'Error analyzing speech.';
        if (retryBtn) retryBtn.classList.remove('hidden');
    }
}



// Retry button listener
document.addEventListener('DOMContentLoaded', () => {
    const retryBtn = document.getElementById('retryBtn');

    if (retryBtn) { // Always good to double check!
        retryBtn.addEventListener('click', () => {
            if (transcriptText.trim().length > 0) {
                analyzeSpeech(transcriptText.trim());
            }
        });
    } else {
        console.error('retryBtn not found!');
    }
});


