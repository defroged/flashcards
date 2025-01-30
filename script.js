// **********************************
// 1) Firebase config & initialization
// **********************************

// (If you already have these scripts in your HTML, you do not need to add them again, 
// but you do need to ensure these lines run somewhere in your JS.)

const firebaseConfig = {
  apiKey: "AIzaSyCTdo6AfCDj3yVCnndBCIOrLRm7oOaDFW8",
  authDomain: "bs-class-database.firebaseapp.com",
  projectId: "bs-class-database",
  storageBucket: "bs-class-database.firebasestorage.app",
  messagingSenderId: "577863988524",
  appId: "1:577863988524:web:dc28f58ed0350419d62889"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// **********************************
// 2) Fallback data if no slug is provided
// **********************************
const fallbackCardsData = [
  {
    jp: "ゾウ",
    en: "elephant",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/elephant.mp3",
    sentenceEn: "The elephant is drinking water from the river.",
    sentenceJp: "ゾウが川の水を飲んでいます。"
  },
  {
    jp: "犬",
    en: "dog",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/dog.mp3",
    sentenceEn: "The dog is catching the ball.",
    sentenceJp: "犬がボールをキャッチしています。"
  },
  {
    jp: "魚",
    en: "fish",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/fish.mp3",
    sentenceEn: "The fish is swimming in the pond.",
    sentenceJp: "魚が池の中を泳いでいます。"
  },
  {
    jp: "猫",
    en: "cat",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/cat.mp3",
    sentenceEn: "The cat is sleeping under the tree.",
    sentenceJp: "猫が木の下で寝ています。"
  },
  // ... (rest of your hard‐coded objects) ...
  {
    jp: "跳ぶ",
    en: "jumping",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/jumping.mp3",
    sentenceEn: "The rabbit is jumping over the fence.",
    sentenceJp: "ウサギがフェンスを飛び越えています。"
  }
];

// We'll use the same audio for all example sentences for now
const exampleSentenceAudio = "https://www.bluestar-english.com/wp-content/uploads/2020/05/brush-my-teeth.mp3";

// **********************************
// 3) Variables for deck management
// **********************************
let cardsData = [];
let currentDeck = [];
let incorrectDeck = [];
let currentIndex = 0;
let currentSide = 1;
let correctCount = 0;

const cardEl = document.getElementById('card');
const side1El = document.getElementById('side1');
const side2El = document.getElementById('side2');
const side3El = document.getElementById('side3');
const scoreScreen = document.getElementById('score-screen');
const scoreText = document.getElementById('score-text');
const successScreen = document.getElementById('success-screen');

// For swipe detection
let touchStartX = 0;
let touchStartY = 0;

// **********************************
// 4) Utility: shuffle array
// **********************************
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// **********************************
// 5) Main init flow
// **********************************
// ***********************
// Replace init() and fetchDataFromFirestore():
// ***********************

async function init() {
  // Get all path segments, ignoring empty ones
  const pathSegments = window.location.pathname.split("/").filter(Boolean);

  // If we have at least 2 segments, we assume the first is "classSlug" and the second is "timeSlug"
  if (pathSegments.length >= 2) {
    const classSlug = pathSegments[0];
    const timeSlug = pathSegments[1];

    // Attempt Firestore fetch with those slugs
    const fetchedData = await fetchDataFromFirestore(classSlug, timeSlug);

    // If nothing returned, fallback to your hard-coded data
    if (fetchedData.length === 0) {
      cardsData = fallbackCardsData;
    } else {
      cardsData = fetchedData;
    }
    startDeck();
  } 
  else {
    // If we don’t have 2 segments, fallback to the hard-coded data
    cardsData = fallbackCardsData;
    startDeck();
  }
}

async function fetchDataFromFirestore(classSlug, timeSlug) {
  try {
    // We'll read: "Academic-classes" / classSlug / "Submissions" / timeSlug / "Vocabulary"
    const subcollectionRef = db
      .collection("Academic-classes")
      .doc(classSlug)
      .collection("Submissions")
      .doc(timeSlug)
      .collection("Vocabulary");

    const querySnapshot = await subcollectionRef.get();
    const results = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Map the fields to the structure your flashcards need:
      results.push({
        jp: data.japanese || "",
        en: data.english || "",
        enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/jumping.mp3", // placeholder
        sentenceEn: data.englishExample || "",
        sentenceJp: data.japaneseExample || ""
      });
    });

    return results;
  } catch (error) {
    console.error("Error fetching Firestore data:", error);
    return [];
  }
}


