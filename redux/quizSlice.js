import { createSlice } from "@reduxjs/toolkit";
import questions from "@/public/questions.json";

const initialState = {
	level: "Easy",
	currentQuestionIndex: 0,
	score: { easy: 0, medium: 0, hard: 0 },
	correctAnswers: 0,
	isGameOver: false,
};

const shuffleArray = (array) => {
	return array.sort(() => Math.random() - 0.5);
};

const quizSlice = createSlice({
	name: "quiz",
	initialState,
	reducers: {
		answerQuestion: (state, action) => {
			const { isCorrect } = action.payload;
			if (isCorrect) {
				state.score[state.level.toLowerCase()] +=
					state.level === "Easy" ? 10 : state.level === "Medium" ? 20 : 30;
				state.correctAnswers++;
			}
			state.currentQuestionIndex++;
		},
		nextLevel: (state) => {
			if (state.level === "Easy") state.level = "Medium";
			else if (state.level === "Medium") state.level = "Hard";
			else state.isGameOver = true;

			state.currentQuestionIndex = 0;
      state.correctAnswers = 0;
      
      state.shuffledQuestions = shuffleArray([...questions[state.level]]);
		},
		restartLevel: (state) => {
			state.currentQuestionIndex = 0;
			state.correctAnswers = 0;
		},
		restartGame: () => initialState,
	},
});

export const { answerQuestion, nextLevel, restartLevel, restartGame } =
	quizSlice.actions;
export default quizSlice.reducer;
