require('')

function mmlongReplace(dstring) {
    var localMonths = [];
    localMonths.Jan = 'januari';
    localMonths.Feb = 'februari';
    localMonths.Mar = 'maart';
    localMonths.Apr = 'april';
    localMonths.May = 'mei';
    localMonths.Jun = 'juni';
    localMonths.Jul = 'juli';
    localMonths.Aug = 'augustus';
    localMonths.Sep = 'september';
    localMonths.Oct = 'oktober';
    localMonths.Nov = 'november';
    localMonths.Dec = 'december';
    for (var lm in localMonths) {
        dstring = dstring.replace(lm, localMonths[lm]);
    }
    return dstring;
}

/**
 * @name replaceDates
 *
 * @param match {String} a Date string like "${date("-2m", "MMMLONG")} "
 * @return {String} Date formatted string
 * @description
 * Used for test data, replaces date functions with the required date in a certain format
 * You can also subtract weeks/months/years
 */
function dateReplace(match) {
    var cleanedMatch = match.replace('${date(','').replace(')}',''),
        props = cleanedMatch.split(','),
        today = Date.today(),

        dateFormat,
        dateAdd,
        dateReturn,
        addObject = { days: 0,
            months: 0,
            years: 0},
        mmmlong = false;

    if (props.length === 2) {
        dateAdd = props[0].replace(/"/g,'');
        dateFormat = props[1].replace(/"/g,'').replace(' ','').toUpperCase();
        if (dateAdd.indexOf('d')>0) {
            dateAdd = parseInt(dateAdd.replace('d',''));
            addObject.days = dateAdd;
        } else if (dateAdd.indexOf('m')>0) {
            dateAdd = parseInt(dateAdd.replace('m',''));
            addObject.months = dateAdd;
        } else if (dateAdd.indexOf('y')>0) {
            dateAdd = parseInt(dateAdd.replace('y',''));
            addObject.years = dateAdd;
        }

        today.add(addObject);
    } else {
        dateAdd = false;
        dateFormat = props[0].replace(/"/g,'').replace(' ','').toUpperCase();
    }

    // Parse MMMLONG format: Dutch Long Months:
    if (dateFormat.indexOf('MMMLONG') > -1) {
        mmmlong = true;
        dateFormat = dateFormat.replace('MMMLONG', 'MMM');
    }

    dateReturn = today.toFormat(dateFormat);
    if (mmmlong) {
        dateReturn = mmlongReplace(dateReturn);
    }
    return dateReturn;
}

module.exports = dateReplace;