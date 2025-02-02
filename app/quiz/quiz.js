"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import questions from "@/public/questions.json";
import {
	answerQuestion,
	goToNextQuestion,
	goToPreviousQuestion,
	nextLevel,
	restartLevel,
} from "@/redux/quizSlice";
import { useRouter } from "next/navigation";

export default function Quiz() {
	const {
		level,
		currentQuestionIndex,
		selectedAnswer,
		correctAnswer,
		correctAnswers,
		isGameOver,
	} = useSelector((state) => state.quiz);
	const dispatch = useDispatch();
	const router = useRouter();
	const [userAnswer, setUserAnswer] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		if (isGameOver) {
			router.push("/end");
		}
	}, [isGameOver, router]);

	useEffect(() => {
		setUserAnswer("");
		setIsSubmitted(false);
	}, [currentQuestionIndex]);

	useEffect(() => {
		console.log("Selected Answer:", selectedAnswer);
		console.log("Correct Answer:", correctAnswer);
	}, [selectedAnswer, correctAnswer]);

	const currentQuestions = questions[level];
	const currentQuestion = currentQuestions[currentQuestionIndex];

	const handleSubmit = () => {
		if (!currentQuestion || isSubmitted) return;
		setIsSubmitted(true);

		let isCorrect = false;
		if (currentQuestion.type === "text-input") {
			isCorrect =
				userAnswer.replace(/  /g, " ").trim().toLowerCase() ===
				currentQuestion.correctAnswer.replace(/  /g, " ").trim().toLowerCase();
			console.log(
				userAnswer.trim().toLowerCase() ===
					currentQuestion.correctAnswer.trim().toLowerCase(),
				"--------------"
			);
		} else {
			isCorrect = userAnswer === currentQuestion.correctAnswer;
		}

		console.log(isCorrect, "+++++++++++");

		dispatch(
			answerQuestion({
				selectedAnswer: userAnswer,
				correctAnswer: currentQuestion.correctAnswer,
			})
		);
	};

	const handleNext = () => {
		if (currentQuestionIndex === currentQuestions.length - 1) {
			if (correctAnswers >= 2) {
				dispatch(nextLevel());
			} else {
				alert("You need at least 2 correct answers to progress.");
				dispatch(restartLevel());
			}
		} else {
			dispatch(goToNextQuestion());
		}
	};

	const handlePrevious = () => {
		dispatch(goToPreviousQuestion());
	};

	return (
		<div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-10">
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
									onClick={() => setUserAnswer(option)}
									className={`px-6 py-2 my-1 rounded-lg transition-all ${
										userAnswer === option
											? "bg-blue-500"
											: "bg-gray-700 hover:bg-gray-800"
									}`}
									disabled={isSubmitted}
								>
									{option}
								</button>
							))}
						</div>
					)}

					{currentQuestion.type === "true-false" && (
						<div className="flex flex-row gap-2">
							<button
								onClick={() => setUserAnswer("true")}
								className={`px-6 py-2 my-1 rounded-lg transition-all ${
									userAnswer === "true"
										? "bg-green-500"
										: "bg-gray-700 hover:bg-gray-800"
								}`}
								disabled={isSubmitted}
							>
								True
							</button>
							<button
								onClick={() => setUserAnswer("false")}
								className={`px-6 py-2 my-1 rounded-lg transition-all ${
									userAnswer === "false"
										? "bg-red-500"
										: "bg-gray-700 hover:bg-gray-800"
								}`}
								disabled={isSubmitted}
							>
								False
							</button>
						</div>
					)}

					{currentQuestion.type === "text-input" && (
						<div className="flex flex-col">
							<input
								type="text"
								value={userAnswer}
								onChange={(e) => setUserAnswer(e.target.value)}
								className="px-6 py-2 my-1 rounded-lg bg-gray-700"
								disabled={isSubmitted}
							/>
						</div>
					)}

					<div className="flex gap-4 my-6">
						{currentQuestionIndex > 0 && (
							<button
								onClick={handlePrevious}
								className="px-6 py-2 bg-gray-600 rounded-lg"
							>
								←
							</button>
						)}
						{!isSubmitted ? (
							<button
								onClick={handleSubmit}
								className="px-6 py-2 bg-green-600 rounded-lg"
							>
								Submit
							</button>
						) : (
							<button
								onClick={handleNext}
								className="px-6 py-2 bg-blue-600 rounded-lg"
							>
								→
							</button>
						)}
					</div>

					{isSubmitted && (
						<p
							className={`text-lg font-semibold ${
								selectedAnswer?.toLowerCase() === correctAnswer?.toLowerCase()
									? "text-green-400"
									: "text-red-400"
							}`}
						>
							{selectedAnswer?.toLowerCase() === correctAnswer?.toLowerCase()
								? "Correct!"
								: `Incorrect! Correct Answer: ${correctAnswer}`}
						</p>
					)}
				</>
			) : (
				<h2 className="text-xl font-bold">No more questions available</h2>
			)}
		</div>
	);
}
