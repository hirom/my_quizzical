import React from "react";
import { nanoid } from "nanoid";
import getQuestions from "../../services/getQuestions";
import Question from "../Question/Question";
import "./QuestionList.css";

function QuestionList({
	gameOptions,
	handleGameStart,
	handleNoQuestionsError,
}) {
	const [questionsArray, setQuestionsArray] = React.useState([]);
	const [checkAnswerBtn, setCheckAnswerBtn] = React.useState(false);
	const [correctAnswerCount, setCorrectAnswersCount] = React.useState(0);
	const [isGameOver, setIsGameOver] = React.useState(false);

	const allQuestionsAnswered = questionsArray.every(
		(question) => question !== ""
	);

	React.useEffect(() => {
		getQuestions(gameOptions).then((questions) => {
			if (questions.length === 0) {
				handleGameStart();
			}

			return setQuestionsArray(
				questions.map((question) => {
					return {
						...question,
						id: nanoid(),
						selectedAnswer: "",
						showAnswer: false,
					};
				})
			);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (questionsArray.length !== 0 && allQuestionsAnswered) {
			let correctAnswers = 0;

			questionsArray.forEach((question) => {
				if (question.correct_answer === question.selectedAnswer)
					correctAnswers++;
			});

			setCorrectAnswersCount(correctAnswers);
			setCheckAnswerBtn(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [questionsArray]);

	const handleSelectAnswer = (questionId, answer) => {
		if (!isGameOver) {
			setQuestionsArray((prevQuestionsArray) =>
				prevQuestionsArray.map((question) =>
					question.id === questionId
						? { ...question, selectedAnswer: answer }
						: question
				)
			);
		}
	};

	const checkAnswers = () => {
		if (allQuestionsAnswered) {
			setIsGameOver(true);

			setQuestionsArray((prevQuestionsArray) =>
				prevQuestionsArray.map((question) => ({
					...question,
					showAnswer: true,
				}))
			);
		}
	};

	function resetGame() {
		setCheckAnswerBtn(false);
		setIsGameOver(false);
		handleGameStart();
	}

	const questionElements = questionsArray.map((question) => (
		<Question
			key={question.id}
			id={question.id}
			selectedAnswer={question.selectedAnswer}
			showAnswer={question.showAnswer}
			category={question.category}
			type={question.type}
			difficulty={question.difficulty}
			question={question.question}
			correctAnswer={question.correct_answer}
			incorrectAnswers={question.incorrect_answers}
			handleSelectAnswer={handleSelectAnswer}
		/>
	));

	return (
		<section className="questionList-container">
			{questionElements}
			<div className="bottom-container">
				{isGameOver && (
					<h3 className="correct-answers-text">
						you scored {correctAnswerCount}/5 correct answers
					</h3>
				)}

				<button
					className={`btn-primary ${
						checkAnswerBtn ? "btn--check-answers" : "btn-check-answers-disbled"
					}`}
					onClick={isGameOver ? resetGame : checkAnswers}
				>
					{isGameOver ? "Play Again" : "Check Answers"}
				</button>
			</div>
		</section>
	);
}

export default QuestionList;
