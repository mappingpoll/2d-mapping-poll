import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import style from './style.css';

// Note: `user` comes from the URL, courtesy of our router
const Form = () => {

	return (
		<div class={style.profile}>
			<h1>Form</h1>
			<p>formulaire</p>

			<form>
				<input type="email"/>
				<input type="submit"/>
			</form>
		</div>
	);
}

export default Form;
