import { h } from 'preact';
import { Text } from 'preact-i18n';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = (props) => (
	<header class={style.header}>
		<h1>
			<Text id="header.title">Mapping Poll</Text> </h1>
		<nav>
			<Link activeClassName={style.active} href="/"><Text id="header.home">Home</Text></Link>
			<Link actuveClassName={style.active} href="/results"><Text id="header.results">Results</Text></Link>
			<Link activeClassName={style.active} href="/form"><Text id="header.form">Form</Text></Link>
			<a href="#" onclick={() => props.swapLang()}><Text id="header.lang">fr</Text></a>
		</nav>
	</header>
);

export default Header;
