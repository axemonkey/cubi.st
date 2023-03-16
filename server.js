import {cubistApp} from './cubi.st/app.js';

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
	cubistApp.listen(7777);
} else if (env === 'production') {
	cubistApp.listen(process.env.PORT);
}
