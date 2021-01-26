/* 
  testTable.js creates a hidden table in the last section of the HTML when called
*/
function testTable() {
    var gregYear = 2016;
    var gregMonth = 1;
    var gregDay = 1;
    
    // Set Initial Calendar Date
	let newDate = toYYYY_MM_DD(gregYear, gregMonth, gregDay);
	let calendarDOM = $("#birthdate");
	calendarDOM[0].value = newDate;
    gregToUni();
    
    // Retrieve Output Doms
	let outDateStringDOM = $("#outDateString");
	let dayOfYearUniformDOM = $("#outDayOfYear");
    let testTableDOM = $("#testTable");

    // Delete Existing Table and repopulate
    let col1 = "Old Date String";
    let col2 = "UY Day";
    let col3 = "New Date String";
    let headRow = `<tr><th>${col1}</th><th>${col2}</th><th>${col3}</th></tr>`;
    console.log(testTableDOM);
    testTableDOM[0].innerHTML = headRow;

    // Build Table
    for (let i = 0; i < (365 * 4 + 5); i++) 
    {
        // Retrieve Values
	    var {gregYear, gregMonth, gregDay} = parseCalendarDate();

        // Retrieve Output values
        let outDateString = outDateStringDOM.html();
        let dayOfYearUniform = dayOfYearUniformDOM.html();

        // Add to DOM Object
        let newRow = document.createElement("tr");
        let oldDate = document.createElement("td");
        let dayOfYear = document.createElement("td");
        let newDate = document.createElement("td");
        newRow.append(oldDate);
        newRow.append(dayOfYear);
        newRow.append(newDate);
        testTableDOM.append(newRow);
        oldDate.innerHTML = `${gregYear}-${gregMonth}-${gregDay}`;
        dayOfYear.innerHTML = dayOfYearUniform;
        newDate.innerHTML = outDateString;

        // Increment
        tomorrow();
    }
}