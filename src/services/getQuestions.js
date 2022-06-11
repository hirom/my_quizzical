function getQuestions(gameOptions) {
	const { category, difficulty, type } = gameOptions;

	let categoryParam = "";
	let difficultyParam = "";
	let typeParam = "";

	if (category !== "") {
		categoryParam = `&category=${category}`;
	}

	if (difficulty !== "") {
		difficultyParam = `&difficulty=${difficulty}`;
	}

	if (type !== "") {
		typeParam = `&type=${type}`;
	}

	let apiUrl = `https://opentdb.com/api.php?amount=5${categoryParam}${difficultyParam}${typeParam}`;

	return fetch(apiUrl)
		.then((res) => res.json())
		.then((data) => data.results);
}

export default getQuestions;
