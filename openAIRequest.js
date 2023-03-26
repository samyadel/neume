import EventSource from "react-native-sse";
import { OPENAI_API_KEY } from "@env";

let es;

export { es };

export default function openAIRequest(
	messages,
	setState,
	setDone,
	setLoading,
	setError
) {
	const apiKey = OPENAI_API_KEY;
	const url = new URL("https://api.openai.com/v1/chat/completions");

	es = new EventSource(url, {
		method: "POST",
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages,
			temperature: 0,
			max_tokens: 2048,
			stream: true,
		}),
		headers: {
			Accept: "text/event-stream",
			"Content-Type": "application/json",
			Authorization: "Bearer " + apiKey,
		},
	});

	let str = "";

	const listener = (event) => {
		if (event.type === "open") {
			console.log("Open SSE connection.");
		} else if (event.type === "message") {
			const data = event.data;
			if (data != "[DONE]") {
				const response = JSON.parse(data).choices[0].delta.content;

				if (response) {
					str += response;
					setState(str);
				}
			} else {
				setDone(true);
				setLoading(false);

				es.removeAllEventListeners();
				es.close();
			}
		} else if (event.type === "error") {
			console.error("Connection error:", event.message);
			str = "";
			setState("");
			setError("connection");
		} else if (event.type === "exception") {
			console.error("Error:", event.message, event.error);
			setError("exception");
		} else if (event.type === "close") {
			console.log("Connection closed");
			setLoading(false);
		}
	};

	es.addEventListener("open", listener);
	es.addEventListener("message", listener);
	es.addEventListener("error", listener);
	es.addEventListener("close", listener);

	return () => {
		es.close();
		es.removeAllEventListeners();
	};
}
