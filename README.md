# flashcards

I would like you to help me create a flashcards web application in HTML/CSS and JavaScript.
I am using Vercel and GitHub, and pushing the commits using Terminal on my PC.
The app should be designed for use with mobile devices with touch/swipe gestures.
The content for the flashcards (words, meanings, example sentences and sounds) will be dynamically added, but this functionality will be implemented in the future. For now I would like to hard code the contents for initial testing purposes.
Each flashcard will have 3 "sides":
1st side - Japanese translation of the word/phrase (text).
2nd side - English word/phrase (text and audio).
3rd side - Example sentence in English, and its Japanese translation under it (text for both, and audio for the English).
Flow of events:
1. The app shows the first "side" of the card (Japanese translation of the first word/phrase), and the user tries to say the answer in English.
2. The user then taps the screen once to reveal the second side (English word/phrase). This side will have the text for the English and a play button for the audio of the narration of this English word/phrase.
3. The user can then tap again to reveal the third side which contains the example sentence in English, followed by its Japanese translation, and a play button for the audio of the English example sentence.
4. If the user was able to say the correct definition in English (to themselves), they can then swipe right to mark the card as correct. If they are not able to say the correct answer to themselves, they can swipe down to mark the card as incorrect.
5. Once the user has gone through all of the cards, a screen is shown with the percentage of correct answers (e.g., if the user got 5 correct out of 20 cards, it will show a 25% score like so - "Score: 5 of 20 = 25%").
6. The user then taps the screen, and the app then repeats the whole process but this time only showing the cards that the user did not get (the cards that were marked as incorrect).
7. The whole process repeats itself until the user marks all of the cards as correct, at which point the app shows a success screen.
* The card order should always be random for each phase. So when the user starts studying, the order shown is randomized, and when the user finishes marking the words as correct or incorrect to move on to the next cycle showing the incorrect words, this cycle should be random again and not show the cards in the same order as the first cycle. This should happen every cycle.
* The user can tap the screen as many times as they wish to flip the card and see all of its three sides over and over if they wish.
* There should be a page flip animation every time the user taps the cards to reveal its other sides.
* The background of the app should be black, and the text and audio play button should be white.
* When the user marks a card as correct by swiping right, a green check mark should appear at the top and fade out.
* The app visuals of card flipping and progressing should look and feel smooth.
* I will provide you with URLs for the audio of the English words, but not the example sentences, so please just use the same audio for all of them for now (https://www.bluestar-english.com/wp-content/uploads/2020/05/brush-my-teeth.mp3).

Here are 15 words, Japanese translations, example sentences in English/Japanese, and corresponding audio files that should be hard coded to the script for initial testing purposes:

Card 1

side 1 (Japanese translation of word/phrase):
"ゾウ"

side 2 (English word/phrase):
"elephant" audio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/elephant.mp3"

side 3 (example sentence in English and Japanese):
The elephant is drinking water from the river.
ゾウが川の水を飲んでいます。

Card 2

Side 1 (Japanese translation of word/phrase):
"犬"

Side 2 (English word/phrase):
"dog" audio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/dog.mp3"

Side 3 (example sentence in English and Japanese):
The dog is catching the ball.
犬がボールをキャッチしています。

Card 3

Side 1 (Japanese translation of word/phrase):
"魚"

Side 2 (English word/phrase):
"fish" audio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/fish.mp3"

Side 3 (example sentence in English and Japanese):
The fish is swimming in the pond.
魚が池の中を泳いでいます。
Card 4

Side 1 (Japanese translation of word/phrase):
"猫"

Side 2 (English word/phrase):
"cat" audio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/cat.mp3"

Side 3 (example sentence in English and Japanese):
The cat is sleeping under the tree.
猫が木の下で寝ています。
Card 5

Side 1 (Japanese translation of word/phrase):
"ケーキ"

Side 2 (English word/phrase):
"cake" audio: "https://www.bluestar-english.com/wp-content/uploads/2022/07/cake.mp3"

Side 3 (example sentence in English and Japanese):
She is baking a delicious cake.
彼女がおいしいケーキを焼いています。
Card 6

Side 1 (Japanese translation of word/phrase):
"濡れている"

Side 2 (English word/phrase):
"wet" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/wet.mp3"

Side 3 (example sentence in English and Japanese):
My clothes are wet because of the rain.
雨のせいで服が濡れています。
Card 7

Side 1 (Japanese translation of word/phrase):
"地図"

Side 2 (English word/phrase):
"map" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/map.mp3"

Side 3 (example sentence in English and Japanese):
He is looking at a map to find the way.
彼は道を探すために地図を見ています。
Card 8

Side 1 (Japanese translation of word/phrase):
"ニワトリ"

Side 2 (English word/phrase):
"hen" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/hen.mp3"

Side 3 (example sentence in English and Japanese):
The hen is laying eggs in the barn.
ニワトリが納屋で卵を産んでいます。
Card 9

Side 1 (Japanese translation of word/phrase):
"ハム"

Side 2 (English word/phrase):
"ham" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/ham.mp3"

Side 3 (example sentence in English and Japanese):
We had ham sandwiches for lunch.
昼ごはんにハムサンドを食べました。
Card 10

Side 1 (Japanese translation of word/phrase):
"登る"

Side 2 (English word/phrase):
"climbing" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/climbing.mp3"

Side 3 (example sentence in English and Japanese):
They are climbing the mountain together.
彼らは一緒に山を登っています。
Card 11

Side 1 (Japanese translation of word/phrase):
"捕まえる"

Side 2 (English word/phrase):
"catching" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/catching.mp3"

Side 3 (example sentence in English and Japanese):
The children are catching butterflies in the field.
子どもたちが野原で蝶を捕まえています。
Card 12

Side 1 (Japanese translation of word/phrase):
"歩く"

Side 2 (English word/phrase):
"walking" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/walking.mp3"

Side 3 (example sentence in English and Japanese):
She is walking to school every morning.
彼女は毎朝学校まで歩いています。
Card 13

Side 1 (Japanese translation of word/phrase):
"スキップする"

Side 2 (English word/phrase):
"skipping" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/skipping.mp3"

Side 3 (example sentence in English and Japanese):
The kids are skipping rope in the park.
子どもたちが公園で縄跳びをしています。
Card 14

Side 1 (Japanese translation of word/phrase):
"走る"

Side 2 (English word/phrase):
"running" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/running.mp3"

Side 3 (example sentence in English and Japanese):
The boys are running around the playground.
男の子たちが遊び場を走り回っています。
Card 15

Side 1 (Japanese translation of word/phrase):
"跳ぶ"

Side 2 (English word/phrase):
"jumping" audio: "https://www.bluestar-english.com/wp-content/uploads/2020/05/jumping.mp3"

Side 3 (example sentence in English and Japanese):
The rabbit is jumping over the fence.
ウサギがフェンスを飛び越えています。

If you are uncertain about anything, please ask me questions that will help you better understand the task in hand.
At the very end of your response, please add a short commit message of up to four words (use abbreviations and omit unnecessary words if necessary). 
