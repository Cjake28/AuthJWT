
import {app} from './app';

const PORT = process.env.PORT;

app.listen(PORT || 9220, () => {
	console.log(`Server running on port ${PORT}`);
});
