//
// Additional formats for ChartNew.js
//
// see https://github.com/FVANCOP/ChartNew.js/wiki/900_010_format.js
//
function fmtChartJSPerso(config, value, fmt) {
	var return_value, spltdt; 
	switch (fmt.split(/[\s,]+/)[0].toUpperCase()) {
		case "FIXEDDECIMAL":
		case "DECIMAL":
			var spltdt = Math.round(fmt.split(/[\s,]+/)[1]);
			var roundVal;
			if (spltdt <= 0) {
				roundVal = -spltdt;
				return_value = +(Math.round(value + "e+" + roundVal) + "e-" + roundVal);
				// Force number of decimals;
				if(fmt.split(/[\s,]+/)[0].toUpperCase()=="FIXEDDECIMAL") return_value=return_value.toFixed(Math.abs(spltdt));
			} else {
				roundVal = spltdt;
				var divval = "1e+" + roundVal;
				return_value = +(Math.round(value / divval)) * divval;
			}
			if (config.decimalSeparator != "." || config.thousandSeparator != "") {
				return_value = value.toString().replace(/\./g, config.decimalSeparator);
				if (config.thousandSeparator != "") {
					var part1 = return_value;
					var part2 = "";
					var posdec = part1.indexOf(config.decimalSeparator);
					if (posdec >= 0) {
						part2 = part1.substring(posdec + 1, part1.length);
						part2 = part2.split('').reverse().join(''); // reverse string
						part1 = part1.substring(0, posdec);
					}
					part1 = part1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
					part2 = part2.split('').reverse().join(''); // reverse string
					return_value = part1
					if (part2 != "") return_value = return_value + config.decimalSeparator + part2;
				}
			}
			break;
		case "ABBREVIATENUMBER":
			return_value = value;
			if (typeof(value) == "number") {
				return_value = abbreviateNumber(value);
			}
			break;
		case "DATE":
			spltdt = fmt.replace(/,/g, " ").replace(/:/g, " ").split(/[\s,]+/);
			var options = new Array();
			for (var i = 1; i < spltdt.length; i++) {
				switch (spltdt[i].toUpperCase()) {
					case "WEEKDAY":
					case "YEAR":
					case "MONTH":
					case "DAY":
						options[spltdt[i]] = spltdt[i + 1];
						break;
					default:
						break;
				}
			}
			return_value = value.toLocaleDateString(fmt.split(" ")[1], options);
			break;
		case "FMTDATE":
			spltdt = fmt.split(/[\s,]+/)[1].toUpperCase();
			return_value = spltdt.replaceArray(["DD", "MM", "YYYY", "YY"], [value.getDate(), 1 + value.getMonth(), value.getFullYear(), value.getYear() % 100]);
			break;
		case "TIME":
			return_value = value.toLocaleTimeString();
			break;
		case "FMTTIME":
			spltdt = fmt.split(/[\s,]+/)[1].toUpperCase();
			return_value = spltdt.replaceArray(["HH", "MM", "SS"], [
				value.getHours() < 10 ? '0' + value.getHours() : value.getHours(),
				value.getMinutes() < 10 ? '0' + value.getMinutes() : value.getMinutes(),
				value.getSeconds() < 10 ? '0' + value.getSeconds() : value.getSeconds()
			]);
			break;
		case "FMTDATETIME":
			spltdt = fmt.splitLimit(/[\s,]+/, 2)[1];
			return_value = spltdt.replaceArray(["DD", "MM", "YYYY", "YY", "HH", "mm", "ss"], [
				value.getDate(), 1 + value.getMonth(), value.getFullYear(), value.getYear() % 100,
				value.getHours() < 10 ? '0' + value.getHours() : value.getHours(),
				value.getMinutes() < 10 ? '0' + value.getMinutes() : value.getMinutes(),
				value.getSeconds() < 10 ? '0' + value.getSeconds() : value.getSeconds()
			]);
			break;
		default:
			return_value = value;
			break;
	}
	return (return_value);
}

function abbreviateNumber(num) {
	var suffixes = ["", "k", "m", "b","t"];
	var sign = num > 0 ? 1 : -1;
	if (num < 1000 && num > -1000 ) return num;
	var i = parseInt(Math.floor(Math.log(Math.abs(num)) / Math.log(1000)));
	return ((i % 1 == 0 ) ? (num / Math.pow(1000, i)) : (num / Math.pow(1000, i)).toFixed(1)) + '' + suffixes[i];
};

String.prototype.replaceArray = function(find, replace) {
	var replaceString = this;
	var regex;
	for (var i = 0; i < find.length; i++) {
		regex = new RegExp(find[i], "g");
		replaceString = replaceString.replace(regex, replace[i]);
	}
	return replaceString;
};
/**
 * split a string into an array with limit entries
 * The last entry contains the last part of the string, which can contain the separator)
 * @param separator {string} string separator
 * @param limit {integer} number of entries in the array
 * @return array of separated strings
 */
String.prototype.splitLimit = function(separator, limit) {
	var splitString = this;
	var result = [];
	var pos = splitString.search(separator);
	if (pos < 0) return false;
	result.push(splitString.substring(0, pos));
	result.push(splitString.substring(pos + 1));
	return result;
}
