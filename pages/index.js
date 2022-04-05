import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home(props) {
	const [data, setData] = useState();
	const [image, setImage] = useState("");
	const [temp, setTemp] = useState();
	const [output, setOutput] = useState();

	useEffect(() => {
		(async () => {
			const res = await axios.get("/api/getImages");
			setData(res.data);
		})();
	}, []);

	const handleInputChange = (e) => {
		const reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = function (e) {
			setImage(e.target.result);
		};
	};

	const handleClick = (obj) => {
		console.log(obj.public_id);
		setTemp(obj.public_id);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		(async function uploadImage() {
			try {
				const response = await axios.post("/api/upload", {
					img: image,
					tempId: temp,
				});
				const d = /'(.+)'/.exec(response.data);
				console.log(d[1]);
				setOutput(d[1]);
			} catch (error) {
				console.log(error);
			}
		})();
	};

	return (
		<div className={styles.app}>
			<h1>Artwork style transfer app</h1>
			<div className={styles.container}>
				<div className={styles.sideBar}>
					<h4>Select an image</h4>
					<div>
						{!data ? (
							<p>Loading..</p>
						) : (
							data.map((obj) => (
								<div key={obj.public_id} onClick={() => handleClick(obj)}>
									<img
										src={obj.secure_url}
										className={temp === obj.public_id ? `${styles.border}` : ""}
									></img>
								</div>
							))
						)}
					</div>
				</div>
				<div className={styles.upload}>
					<h4>Upload your image</h4>
					<input type="file" onChange={handleInputChange}></input>
					<div>{!image ? "" : <img src={image}></img>}</div>
				</div>
				<div className={styles.process}>
					<button
						className={styles.button}
						onClick={handleSubmit}
						disabled={!temp || !image}
					>
						Generate artwork
					</button>
					<div>{output ? <img src={output}></img> : ""}</div>
				</div>
			</div>
		</div>
	);
}
