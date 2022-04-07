import {useState} from "react";
import axios from "axios";
import styles from "../styles/Home.module.css"

export default function ProcessImage({ temp, targetImage }) {
  const [output, setOutput] = useState();

	const handleSubmit = (e) => {
		e.preventDefault();
		(async function uploadImage() {
			try {
				const response = await axios.post("/api/upload", {
					img: targetImage,
					tempId: temp,
				});
				const d = /'(.+)'/.exec(response.data);
				setOutput(d[1]);
			} catch (error) {
				console.log(error);
			}
		})();
	};

	return (
		<div className={styles.process}>
			<button
				className={styles.button}
				onClick={handleSubmit}
				disabled={!temp || !targetImage}
			>
				Generate artwork
			</button>
			<div>{output && <img src={output} alt="output-image" />}</div>
		</div>
	);
}
