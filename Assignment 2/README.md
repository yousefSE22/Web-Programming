# A2 Quiz
1. Add a representative image for the assignment and start with a short description of your solution:
![ALT](image.png) 
I created a simple quiz website which presents users with a series of questions, takes their answers and interacts with a server which then grades their answers and provides them with a new question if they get it right. The UI is simple and easy to understand, making sure that the user faces no difficulties when going through the quiz.

2. Explain how a user can download and start your game:
After cloning the repository, the user has multiple options to run and play the game. The user can use the "Live server" extension to run the website, which is the easiest way. The user can also use the "npm run http-server" command to run the game from their terminal on their local host. 

3. Shortly explain the rules of the game, so the user knows how to play it.:
Once you run the game, you will be greated with the startup page where you need to provide a nickname to start the game. After you start the game, you have a timer of 10 seconds to finish each question. There are 2 types of questions: 1. Questions where you need to type in an answer. 2. Multiple choice questions where you need to choose the correct answer. When typing in the answer pressing submit answer or hitting the enter key will submit the answer. For the multiple choice question, you have to pick one of the answers and press submit, do not worry your choice will not be sumbitted unless you press submit. When a new question appears the timer resets, and you have 10 seconds to answer the new question. If you answer a question wrong or you run out of time, you will be presented with the respective message and the quiz will end, meaning that you have to start over. There is a total of 7 questions, when all of them are completed correctly you pass the quiz, and you can then view the highscore table to see how long it took you to finish the test, in addition to where you rank. Feel free to redo the test more and more to try and get a new highscore, if you break your old score your new score will be saved, if not, you will keep your best attempt score saved.  

4. Explain how to execute the linters that are part of the development environment and how to execute them.

To execute all the linters at once, you can type "npm run test" in your terminal which will run a test of the linters on your code. 