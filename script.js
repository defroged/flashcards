// Hard-coded flashcard data
const cardsData = [
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
  {
    jp: "ケーキ",
    en: "cake",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/cake.mp3",
    sentenceEn: "She is baking a delicious cake.",
    sentenceJp: "彼女がおいしいケーキを焼いています。"
  },
  {
    jp: "濡れている",
    en: "wet",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/wet.mp3",
    sentenceEn: "My clothes are wet because of the rain.",
    sentenceJp: "雨のせいで服が濡れています。"
  },
  {
    jp: "地図",
    en: "map",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/map.mp3",
    sentenceEn: "He is looking at a map to find the way.",
    sentenceJp: "彼は道を探すために地図を見ています。"
  },
  {
    jp: "ニワトリ",
    en: "hen",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/hen.mp3",
    sentenceEn: "The hen is laying eggs in the barn.",
    sentenceJp: "ニワトリが納屋で卵を産んでいます。"
  },
  {
    jp: "ハム",
    en: "ham",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/ham.mp3",
    sentenceEn: "We had ham sandwiches for lunch.",
    sentenceJp: "昼ごはんにハムサンドを食べました。"
  },
  {
    jp: "登る",
    en: "climbing",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/climbing.mp3",
    sentenceEn: "They are climbing the mountain together.",
    sentenceJp: "彼らは一緒に山を登っています。"
  },
  {
    jp: "捕まえる",
    en: "catching",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/catching.mp3",
    sentenceEn: "The children are catching butterflies in the field.",
    sentenceJp: "子どもたちが野原で蝶を捕まえています。"
  },
  {
    jp: "歩く",
    en: "walking",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/walking.mp3",
    sentenceEn: "She is walking to school every morning.",
    sentenceJp: "彼女は毎朝学校まで歩いています。"
  },
  {
    jp: "スキップする",
    en: "skipping",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/skipping.mp3",
    sentenceEn: "The kids are skipping rope in the park.",
    sentenceJp: "子どもたちが公園で縄跳びをしています。"
  },
  {
    jp: "走る",
    en: "running",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/running.mp3",
    sentenceEn: "The boys are running around the playground.",
    sentenceJp: "男の子たちが遊び場を走り回っています。"
  },
  {
    jp: "跳ぶ",
    en: "jumping",
    enAudio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/jumping.mp3",
    sentenceEn: "The rabbit is jumping over the fence.",
    sentenceJp: "ウサギがフェンスを飛び越えています。"
  }
];

// We'll use the same audio for all example sentences for now:
const exampleSentenceAudio = "https://www.bluestar-english.com/wp-content/uploads/2020/05/brush-my-teeth.mp3";

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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function init() {
  // Shuffle the main deck
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
    // Show results screen
    const scorePercent = Math.floor((correctCount / currentDeck.length) * 100);
    scoreText.textContent = `Score: ${correctCount} of ${currentDeck.length} = ${scorePercent}%`;
    scoreScreen.style.display = "block";
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

// Play audio (English word or example sentence)
function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}

// Click (tap) to flip among sides
document.body.addEventListener('click', (e) => {
  // If we are on the score screen and user taps:
  if (scoreScreen.style.display === "block") {
    scoreScreen.style.display = "none";
    // If no incorrect cards, user got them all correct => show success
    if (incorrectDeck.length === 0) {
      successScreen.style.display = "block";
    } else {
      // Otherwise repeat only the incorrect deck
      currentDeck = shuffleArray([...incorrectDeck]);
      incorrectDeck = [];
      currentIndex = 0;
      correctCount = 0;
      updateCardContent();
    }
    return;
  }

  // If we are on the success screen and user taps, maybe restart from scratch:
  if (successScreen.style.display === "block") {
    init();
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

// Touchstart
document.body.addEventListener('touchstart', (e) => {
  // Disable swipe detection if score screen or success screen is active
  if (scoreScreen.style.display === "block" || successScreen.style.display === "block") {
    return;
  }

  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
});


// Touchend - determine swipe direction
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

// Initialize on page load
init();
