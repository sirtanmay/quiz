"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import questions from "@/public/questions.json";
import { answerQuestion, nextLevel, restartLevel } from "@/redux/quizSlice";
import { useRouter } from "next/navigation";

export default function Quiz() {
	const { level, currentQuestionIndex, correctAnswers, isGameOver } =
		useSelector((state) => state.quiz);
	const dispatch = useDispatch();
	const router = useRouter();
	const [selectedAnswer, setSelectedAnswer] = useState("");
	const [showFeedback, setShowFeedback] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState("");

	useEffect(() => {
		if (isGameOver) {
			router.push("/end");
		}
	}, [isGameOver, router]);

	useEffect(() => {
		setSelectedAnswer("");
	}, [currentQuestionIndex]);

	const currentQuestions = questions[level];
	const currentQuestion = currentQuestions[currentQuestionIndex];
	const totalQuestions = Object.values(questions).flat().length;
	const totalAnsweredQuestions =
		Object.keys(questions)
			.slice(0, Object.keys(questions).indexOf(level))
			.reduce((acc, key) => acc + questions[key].length, 0) +
		currentQuestionIndex +
		1;

	const progress = (totalAnsweredQuestions / totalQuestions) * 100;

	const handleSubmit = () => {
		if (!currentQuestion) return;

		let isCorrect = false;

		if (currentQuestion.type === "text-input") {
			isCorrect =
				selectedAnswer.replace(/ /g, "").trim().toLowerCase() ===
				currentQuestion.correctAnswer.toLowerCase();
		} else {
			isCorrect = selectedAnswer === currentQuestion.correctAnswer;
		}

		setShowFeedback(true);
		setFeedbackMessage(isCorrect ? "Correct!" : "Incorrect!");

		setTimeout(() => {
			setShowFeedback(false);
			dispatch(answerQuestion({ isCorrect }));

			const updatedCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);

			if (currentQuestionIndex === currentQuestions.length - 1) {
				if (updatedCorrectAnswers >= 2) {
					dispatch(nextLevel());
				} else {
					alert(
						"You need at least 2 correct answers to progress to the next level."
					);
					dispatch(restartLevel());
				}
			}
		}, 1000);
	};

	return (
		<div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-10">
			<div className="w-full max-w-md bg-gray-700 rounded-full h-3 mb-4">
				<div
					className="bg-blue-500 h-3 rounded-full transition-all"
					style={{ width: `${progress}%` }}
				></div>
			</div>
			<h2 className="md:text-xl font-bold mb-2 text-center">Level: {level}</h2>
			{currentQuestion ? (
				<>
					<h2 className="md:text-2xl mb-4 text-center">
						{currentQuestion.question}
					</h2>
					{currentQuestion.type === "multiple-choice" && (
						<div className="flex flex-col">
							{currentQuestion.options.map((option, index) => (
								<button
									key={index}
									onClick={() => setSelectedAnswer(option)}
									className={`px-6 py-2 my-1 rounded-lg hover:bg-gray-800 transition-all ${
										selectedAnswer === option ? "bg-blue-500" : "bg-gray-700"
									}`}
								>
									{option}
								</button>
							))}
						</div>
					)}
					{currentQuestion.type === "true-false" && (
						<div className="flex flex-row gap-2">
							<button
								onClick={() => setSelectedAnswer("true")}
								className={`px-6 py-2 my-1 rounded-lg hover:bg-gray-800 transition-all ${
									selectedAnswer === "true" ? "bg-green-500" : "bg-gray-700"
								}`}
							>
								True
							</button>
							<button
								onClick={() => setSelectedAnswer("false")}
								className={`px-6 py-2 my-1 rounded-lg hover:bg-gray-800 transition-all ${
									selectedAnswer === "false" ? "bg-red-500" : "bg-gray-700"
								}`}
							>
								False
							</button>
						</div>
					)}
					{currentQuestion.type === "text-input" && (
						<div className="flex flex-col">
							<input
								type="text"
								value={selectedAnswer}
								onChange={(e) => setSelectedAnswer(e.target.value)}
								className="px-6 py-2 my-1 rounded-lg bg-gray-700"
							/>
						</div>
					)}
				</>
			) : (
				<h2 className="text-xl font-bold">No more questions available</h2>
			)}

			{showFeedback && (
				<p
					className={`text-lg font-semibold mt-4 ${
						feedbackMessage === "Correct!" ? "text-green-400" : "text-red-400"
					}`}
				>
					{feedbackMessage}
				</p>
			)}

			<button
				onClick={handleSubmit}
				className="mt-6 px-6 py-2 bg-green-600 rounded-lg"
			>
				Submit
			</button>
		</div>
	);
}
