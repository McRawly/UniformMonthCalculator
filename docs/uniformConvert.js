"use strict"; // not needed

const debugOn = false;

// class UniformMonth {};

/* -------------------------------------------------------------------
   ----------  Gregorian Date to Uniform Month Date Converter  -------
   -------------------------------------------------------------------  */

function gregToUni () {

	// Gregorian Date
	// var gregDay = parseInt($("#greDay").val()); // [1-31]
	// var gregMonth = parseInt($("#greMonth").val()); // [1-12]
	// var gregYear = parseInt($("#greYear").val()); // unbounded
	var {gregYear, gregMonth, gregDay} = parseCalendarDate();
	if(gregYear === undefined) {
		console.log("Not in proper format");
		return;
	}

    var {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum} = 
        UniformMonth.gregorianToUniform(gregYear, gregMonth, gregDay);

    // Format Output String
    let wkDayStr = UniformMonth.newWeekdays[uniWeekday - 1];
    let monthStr = UniformMonth.newMonthNames[uniMonth - 1];
	let outDateString = `${wkDayStr}, ${monthStr} ${uniDay}, ${uniYear}`;

	/* ----------  Update DOM Elements  ------- */

    // Input Table
    let wasLeapYear = UniformMonth.isGregorianLeapYear(gregYear);
	let inDateString = UniformMonth.toGregDateString(gregYear, gregMonth, gregDay);
	let inStringLY = (wasLeapYear) ? "Yes" : "No";
	$("#inDateString").html(inDateString);
	$("#inLeapYear").html(inStringLY);
	$("#inDaysLost").html(UniformMonth.daysLost);
	$("#inLeapDay").html(UniformMonth.leapDay);
	$("#inMonthNames").html(UniformMonth.uniMonthNamesLabel);
	
	// Input-Output Table
	$("#resultInputString").html(inDateString);
	$("#resultOutputString").html(outDateString);

	// Output Table
	$("#outDateString").html(outDateString);
	$("#outYear").html(uniYear);
	$("#outMonth").html(uniMonth);
	$("#outDay").html(uniDay);
	$("#outWeekday").html(wkDayStr);
	$("#outDayOfYear").html(uniDayNum);
	$("#outWeekNum").html(uniWeekNum);
	
	if (debugOn) {
		console.log("conversion complete " + gregDate.toUTCString());
    }
    populateGregorianCalendar(gregYear, gregMonth, gregDay);
    populateUniformCalendar(uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum);
}

