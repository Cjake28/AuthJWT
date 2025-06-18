
import {app} from './app';

const PORT = process.env.PORT;

app.listen(PORT || 8081, () => {
	console.log(`Server running on port ${PORT}`);
});
