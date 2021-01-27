import { h } from 'preact';
import { Language } from '../../components/app'
import { useContext, useEffect, useState} from "preact/hooks";
import { Text } from 'preact-i18n';
import Graph from './graph'
import style from './style.css';

// Note: `user` comes from the URL, courtesy of our router
const Form = props => {
	const lang = useContext(Language);

	function handleSubmit(e) {
		console.log(e)
	}

	return (
		<div class={style.form}>
			<h1><Text id="form.title">Form</Text></h1>
			<p><Text id="form.content">Form presentation...</Text></p>
			<form onSubmit={handleSubmit}>
				<label for="lang-select"><Text id="form.lang-select">Language</Text>:</label>
				<select name="lang" value={lang} id="lang-select" onChange={e => props.swapLang(e.target.value)}>
					<option value="en">English</option>
					<option value="fr">Français</option>
				</select>
				<h2><Text id="form.part">Part</Text> I</h2>
				<p><Text id="form.part1.description">Description of the first part...</Text></p>
				<Graph 
					labelTop={<Text id="form.part1.q1.top">I'm happy</Text>}
					labelBottom={<Text id="form.part1.q1.bottom">I'm unhappy</Text>}
					labelLeft={<Text id="form.part1.q1.left">I'm young</Text>}
					labelRight={<Text id="form.part1.q1.right">I'm old</Text>}
					/>
				<button type="submit"><Text id="form.submit">Submit</Text></button>
			</form>
		</div>
	);
}

export default Form;
