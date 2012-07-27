
(function(ex){

	var months = {
		short : ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'],
		long : ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
	};

	Date.prototype.getMonthAbr = function(){
	    if (!Date.prototype.getMonthAbr.months) {
	        Date.prototype.getMonthAbr.months = months.short;
	    }

	    var monthNum = this.getMonth();
	    return Date.prototype.getMonthAbr.months[monthNum];
	};

	Number.prototype.lpad = function(padding){
	    var zeroes = "0";
	    for (var i = 0; i < padding; i++) { zeroes += "0"; }
	    return (zeroes + this.toString()).slice(padding * -1);
	};

	var tryParseInt = function(value, defaultValue){
	  if (!value) return defaultValue;
	  return isNaN(value) ? defaultValue : parseInt(value);
	};

	var createPageTitle = function() {
		var args = Array.prototype.slice.call(arguments, 0);
		var domain = args.shift();
		var title = domain.concat(' - ', args.join(' '));
		return title;
	};

	ex.tryParseInt = tryParseInt;
	ex.months = months;
	ex.createPageTitle = createPageTitle;
})(exports);
