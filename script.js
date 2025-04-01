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
// 3) Variables for deck management

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

// Ensure screens are hidden properly on page load
window.onload = () => {
  scoreScreen.style.visibility = "hidden";
  scoreScreen.style.opacity = "0";
  successScreen.style.visibility = "hidden";
  successScreen.style.opacity = "0";
};

// For swipe detection
let touchStartX = 0;
let touchStartY = 0;

// 4) Utility: shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 5) Main init flow

async function init() {
  const pathSegments = window.location.pathname.split("/").filter(Boolean);

  if (pathSegments.length >= 2) {
    const classSlug = pathSegments[0];
    const timeSlug = pathSegments[1];

    const fetchedData = await fetchDataFromFirestore(classSlug, timeSlug);

    if (fetchedData.length === 0) {
      alert("⚠️ データが見つかりませんでした。クラスと時間を確認してください。");
      return;
    }

    cardsData = fetchedData;
    startDeck();
  } else {
    alert("⚠️ URLが正しくありません。クラスと時間の情報が必要です。");
    return;
  }
}


async function fetchDataFromFirestore(classSlug, timeSlug) {
  try {
    // We'll read the single doc:
    // Academic-classes / classSlug / Submissions / timeSlug
    const docRef = db
      .collection("Academic-classes")
      .doc(classSlug)
      .collection("Submissions")
      .doc(timeSlug);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.log("No such document:", classSlug, timeSlug);
      return [];
    }

    // We'll assume the doc has a field "Vocabulary" that is an array
    const data = docSnap.data();
    const vocabArray = data.Vocabulary || []; // or possibly data.vocabulary

    console.log("Vocabulary array length:", vocabArray.length);

    const results = [];

vocabArray.forEach((item) => {
  results.push({
    jp: item.japanese || "",
    en: item.english || "",
    enAudio: item.enAudio || "", 
    sentenceEn: item.englishExample || "",
    sentenceJp: item.japaneseExample || ""
  });
});

    return results;
  } catch (error) {
    console.error("Error fetching Firestore data:", error);
    return [];
  }
}

// 7) Once we have cardsData, build the deck

function startDeck() {
  console.log("🚀 startDeck() started");
  console.log("🔍 Current Deck Before Shuffle:", cardsData);

  currentDeck = shuffleArray([...cardsData]);
  console.log("🔀 Shuffled Deck:", currentDeck);
  incorrectDeck = [];
  currentIndex = 0;
  correctCount = 0;
  currentSide = 1;
  
  // Reset ending screens and ensure card container is visible
  scoreScreen.style.visibility = "hidden";
  scoreScreen.style.opacity = "0";
  scoreScreen.style.display = "none";
  successScreen.style.visibility = "hidden";
  successScreen.style.opacity = "0";
  document.getElementById('card-container').style.display = "block";

  updateCardContent();
}

function updateCardContent() {
  // Update the progress display at the start of every update
  updateProgressDisplay();

  console.log("🃏 updateCardContent() called");
  console.log("📌 Current Index:", currentIndex);
  console.log("🃏 Current Deck Length:", currentDeck.length);
  // If we've gone through all cards in the current deck
  if (currentIndex >= currentDeck.length) {
    console.warn("⚠️ No more cards left in the deck!");
    // Hide the card container to avoid accidental taps on the last card
    document.getElementById('card-container').style.display = "none";
    // If all cards were marked correct, show the success screen
    if (correctCount === currentDeck.length) {
      successScreen.style.visibility = "visible";
      successScreen.style.opacity = "1";
    } else {
      // Otherwise, show the score screen with the percentage
      const scorePercent = Math.floor((correctCount / currentDeck.length) * 100);
      scoreText.textContent = `Score: ${correctCount} of ${currentDeck.length} = ${scorePercent}%`;
      scoreScreen.style.display = "flex";  // use flex per the CSS defaults
      scoreScreen.style.visibility = "visible";
      scoreScreen.style.opacity = "1";
    }
    return;
  }
  const cardData = currentDeck[currentIndex];
  console.log("🎴 Card Data at Index:", cardData);
  console.log(`🔊 Audio URL for card #${currentIndex}:`, cardData.enAudio);

  side1El.textContent = cardData.jp;

  side2El.innerHTML = `
    <div>
      <p>${cardData.en}</p>
      <button class="play-button" onclick="playAudio('${cardData.enAudio}')">
        <i class="fa-solid fa-headphones"></i>
      </button>
    </div>
  `;

  side3El.innerHTML = `
    <div>
      <p>${cardData.sentenceEn}</p>
      <p>${cardData.sentenceJp}</p>
    </div>
  `;

  // Reset to side1 (Japanese) without initial animation
  currentSide = 1;
  cardEl.style.transition = "none";
  cardEl.style.transform = "rotateY(0deg)";
  void cardEl.offsetWidth;
  cardEl.style.transition = "transform 0.6s ease";
}

// 8) Audio playback

function playAudio(url) {
  console.log("🎵 playAudio() called with URL:", url);
  if (!url) {
    console.warn("🚨 No audio URL provided!");
    return;
  }
  const audio = new Audio(url);
  audio.play();
}

// 9) Tap/click events to flip or restart decks

