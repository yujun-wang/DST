/**
* niceDate - Convert any date into a nice string
*/
app.filter('niceDate', function() {
	return function(value) {
		if (!value)
			return;

		var date = moment(value);
		if (date.get('hours') == 0 && date.get('minutes') == 0) {
			return date.format('D/M/YY');
		} else {
			return date.format('H:mma D/M/YY');
		}
	};
});
