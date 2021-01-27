import { h } from 'preact';
import style from './style.css';
import { Text } from 'preact-i18n';

const Results = () => (
	<div class={style.results}>
		<h1><Text id="results.title">Results</Text></h1>
		<p><Text id="results.content">Project presentation...</Text></p>
	</div>
);

export default Results;
