import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Form from '../routes/form';

const App = () => (
	<div id="app">
		<Header />
		<Router>
			<Home path="/" />
			<Form path="/form" />
		</Router>
	</div>
)

export default App;