// Returns the ISO week of the date.
// Source: https://weeknumber.net/how-to/javascript
function getWeek(date) {
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function populateGregorianCalendar(year, month, day) {
	// Grab Table DOMs
	var {gregDOMs, uniDOMs} = getCalendarDoms();
	let numRows = gregDOMs.length; // data rows only, should be odd
	let numCols = 8; // includes Weeknum as first element
	let midRow = (numRows - 1) / 2; // should be even index
	let row = midRow; // store where to insert
    let col = 0; // store where to insert
    
    // Reset classes
    for (let r = 0; r < numRows; r++) {
        gregDOMs[r][0].className = "info";
        for (let c = 1; c < numCols; c++) {
            gregDOMs[r][c].className = "default";
            if (c === 1 || c === 7) {
                gregDOMs[r][c].className = "active";
            }
        }
    }

    // Convert to DATE object for Weekday and Week #
    let gregDate = new Date(year, month - 1, day);
    let weekday = gregDate.getDay() + 1; // starts [0-6] now [1-7]
    let weekNum = getWeek(gregDate); // [1-53]
    col = weekday;

    // Store "Start Values" for when we iterate backwards
    let startRow = row;
    let startCol = col;
    let startYear = year;
    let startMonth = month;
    let startDay = day;
    
    // Update Highlight Date first
	gregDOMs[row][col].className = "success";
    gregDOMs[row][0].innerHTML = weekNum;
    
    // Insert Numbers FORWARD
	while (row < numRows) {
        
        gregDate = new Date(year, month - 1, day);
        weekday = gregDate.getDay() + 1; // starts [0-6] now [1-7]
        weekNum = getWeek(gregDate); // [1-53]

        // Set Values
        if (col == 1) {
            gregDOMs[row][0].innerHTML = weekNum;
        }
        gregDOMs[row][col].innerHTML = day;
        col += 1;
        if (col > 7) {
            col = 1;
            row += 1;
        }

        // Increment Day
        var {year, month, day} =
            UniformMonth.addGregorianDay(year, month, day, 1);
    }
    
    // Insert Numbers BACKWARD
    row = startRow;
    col = startCol;
    year = startYear;
    month = startMonth;
    day = startDay;

	while (row >= 0) { 
        // Use Date Class
        gregDate = new Date(year, month - 1, day);
        weekday = gregDate.getDay() + 1; // starts [0-6] now [1-7]
        weekNum = getWeek(gregDate); // [1-53]

        // Set Values
        if (col == 7) {
            gregDOMs[row][0].innerHTML = weekNum;
        }
        gregDOMs[row][col].innerHTML = day;
        col -= 1;
        if (col === 0) {
            col = 7;
            row -= 1;
        }

        // Decrement Day
        var {year, month, day} =
            UniformMonth.subtractGregorianDay(year, month, day, 1);       
    }

}

function populateUniformCalendar(uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, dayOfUniYear) {
	// Grab Table DOMs
	var {gregDOMs, uniDOMs} = getCalendarDoms();
	let numRows = uniDOMs.length; // data rows only, should be odd
	let numCols = 8; // includes Weeknum as first element
	let midRow = (numRows - 1) / 2; // should be even index
	let row = midRow; // store where to insert
    let col = uniWeekday; // store where to insert
    
    // Reset classes
    for (let r = 0; r < numRows; r++) {
        uniDOMs[r][0].className = "info";
        for (let c = 1; c < numCols; c++) {
            uniDOMs[r][c].className = "default";
            if (c === 1 || c === 7) {
                uniDOMs[r][c].className = "active";
            }
        }
    }

    /* --------- Update Uniform Month Calendar --------- */

    // Store "Start Values" for when we iterate backwards
    let startRow = row;
    let startCol = col;
    let startUniDayNum = dayOfUniYear;
    let startUniYear = uniYear;
    const pieceWiseLeap =  "-LEAPDAY"
    const pieceWiseYear =  "-YEARDAY"
    
    // Update Highlight Date first
	if (uniMonth == 14 || uniDay == 0) {
		let pieceWise = pieceWiseLeap;
		if (uniMonth == 14) {
			pieceWise = pieceWiseYear;
		}
		// Print Piece-wise Message as entire row
		for (let c = 0; c < pieceWise.length; c++) {
            uniDOMs[row][c].text = pieceWise[c];
            if (c > 0) {
                uniDOMs[row][c].className = "success";
            }
		}
        // Store next insert point.
        startRow = row-1;
        startCol = 7;
	} else {
        // Highlight
        startRow = row;
        startCol = col-1;
        if (startCol === 0) {
            startRow -= 1;
            startCol = 7;
        }
        uniDOMs[row][col].className = "success";
        uniDOMs[row][0].innerHTML = uniWeekNum; // set week number too
    }
    
    // Insert Numbers FORWARD
	while (row < numRows) {
        // On First Column, set Weeknum OR make whole week special
        if (uniMonth == 14 || uniDay == 0) {
            let pieceWise = pieceWiseLeap;
            if (uniMonth == 14) {
                pieceWise = pieceWiseYear;
            }
            // Print Piece-wise Message as entire row
            for (let c = 0; c < pieceWise.length; c++) {
                uniDOMs[row][c].innerHTML = pieceWise[c];
            }
            // Store next insert point.
            row += 1;
            col = 1;
        } else {
            if (col == 1) {
                uniDOMs[row][0].innerHTML = uniWeekNum;
            }
            uniDOMs[row][col].innerHTML = uniDay;
            col += 1;
            if (col > 7) {
                col = 1;
                row += 1;
            }
        }
        // Increment Day
        var {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum} =
            UniformMonth.addUniformDay(uniYear, uniMonth, uniDay, 1);
    }
    
    // Insert Numbers BACKWARD
    row = startRow;
    col = startCol;
    uniDayNum = startUniDayNum;
    uniYear = startUniYear;
    var {uniYear, uniMonth, uniDay} = UniformMonth.uniformDateFromUniYearDay(uniDayNum, uniYear);
	while (row >= 0) {        
        // Decrement Day
        var {uniYear, uniMonth, uniDay, uniWeekday, uniWeekNum, uniDayNum} =
        UniformMonth.subtractUniformDay(uniYear, uniMonth, uniDay, 1);

        // On First Column, set Weeknum OR make whole week special
        if (uniMonth == 14 || uniDay == 0) {
            let pieceWise = pieceWiseLeap;
            if (uniMonth == 14) {
                pieceWise = pieceWiseYear;
            }
            // Print Piece-wise Message as entire row
            for (let c = 0; c < pieceWise.length; c++) {
                uniDOMs[row][c].innerHTML = pieceWise[c];
            }
            // Store next insert point.
            row -= 1;
            col = 7;
        } else {
            if (col == 7) {
                uniDOMs[row][0].innerHTML = uniWeekNum;
            }
            uniDOMs[row][col].innerHTML = uniDay;
            col -= 1;
            if (col === 0) {
                col = 7;
                row -= 1;
            }
        }
    }

}

function getCalendarDoms() {
	// let cached = false;
	// if (!cached) {
		let oldTableDOM = document.getElementById("gregCalendar");
        let newTableDOM =document.getElementById("uniCalendar");
        oldTableDOM = oldTableDOM.children[1]; // two <tbody>s, second is data
        newTableDOM = newTableDOM.children[1]; // two <tbody>s, second is data

		let gregDOMs = [];
		let uniDOMs = [];
		// Add DOMs to Nested Array
		for (let r = 0; r < oldTableDOM.children.length; r++) {
			let thisGregDoms = [];
            let thisUniDoms = [];
			for (let c = 0; c < 8; c++) {
				thisGregDoms.push(oldTableDOM.childNodes[r].childNodes[c]);
				thisUniDoms.push(newTableDOM.childNodes[r].childNodes[c]);
            }
            // console.log(thisGregDoms);
			gregDOMs.push(thisGregDoms);
			uniDOMs.push(thisUniDoms);
		}
	// }
	return {gregDOMs, uniDOMs};	
}



/* ----------  HTML Button Callbacks  --------  */

function parseCalendarDate() {
	var calendarDOM = $("#birthdate"); // [1-31]
	let currentDate = calendarDOM[0].value;
	let gregYear;
	let gregMonth;
	let gregDay;
	if (currentDate !== "") {
		gregYear = parseInt(currentDate.substring(0,4)); // [0,4) == [0,3]
		gregMonth = parseInt(currentDate.substring(5,7)); // [5,7) == [5,6]
		gregDay = parseInt(currentDate.substring(8,10)); // [8,10) == [8,9]
	}
	return {gregYear, gregMonth, gregDay};
}

function tomorrow() {
	// Gregorian Date
	var {gregYear: year, gregMonth: month, gregDay: day} = parseCalendarDate();

    // Add One Day
	var {year, month, day} = UniformMonth.addGregorianDay(year, month, day, 1);

	// Set Calendar Date
	let newDate = toYYYY_MM_DD(year, month, day);
	let calendarDOM = $("#birthdate");
	calendarDOM[0].value = newDate;

	// Call Converter
	gregToUni();
}

function yesterday() {
	// Gregorian Date
    var {gregYear: year, gregMonth: month, gregDay: day} = parseCalendarDate();
    
    // Subtract One Day
	var {year, month, day} = UniformMonth.subtractGregorianDay(year, month, day, 1);
	
	// Set Calendar Date
	let newDate = toYYYY_MM_DD(year, month, day);
	let calendarDOM = $("#birthdate");
	calendarDOM[0].value = newDate;

	// Call Converter
	gregToUni();
}

/* ----------  HTML On Load Callbacks  --------  */

function setupPage() {
	// addEventListeners();
	populateMonthNameTable();
	createConstants();
	gregToUni();
}

function createConstants() {
	//  Update Calendar Start and Leap Day (days from beginning of Uniform Year)
	updateCalendarStart(); // calls: updateLeapDay();

	// Update global constant newWeekdays[7] with "Free Day", "Year Day", or "Intermission"
	updateYearDayName(); 

	// Overwrites month names in |newMonthNames| with value chosen in |UniformMonthNames|
	updateCalendarNames(); 
}

function updateCalendarStart() {
	// Calendar Start
	let calendarStart = $("#calendarStart");
	calendarStart = calendarStart[0];
	let offset = calendarStart.value * 1;
	if (offset !== undefined && offset != NaN) {
		UniformMonth.daysLost = offset; // global constant
	}
	if (debugOn) {
		console.log(`daysLost = ${daysLost}`);
	}
	updateLeapDay();
}

function updateLeapDay() {
	// Update Leap Day (days from beginning of Uniform Year)
	let leapDayLocation = $("#leapDayLocation");
	let insertDay = leapDayLocation[0].value * 1;
	if (insertDay === 0) {
		// Must Calculate Summer Solstice based on daysLost
		insertDay = 183 + daysLost - 10;
	}
	if (insertDay !== undefined && insertDay != NaN) {
		UniformMonth.leapDay = insertDay; // global constant
	}
	if (debugOn) {
		console.log(`leapDay = ${UniformMonth.leapDay}`);
	}
	// gregToUni();
}

function updateYearDayName() {
	let yearDayNameDOM = $("#yearDayName");
	let yearName = yearDayNameDOM[0].value;
	if (yearName !== undefined && yearName != NaN) {
		UniformMonth.newWeekdays[7] = yearName;
	}
	if (debugOn) {
		console.log(`newWeekdays = ${UniformMonth.newWeekdays}`);
	}
	gregToUni();
}

function updateCalendarNames() {
	// Overwrites month names in |newMonthNames| with value chosen in |UniformMonthNames|
	let monthNamesChoice = $("#monthNamesChoice");
	let key = monthNamesChoice[0].selectedOptions[0].innerHTML;
	let newValues = UniformMonth.UniformMonthNames[key];
	if (newValues === undefined) {
		console.log(`Error in updateCalendar. key=${key}`);
		return;
	}
	UniformMonth.uniMonthNamesLabel = key; // store in global varuable
	// Copy from |UniformMonthNames| table to |newMonthNames| global variable
	for(let i = 0; i < newValues.length; i++) {
		UniformMonth.newMonthNames[i] = newValues[i];
	}
	if (debugOn) {
		console.log(UniformMonth.newMonthNames);
	}
	gregToUni();
}

// Print Month Name Table and Update Selection box options
function populateMonthNameTable() {
	let monthNamesDOM = $("#monthNamesTable"); // <table>
	monthNamesDOM = monthNamesDOM[0];

	// Read Header Names from Global Constant 
	let tableHeaders = Object.keys(UniformMonth.UniformMonthNames);

	// Header Row
	let numCol = 0;
	let newRow = document.createElement("tr");
	let newHead = document.createElement("th");
	newHead.innerHTML = "Month #";
	for (let i = 0; i < tableHeaders.length; i++) {
		let headName = tableHeaders[i];
		if (headName === "Custom") {
			numCol = i-1;
			break;
		}
		newHead = document.createElement("th");
		newHead.innerHTML = headName ;
		newRow.appendChild(newHead);
	}
	monthNamesDOM.appendChild(newRow);

	// Add Values
	for (let i = 0; i < 13; i++) {
		let newRow = document.createElement("tr");
		let newTd = document.createElement("td");
		newTd.innerHTML = i;
		for (let j = 0; j <= numCol; j++) {
			newTd = document.createElement("td");
			newTd.innerHTML = UniformMonth.UniformMonthNames[tableHeaders[j]][i];
			newRow.appendChild(newTd);
		}
		monthNamesDOM.appendChild(newRow);
	}
	monthNamesDOM.class="table";

	// Update choice DOM Object
	let monthNamesChoiceDOM = $("#monthNamesChoice"); // <select>
	monthNamesChoiceDOM = monthNamesChoiceDOM[0];
	for (let i = 0; i < tableHeaders.length; i++) {
		let headName = tableHeaders[i];
		let newOpt = document.createElement("option");
		newOpt.value = i;
		newOpt.innerHTML = headName;
		monthNamesChoiceDOM.appendChild(newOpt);
		if (i === 0) {
			newOpt.selected = true;
		}
	}
}


/* ----------  Calendar Event Listeners  --------  */

function calendarChange() {
	console.log("also working");
}

function initializeCalendarDate() {
	let year = 2020;
	let month = 1;
	let day = 1;	
	let newDate = toYYYY_MM_DD(year, month, day); // yyyy-mm-dd
	let calendarDOM = $("#birthdate");
	calendarDOM[0].value = newDate;
}

function toYYYY_MM_DD(year, month, day) {
	year = pad(year, 4);
	month = pad(month, 2);
	day = pad(day, 2);
	return `${year}-${month}-${day}`;
}

function pad(num, digits) {
    num = num.toString();
    while (num.length < digits) num = "0" + num;
    return num;
}