document.body.addEventListener('click', (e) => {
  // If we are on the score screen and user taps:
  if (scoreScreen.style.display === "flex") {
    scoreScreen.style.display = "none";
    // Show the card container again for the next cycle
    document.getElementById('card-container').style.display = "block";
    // Repeat only the incorrect deck:
    currentDeck = shuffleArray([...incorrectDeck]);
    incorrectDeck = [];
    currentIndex = 0;
    correctCount = 0;
    updateCardContent();
    return;
  }

  // If we are on the success screen and user taps => restart from scratch
  if (successScreen.style.visibility === "visible") {
    successScreen.style.visibility = "hidden";
    successScreen.style.opacity = "0";
    // Show the card container again
    document.getElementById('card-container').style.display = "block";
    startDeck();
    return;
  }

  // Check if click happened inside the play button or its children (icon inside button)
  const playButton = e.target.closest(".play-button");
  if (playButton) {
    return; // Prevent flipping when play button is clicked
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

// 10) Touch events for swipe

document.body.addEventListener('touchstart', (e) => {
  // Disable swipe detection if score screen or success screen is active
  if (scoreScreen.style.display === "flex" || successScreen.style.visibility === "visible") {
    return;
  }

  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
});


document.body.addEventListener('touchend', (e) => {
  // Disable swipe detection if score screen or success screen is active
  if (scoreScreen.style.display === "flex" || successScreen.style.visibility === "visible") {
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
    } else if (deltaX > 0) {
      // Swipe right => undo last mark and go back one card
      undoLastMark();
    }
  } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
    if (deltaY > 0) {
      // Swipe down => mark incorrect
      markCardIncorrect();
    }
  }
});

// 11) Mark cards correct or incorrect

function markCardCorrect() {
  showCheckmark("✅", "limegreen");
  // Record the user's mark in the card object
  currentDeck[currentIndex].userMark = "correct";
  correctCount++;
  currentIndex++;

  // Prevent flip animation if the card was flipped
  const wasFlipped = currentSide !== 1;
  currentSide = 1; // Reset side
  updateCardContent();

  if (wasFlipped) {
    // Instantly reset without animation
    cardEl.style.transition = "none";
    cardEl.style.transform = "rotateY(0deg)";

    // Restore transition after a short delay
    setTimeout(() => {
      cardEl.style.transition = "transform 0.6s ease";
    }, 50);
  }
}

function markCardIncorrect() {
  showCheckmark("✘", "red");
  // Record the user's mark in the card object
  currentDeck[currentIndex].userMark = "incorrect";
  incorrectDeck.push(currentDeck[currentIndex]);
  currentIndex++;
  updateCardContent();
}

function undoLastMark() {
  // Check if there's a previous card to undo
  if (currentIndex <= 0) {
    console.warn("No previous card to undo.");
    return;
  }
  // Move back one card
  currentIndex--;
  const previousCard = currentDeck[currentIndex];

  // Undo the mark if it exists
  if (previousCard.userMark === "correct") {
    correctCount--;
  } else if (previousCard.userMark === "incorrect") {
    // Remove the card from the incorrectDeck (remove the last occurrence)
    const idx = incorrectDeck.lastIndexOf(previousCard);
    if (idx !== -1) {
      incorrectDeck.splice(idx, 1);
    }
  }
  // Clear the user's mark for this card
  previousCard.userMark = undefined;

  // Reset the card view to side1
  currentSide = 1;
  cardEl.style.transition = "none";
  cardEl.style.transform = "rotateY(0deg)";
  setTimeout(() => {
    cardEl.style.transition = "transform 0.6s ease";
  }, 50);

  updateCardContent();
}

function showCheckmark(symbol, color) {
  const mark = document.createElement('div');
  mark.classList.add('checkmark');

  if (color === "red") {
    mark.classList.add("incorrect"); 
  } else {
    mark.classList.add("correct"); 
  }

  mark.textContent = symbol;
  document.body.appendChild(mark);

  setTimeout(() => {
    document.body.removeChild(mark);
  }, 1000);
}

function updateProgressDisplay() {
  const progressTextEl = document.getElementById('progress-text');
  if (!progressTextEl) return;
  const total = currentDeck.length;
  // Ensure we never exceed the total number of cards.
  const progress = Math.min(currentIndex, total);
  // Calculate success rate based on progress (avoid division by zero)
  const successRate = progress > 0 ? Math.floor((correctCount / progress) * 100) : 0;
  progressTextEl.textContent = `${progress} / ${total}, 正解率: ${successRate}%`;
}

// 12) Kick things off on page load via Start button

document.getElementById('start-button').addEventListener('click', () => {
  // Hide the start screen
  document.getElementById('start-screen').style.display = "none";
  // Hide the modal just in case it's open
  document.getElementById('instructions-modal').style.display = "none";
  // Show the card container
  document.getElementById('card-container').style.display = "block";
  // Initialize the flashcards app
  init();
});

// 13) Show the instructions modal if やり方 button is clicked

document.getElementById('help-button').addEventListener('click', () => {
  // Show the instructions modal
  document.getElementById('instructions-modal').style.display = "block";
});

// 14) Close the modal when the close-button (×) is clicked

document.getElementById('close-instructions').addEventListener('click', () => {
  document.getElementById('instructions-modal').style.display = "none";
});
