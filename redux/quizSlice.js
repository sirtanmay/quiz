import { createSlice } from "@reduxjs/toolkit";
import questions from "@/public/questions.json";

const initialState = {
	level: "Easy",
	currentQuestionIndex: 0,
	score: { easy: 0, medium: 0, hard: 0 },
	correctAnswers: 0,
	isGameOver: false,
	selectedAnswer: null,
	correctAnswer: null,
	answeredCorrectly: {},
};

const quizSlice = createSlice({
	name: "quiz",
	initialState,
	reducers: {
		answerQuestion: (state, action) => {
			const { selectedAnswer, correctAnswer } = action.payload;
			state.selectedAnswer = selectedAnswer;
			state.correctAnswer = correctAnswer;

			const isCorrect =
				typeof selectedAnswer === "string" && typeof correctAnswer === "string"
					? selectedAnswer.replace(/  /g, " ").trim().toLowerCase() ===
					  correctAnswer.replace(/  /g, " ").trim().toLowerCase()
					: selectedAnswer === correctAnswer;

			const wasAlreadyCorrect =
				state.answeredCorrectly[state.currentQuestionIndex];

			if (isCorrect && !wasAlreadyCorrect) {
				state.score[state.level.toLowerCase()] +=
					state.level === "Easy" ? 10 : state.level === "Medium" ? 20 : 30;
				state.correctAnswers++;
				state.answeredCorrectly[state.currentQuestionIndex] = true;
			}
		},
		goToNextQuestion: (state) => {
			state.currentQuestionIndex++;
			state.selectedAnswer = null;
			state.correctAnswer = null;
		},
		goToPreviousQuestion: (state) => {
			if (state.currentQuestionIndex > 0) {
				state.currentQuestionIndex--;
				state.selectedAnswer = null;
				state.correctAnswer = null;
			}
		},
		nextLevel: (state) => {
			if (state.level === "Easy") state.level = "Medium";
			else if (state.level === "Medium") state.level = "Hard";
			else state.isGameOver = true;

			state.currentQuestionIndex = 0;
			state.correctAnswers = 0;
			state.answeredCorrectly = {};
		},
		restartLevel: (state) => {
			state.currentQuestionIndex = 0;
			state.correctAnswers = 0;
			state.answeredCorrectly = {};
		},
		restartGame: () => initialState,
	},
});

export const {
	answerQuestion,
	goToNextQuestion,
	goToPreviousQuestion,
	nextLevel,
	restartLevel,
	restartGame,
} = quizSlice.actions;
export default quizSlice.reducer;