// **********************************
// 7) Once we have cardsData, build the deck
// **********************************
function startDeck() {
  currentDeck = shuffleArray([...cardsData]);
  incorrectDeck = [];
  currentIndex = 0;
  correctCount = 0;
  currentSide = 1;
  scoreScreen.style.display = "none";
  successScreen.style.display = "none";

  updateCardContent();
}

function updateCardContent() {
  // If we've gone through all cards in the current deck
  if (currentIndex >= currentDeck.length) {
    // If all cards were marked correct, show success right away
    if (correctCount === currentDeck.length) {
      successScreen.style.display = "block";
    } else {
      // Otherwise, show the score screen
      const scorePercent = Math.floor((correctCount / currentDeck.length) * 100);
      scoreText.textContent = `Score: ${correctCount} of ${currentDeck.length} = ${scorePercent}%`;
      scoreScreen.style.display = "block";
    }
    return;
  }

  const cardData = currentDeck[currentIndex];

  side1El.textContent = cardData.jp;

  // side2 with text + audio
  side2El.innerHTML = `
    <div>
      <p>${cardData.en}</p>
      <button class="play-button" onclick="playAudio('${cardData.enAudio}')">Play</button>
    </div>
  `;

  // side3 with example sentence + audio
  side3El.innerHTML = `
    <div>
      <p>${cardData.sentenceEn}</p>
      <p>${cardData.sentenceJp}</p>
      <button class="play-button" onclick="playAudio('${exampleSentenceAudio}')">Play</button>
    </div>
  `;

  // Reset to side1 (Japanese)
  currentSide = 1;
  cardEl.style.transform = "rotateY(0deg)";
}

// **********************************
// 8) Audio playback
// **********************************
function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}

// **********************************
// 9) Tap/click events to flip or restart decks
// **********************************
document.body.addEventListener('click', (e) => {
  // If we are on the score screen and user taps:
  if (scoreScreen.style.display === "block") {
    scoreScreen.style.display = "none";
    // Repeat only the incorrect deck:
    currentDeck = shuffleArray([...incorrectDeck]);
    incorrectDeck = [];
    currentIndex = 0;
    correctCount = 0;
    updateCardContent();
    return;
  }

  // If we are on the success screen and user taps => restart from scratch
  if (successScreen.style.display === "block") {
    // Start again with the same deck (no new Firestore fetch unless user refreshes)
    startDeck();
    return;
  }

  // If user clicked on a play button, do NOT flip
  if (e.target.classList.contains("play-button")) {
    return;
  }

  flipCard();
});

function flipCard() {
  currentSide++;
  if (currentSide > 3) {
    currentSide = 1;
  }

  if (currentSide === 2) {
    // Show side2 by rotating the card -120°
    cardEl.style.transform = "rotateY(-120deg)";
  } else if (currentSide === 3) {
    // Show side3 by rotating the card -240°
    cardEl.style.transform = "rotateY(-240deg)";
  } else {
    // Back to side1 (0°)
    cardEl.style.transform = "rotateY(0deg)";
  }
}

// **********************************
// 10) Touch events for swipe
// **********************************
document.body.addEventListener('touchstart', (e) => {
  // Disable swipe detection if score screen or success screen is active
  if (scoreScreen.style.display === "block" || successScreen.style.display === "block") {
    return;
  }

  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
});

document.body.addEventListener('touchend', (e) => {
  // Disable swipe detection if score screen or success screen is active
  if (scoreScreen.style.display === "block" || successScreen.style.display === "block") {
    return;
  }

  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  const threshold = 50; // minimum distance for a swipe

  // Check if horizontal or vertical is dominant
  if (absDeltaX > absDeltaY && absDeltaX > threshold) {
    if (deltaX < 0) {
      // Swipe left => mark correct
      markCardCorrect();
    }
  } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
    if (deltaY > 0) {
      // Swipe down => mark incorrect
      markCardIncorrect();
    }
  }
});

// **********************************
// 11) Mark cards correct or incorrect
// **********************************
function markCardCorrect() {
  showCheckmark("✔", "limegreen");
  correctCount++;
  currentIndex++;
  updateCardContent();
}

function markCardIncorrect() {
  showCheckmark("✘", "red");
  incorrectDeck.push(currentDeck[currentIndex]);
  currentIndex++;
  updateCardContent();
}

function showCheckmark(symbol, color = "limegreen") {
  const mark = document.createElement('div');
  mark.classList.add('checkmark');
  mark.style.color = color;
  mark.textContent = symbol;
  document.body.appendChild(mark);
  setTimeout(() => {
    document.body.removeChild(mark);
  }, 1000);
}

// **********************************
// 12) Kick things off on page load
// **********************************
init();
