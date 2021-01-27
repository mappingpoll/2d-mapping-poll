import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import { Text } from 'preact-i18n';
import style from './style.css';

// Note: `user` comes from the URL, courtesy of our router
const Form = () => {

	return (
		<div class={style.form}>
			<h1><Text id="form.title">Form</Text></h1>
			<p><Text id="form.content">Form presentation...</Text></p>
		</div>
	);
}

export default Form;
