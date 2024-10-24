async function main() {
	const url = 'https://dev-nakama.winterpixel.io/v2/rpc/query_leaderboard_around_user';

	const data = `\"{\\\"leaderboard\\\":\\\"tankkings_trophies\\\",\\\"season\\\":35}\"`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI3YmI0Y2I0NS1iODU4LTQ5MWUtOTkwNC05NTAxODQ2MGY1ODYiLCJ1c24iOiJMSFJVVmlOdnJOIiwidnJzIjp7ImNsaWVudF92ZXJzaW9uIjoiNjYiLCJwbGF0Zm9ybSI6IkhUTUw1In0sImV4cCI6MTcyOTc5MTcwN30.SNowWgD304DKG3nT21P2z27QfHHe9W43wfZ_EOGmcdE',
			'Content-Type': 'application/json',
		},
		body: data,
	});

	const text = await response.json();

	let content = JSON.parse(JSON.parse(JSON.stringify(text)).payload);

	console.log(content);
	// console.log(text);
}

