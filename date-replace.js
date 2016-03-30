var fs = require('fs'),
    path = require('path'),
    root = path.resolve(__dirname, './');

require('date-utils');

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
    'use strict';

    var lang = 'nl',
        l10n;

    return {
        setL10n: setL10n,
        replace: replace
    };

    function setL10n(newLang) {
        try{
            l10n = fs.readFileSync(root + '/l10n/' + newLang + '.json', 'utf8');
            l10n = JSON.parse(l10n);
            lang = newLang;
        }catch(e) {
            throw "Language not found";
        }
    }

    function l10nReplace(match) {
        match = match.replace(/<<month:(\d+)>>/g, function(match, month) {
            return l10n.months[month-1];
        });

         match = match.replace(/<<monthShort:(\d+)>>/g, function(match, month) {
            return l10n.monthsShort[month-1];
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
            l10Replace = false;

        if (props.length === 2) {
            dateAdd = props[0].replace(/['"]/g, '');
            dateFormat = props[1].replace(/['"]/g, '').replace(' ', '').toUpperCase();

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

            if(addObject.days !== 0) {
                if(addObject.days > 0) {
                    today.addDays(addObject.days);
                } else {
                    today.removeDays(addObject.days);
                }
            }

            if(addObject.months !== 0) {
                if(addObject.months > 0) {
                    today.addMonths(addObject.months);
                } else {
                    today.removeMonths(addObject.months);
                }
            }

            if(addObject.years !== 0) {
                if(addObject.years > 0) {
                    today.addYears(addObject.years);
                } else {
                    today.removeYears(addObject.years);
                }
            }

        } else {
            dateFormat = props[0].replace(/['"]/g, '').replace(' ', '').toUpperCase();
        }

        if (dateFormat.indexOf('MMMLONG') > -1) {
            l10Replace = true;
            dateFormat = dateFormat.replace('MMMLONG', '<<month:M>>');
        }

        if (dateFormat.indexOf('MMMSHORT') > -1) {
            l10Replace = true;
            dateFormat = dateFormat.replace('MMMSHORT', '<<monthShort:M>>');
        }

        dateReturn = today.toFormat(dateFormat);
        if (l10Replace) {
            dateReturn = l10nReplace(dateReturn);
        }
        return dateReturn;
    }


}

module.exports = dateReplace;
