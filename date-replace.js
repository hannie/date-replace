var fs = require('fs');

/**
 * @name replaceDates
 *
 * @param match {String} a Date string like "${date("-2m", "MMMLONG")} "
 * @return {String} Date formatted string
 * @description
 * Used for test data, replaces date functions with the required date in a certain format
 * You can also subtract weeks/months/years
 */
function dateReplace() {
    var lang = 'nl',
        l10n;

    return {
        setL10n: setL10n,
        replace: replace
    };

    function setL10n(newLang) {
        try{
            l10n = fs.readFileSync('l10n/' + newLang + '.json', 'utf8');
            l10n = JSON.parse(l10n);
            lang = newLang;
        }catch(e) {
            throw "Language not found";
        }
    }

    function l10nReplace(match) {
        match = match.replace(/<<month:(\d+)>>/g, function(match, month) {
            return l10n.months[month];
        });

        match = match.replace(/<<day:(\d+)>>/g, function(match, day) {
            return l10n.days[day];
        });

        return match;
    }

    function replace(match) {
        if(!l10n) {
            setL10n(lang);
        }

        var cleanedMatch = match.replace('${date(', '').replace(')}', ''),
            props = cleanedMatch.split(','),
            today = Date.today(),

            dateFormat,
            dateAdd,
            dateReturn,
            addObject = {
                days: 0,
                months: 0,
                years: 0
            },
            mmmlong = false;

        if (props.length === 2) {
            dateAdd = props[0].replace(/"/g, '');
            dateFormat = props[1].replace(/"/g, '').replace(' ', '').toUpperCase();

            if (dateAdd.indexOf('d') > 0) {
                dateAdd = parseInt(dateAdd.replace('d', ''));
                addObject.days = dateAdd;

            } else if (dateAdd.indexOf('m') > 0) {
                dateAdd = parseInt(dateAdd.replace('m', ''));
                addObject.months = dateAdd;

            } else if (dateAdd.indexOf('y') > 0) {
                dateAdd = parseInt(dateAdd.replace('y', ''));
                addObject.years = dateAdd;
            }

            today.add(addObject);

        } else {
            dateFormat = props[0].replace(/"/g, '').replace(' ', '').toUpperCase();
        }

        if (dateFormat.indexOf('MMMLONG') > -1) {
            mmmlong = true;
            dateFormat = dateFormat.replace('MMMLONG', '<<month:M>>');
        }

        dateReturn = today.toFormat(dateFormat);
        if (mmmlong) {
            dateReturn = l10nReplace(dateReturn);
        }
        return dateReturn;
    }


}

module.exports = dateReplace;