/*!
* @author  Shawn Duenas     github.com/McRawly
* @licensing    (C) Shawn Duenas, for educational purposes, 
*               until I find the appropriate Open Source Licensing Language.
*/

/* 
*  HOW TO USE
*   1) All methods and properties are pinned to the class (all are static)
*      Javascript allows for class prototype overwriting. 
*      Therefore, to change the behavior of the class methods, the class properties,
*      such as location of leap day and names of the months, can be changed directly. 
*      Since this is possible, instances created before this class is modified would
*      have no record of what constants were used to create the instance date. Until
*      I can implement getter and setter functions and automatically remove instances 
*      from the prototype chain, this class should be used like a library. Only use
*      the class (static) function (methods). And feel free to overwrite "global" 
*      (class) variables. 
*/

/* For Future Revisions:
*   1) Consider using instance properties instead of temporary values in all functions.
*      It may make returning values more clear.
*   2) Add get and set methods for Static constants. 
*/

"use strict"; // not needed

class UniformMonth {
    // -------------------------------------------------------------
    // ------------ Static (Class) Variables -----------------------
    // -------------------------------------------------------------
    /* 
    |oldMonths| is a Gregorian Calendar Lookup table
    Column 1: Gregorian Month Name
    Column 2: Nominal Days in that month (non-leap year)
    Column 3: Nominal Cumulative Days from Beginning of Year at Before Beginning of month
    */
    static oldMonthNameCol = 0;
    static oldMonthDayCountCol = 1;
    static oldMonthTotalDaysCol = 2;
    static oldMonths = [
        ["January", 31, 0],
        ["February", 28, 31],
        ["March", 31, 59],
        ["April", 30, 90],
        ["May", 31, 120],
        ["June", 30, 151],
        ["July", 31, 181],
        ["August", 31, 212],
        ["September", 30, 243],
        ["October", 31, 273],
        ["November", 30, 304],
        ["December", 31, 334],
    ];
    
