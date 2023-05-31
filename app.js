// import path from 'path';
// import express from 'express';
// import {engine} from 'express-handlebars';

// const appFolder = `${path.resolve()}/cubi.st`;
// const cubistApp = express();
// const env = process.env.NODE_ENV || 'development';

// const titleVars = {
// 	siteName: 'Cubist',
// 	strapLine: `A speed cubing timer`,
// 	suffix: (env === 'development' ? ' :: DEV' : ''),
// };

// const strap = `${titleVars.strapLine}${titleVars.suffix}`;
// const title = `${titleVars.siteName} :: ${strap}`;

// cubistApp.engine('hbs', engine({
// 	extname: 'hbs',
// }));
// cubistApp.set('views', `${appFolder}/views`);
// cubistApp.set('view engine', 'hbs');
// cubistApp.use(express.static(`${appFolder}/public`));

// const renderPage = (res, page, isDebug) => {
// 	const debugClass = (isDebug ? 'debug' : '');
// 	res.setHeader('Cache-Control', 'max-age=1');
// 	res.setHeader('Content-Security-Policy', `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://storage.ko-fi.com`);
// 	res.render(page, {
// 		title,
// 		headline: titleVars.siteName,
// 		strapLine: strap,
// 		env,
// 		debugClass,
// 	});
// };

// cubistApp.get('/', (req, res) => {
// 	renderPage(res, 'index', false);
// });

// cubistApp.get('/:page?', (req, res) => {
// 	const page = req.params.page;

// 	if (page === 'debug') {
// 		renderPage(res, 'index', true);
// 	}

// 	if (['help', 'settings'].includes(page)) {
// 		renderPage(res, page, false);
// 	}
// });

// export {cubistApp};
