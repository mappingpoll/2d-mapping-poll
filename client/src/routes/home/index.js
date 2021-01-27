import { h } from 'preact';
import style from './style.css';
import { Text } from 'preact-i18n';

const Home = () => (
	<div class={style.home}>
		<h1><Text id="home.title">Home</Text></h1>
		<p><Text id="home.content">Project presentation...</Text></p>
	</div>
);

export default Home;