    // Uniform Month Name Lookup
    static uniMonthNamesLabel = "Mid-Summer";
    static UniformMonthNames = {
        "Mid-Summer": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "Sol",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        "End-On": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
            "Sol",
        ],
        "Ordered Latin": [
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
            "January",
            "February",
            "Sol",
        ],
        "Full Latin Ember": [
            "Unember",
            "Biember",
            "Triember",
            "Quadember",
            "Quintember",
            "Hexember",
            "September",
            "October",
            "November",
            "December",
            "Undecember",
            "Duodecember",
            "Tredecember",
        ],
        "Full Latin Mon": [
            "Unimon",
            "Dumon",
            "Trimon",
            "Quadrimon",
            "Quintemon",
            "Hexamon",
            "Septamon",
            "Octomon",
            "Novemon",
            "Decemon",
            "Undecemon",
            "Duodecemon",
            "Tredecemon",
        ],
        "Alphabetical": [
            "Amon",
            "Beemon",
            "Ceemon",
            "Deemon",
            "Emon",
            "Femon",
            "Gemon",
            "Homon",
            "Imon",
            "Jamon",
            "Kamon",
            "Lamon",
            "Mimon",
        ],
        "Gormanian": [
            "March",
            "April",
            "May",
            "June",
            "Quintilis",
            "Sextilis",
            "September",
            "October",
            "November",
            "December",
            "January",
            "February",
            "Gormanuary",
        ],
        "Custom": [
            "Amon",
            "Bmon",
            "Cmon",
            "Dmon",
            "Emon",
            "Fmon",
            "Gmon",
            "Hmon",
            "Imon",
            "Jmon",
            "Kmon",
            "Lmon",
            "Mmon",
        ],
    }
    static newMonthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Sol",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Year Day",
    ]; // will be overwritten
    static newWeekdays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Year Day",
        "Leap Day",
    ]
    // Glennian Proposal: Align year to Winter Solstice, add Leap Day on "Longest day of the year".
    static daysLost = 10; // Winter Solstice: Dec 22 [YYYY] >>> Jan 1 [YYYY+1] (Dec 31 - Dec 22 + 1)
    static leapDay = 183; // Summer Solstice: 28 * 6.5 + 1;


    // -------------------------------------------------------------
    // ------------ Constructor  -----------------------------------
    // -------------------------------------------------------------
    constructor() {
    }

    // -------------------------------------------------------------
    // ------------ Methods  ---------------------------------------
    // -------------------------------------------------------------
    static gregorianToUniform(gregYear, gregMonth, gregDay) {
        // Gorman Date 
        // var uniDay; // [1-28] 0 = Leap Day
        // var uniMonth; // [1-13] 14 = Year Day
        var uniYear = gregYear; // [ex: 2020], but different if calendar changed after that year

        // Nominal Days from beginning of Gregorian year
        const wasLeapYear = UniformMonth.isGregorianLeapYear(gregYear);
        let dayOfGregYear = UniformMonth.nominalDayOfGregYear(gregMonth, gregDay); // includes extra day for leap day

        // Adjust for Leap Year
        if (wasLeapYear && gregMonth > 2) {
            dayOfGregYear += 1;
        }

        // Convert to Nominal Days from beginning of Uniform Year
        var dayOfUniYear = dayOfGregYear + UniformMonth.daysLost; // [11-375] or [11-376] in LY
        let yearLength = 365 + wasLeapYear * 1; // 365 or 366
        if (dayOfGregYear > (yearLength - UniformMonth.daysLost)) {
            uniYear += 1;
        }
        dayOfUniYear = (dayOfUniYear - 1) % yearLength + 1; // [1-365] or [1-366] in LY

        var {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum} = 
        UniformMonth.uniformDateFromUniYearDay(dayOfUniYear, uniYear);

        return {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum};
    }

    static uniformDateFromUniYearDay(dayOfUniYear, uniYear=2019) {

        // Nominal 13-Month Date should work before Leap Day on Leap Years, and all other day all other years
        var { uniMonth, uniDay, uniWeekday } = 
            UniformMonth.nominalUniMonthDayWeekday(dayOfUniYear);

        // Adjust for Leap Years 
        let isLeapYear = UniformMonth.isGregorianLeapYear(uniYear);
        if (isLeapYear) {
            if (dayOfUniYear > UniformMonth.leapDay) {
                dayOfUniYear += -1; // assume normal year by subtracting 1 day
                var { uniMonth, uniDay, uniWeekday } = 
                    UniformMonth.nominalUniMonthDayWeekday(dayOfUniYear); //recalculate
                dayOfUniYear += 1; // revert back to real value
            } else if (dayOfUniYear === UniformMonth.leapDay) { // example: July 2, 2020, set to Leap Day
                uniMonth = 7;
                uniDay = 0;
                uniWeekday = 9;
            } // else use nominal
        }

        // Adjust for Year Day
        if (uniMonth === 14) {
            uniWeekday = 8;
            //uniDay = 1; // implied by math
        }

        // Calculate Week No.
        let uniWeekNum = (uniMonth - 1) * 4 + Math.ceil(uniDay / 7);
        
        // Adjust Week No. for Special Cases
        if (uniWeekday > 7) {
            uniWeekNum = 0;
        }

        // Change Variable Name
        let uniDayNum = dayOfUniYear;

        return {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum};
    }
    
    // For the Uniform Month Calendar, given the days from beginning of year,
    // Returns the nominal (non-leap year) day month and weekday
    // Note: Year Day will be 14, 1
    static nominalUniMonthDayWeekday(dayOfUniYear) {
        let uniMonth = Math.ceil(dayOfUniYear / 28);
        let uniDay = (dayOfUniYear - 1) % 28 +1;
        let uniWeekday = (uniDay - 1) % 7 + 1;
        return {uniMonth, uniDay, uniWeekday};
    }
    
    /* ----------  Converter Helper Functions  --------  */

    // Determines whether the Gregorian year provided was a leap year
    static isGregorianLeapYear(year) {
        let fact = false;
        if (year % 4 === 0) {
            fact = true;
            if ( year % 100 === 0) {
                fact = false;
                if (year % 400 === 0) {
                    fact = true;
                }
            }
        }
        return fact;
    }

    // Given a Gregorian Calendar month and day,
    // Calculate Days from the beginning of the Gregorian Calendar year in a non-leap-year
    // Uses a lookup table defined in "constants" section above
    static nominalDayOfGregYear(month, day) {
        return day + UniformMonth.oldMonths[month-1][UniformMonth.oldMonthTotalDaysCol];
    }

    static toGregDateString(gregYear, gregMonth, gregDay) {
        // Get a string in the format 'WWW mmm dd yyy'
        // Letting the JavaSript Date class handle the Day of Week WWW
        // Works for lang=EN only
        
        // Create Date object referenced to UTC time
        let gregDate = new Date(gregYear, gregMonth-1, gregDay);
        let result = gregDate.toDateString();
        return result.substring(0, 16); // Crop to desired length
    }

    static addGregorianDay(year, month, day, daysAdded=1) {
        // Recursive: risks crashing if stack stack depth < ||daysAdded||
        if (daysAdded == 0) {
            return {year, month, day};
        } else if (daysAdded < 0) {
            return UniformMonth.subtractGregorianDay(year, month, day, -1 * daysAdded);
        } 

        // Add One Day
        day += 1;
        if (day > UniformMonth.oldMonths[month - 1][1]) {
            if (!(UniformMonth.isGregorianLeapYear(year) && month == 2 && day == 29)) {
                day = 1;
                month += 1;
            }
        }
        if (month > 12) {
            month = 1;
            year += 1;
        }

        // Recurse if multiple days required
        if (daysAdded > 1) {
            console.log('recursing')
            return UniformMonth.addGregorianDay(year, month, day, daysAdded - 1);
        }
        return {year, month, day};
    }
    static subtractGregorianDay(year, month, day, daysRemoved=1) {
        // Recursive: risks crashing if stack stack depth < ||daysAdded||
        if (daysRemoved == 0) {
            return {year, month, day};
        } else if (daysRemoved < 0) {
            return UniformMonth.addGregorianDay(year, month, day, -1 * daysRemoved);
        }
        
        // Subtract One Day
        day -= 1;
        if (day < 1) {
            month -= 1;
        }
        if (month < 1) {
            month = 12;
            year -= 1;
        }
        if (day < 1) {
            day = UniformMonth.oldMonths[month-1][1];
            if (UniformMonth.isGregorianLeapYear(year) && month == 2) {
                day += 1;
            }
        }

        // Recurse if multiple days required
        if (daysRemoved > 1) {
            return UniformMonth.subtractGregorianDay(year, month, day, daysRemoved - 1);
        } 
        return {year, month, day};
    }

    /* -------- Uniform Month Day Addition ----------- */
    static uniDateToUniYearDay(year, month, day) {
        // Converts properly IFF:
        //  1) Year Day is (month,day) === (14, 1)
        //  2) Leap Day is (~, day) === (~, 0)

        // Get Leap Year Info
        inLeapYear = UniformMonth.isGregorianLeapYear(year);

        // Convert to day of the Uniform Year
        let uniYearDay = 28 * (month - 1) + day; // 14, 1 ==> 365

        // Adjust for Leap Year
        if (inLeapYear && uniYearDay >= UniformMonth.leapDay) {
            uniYearDay += 1;
        }

        // Adjust for Leap Day
        if (day === 0) {
            uniYearDay = UniformMonth.leapDay;
        }

        return uniYearDay;
    }
    
    static addUniformDay(uniYear, uniMonth, uniDay, daysAdded=1) {
        // Recursive: risks crashing if stack stack depth < ||daysAdded||
        if (daysAdded < 0) {
            return UniformMonth.subtractGregorianDay(uniYear, uniMonth, uniDay, -1 * daysAdded);
        }
        // Days from Beginning of Year
        var uniDayNum = UniformMonth.uniDateToUniYearDay(uniYear, uniMonth, uniDay);
        let isLeapYear = UniformMonth.isGregorianLeapYear(uniYear);
        let yearLength = 365 + isLeapYear * 1;
        // If daysRemoved === 0, calculate 3 outputs not provided as parameters
        var {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum} = 
            UniformMonth.uniformDateFromUniYearDay(uniDayNum, uniYear);
        // Add Days
        for (let d = 0; d < daysAdded; d++) {
            uniDayNum = uniDayNum + 1;
            if (uniDayNum > yearLength) {
                uniDayNum = 1;
                uniYear += 1;
                isLeapYear = UniformMonth.isGregorianLeapYear(uniYear);
                yearLength = 365 + isLeapYear * 1;
            }
            var {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum} = 
                UniformMonth.uniformDateFromUniYearDay(uniDayNum, uniYear);
        }
        return {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum};
    }
    
    static subtractUniformDay(uniYear, uniMonth, uniDay, daysRemoved=1) {
        if (daysRemoved < 0) {
            return UniformMonth.addGregorianDay(uniYear, uniMonth, uniDay, -1 * daysRemoved);
        }
        // Days from Beginning of Year
        var uniDayNum = UniformMonth.uniDateToUniYearDay(uniYear, uniMonth, uniDay);
        let isLeapYear = UniformMonth.isGregorianLeapYear(uniYear);
        let yearLength = 365 + isLeapYear * 1;
        // If daysRemoved === 0, calculate 3 outputs not provided as parameters
        var {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum} = 
                UniformMonth.uniformDateFromUniYearDay(uniDayNum, uniYear);
        // Subtract Days
        for (let d = 0; d < daysRemoved; d++) {
            uniDayNum = uniDayNum - 1;
            if (uniDayNum === 0) {
                uniYear -= 1;
                isLeapYear = UniformMonth.isGregorianLeapYear(uniYear);
                yearLength = 365 + isLeapYear * 1;
                uniDayNum = yearLength;
            }
            var {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum} = 
                UniformMonth.uniformDateFromUniYearDay(uniDayNum, uniYear);
        }
        // Return
        return {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum};
    }

}
