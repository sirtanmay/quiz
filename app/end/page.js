"use client";

import { restartGame } from "@/redux/quizSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function EndScreen() {
	const { score } = useSelector((state) => state.quiz);
	const dispatch = useDispatch();
	const router = useRouter();

	return (
		<div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
			<h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
			<p className="text-lg">Easy: {score.easy} points</p>
			<p className="text-lg">Medium: {score.medium} points</p>
			<p className="text-lg">Hard: {score.hard} points</p>
			<h2 className="text-2xl font-bold m-4">
				Total Score: {score.easy + score.medium + score.hard} / 180 points!
			</h2>
			<button
				onClick={() => {
					dispatch(restartGame());
					router.push("/");
				}}
				className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-black hover:ring-offset-2"
			>
				<span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
				<div className="flex items-center">
					<span className="ml-1 text-white">Restart Quiz?</span>
				</div>
				<div className="ml-2 flex items-center gap-1 text-sm md:flex"></div>
			</button>
		</div>
	);
}
