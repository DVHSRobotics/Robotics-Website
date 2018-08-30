// Hopefully this code doesn't turn into ~~~~~~~~~Spaghetti~~~~~~~~~~~
//------------------------------
//Define Functions and Initial Variables
//----------------------------------
var currentDate = new Date();
var weekIndex = 0; //number of weeks displaced from current week (signed). Used as the index for the generateNewWeek() function
var monthIndex = 0; //number of months displaced from current month (signed)
var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var blankCalendar = `<div class="col-md-1-5"></div>` //a spacing column to properly setup the calendar
//booleans to track view state
var isMobileView = false;
var isWeekView = true;
//raw JSON data of the events retrieved from calendar GAPI
var rawEventsList = [];
//-------------------------------------------------------------------------------------------------------------------------------------------
//Calendar generation functions
//-------------------------------------------------------------------------------------------------------------------------------------------
//Some notes about calendar generation :
//  Be cautious of whetehr the functions require the sunday date of the week to properly handle the dates

//initializes calendar with current date and populates calendar 
function calendarInit() {
    console.log('Initializing calendar...');
    generateCalendar(getSunday(new Date()));
    console.log('Calendar initialization complete');
}

//generates each of the boxes for each day of the week
function generateCalendar(sundayDate) {
    //generate header
    saturdayDate = adjustDate(sundayDate, 6);
    document.getElementById('calendarDateRangeHeader').innerHTML = parseInt(sundayDate.getMonth() + 1) + '/' + sundayDate.getDate() + '/' + parseInt(sundayDate.getFullYear() - 2000) + ' - ' + parseInt(saturdayDate.getMonth() + 1) + '/' + saturdayDate.getDate() + '/' + parseInt(saturdayDate.getFullYear() - 2000);
    //generate boxes for each day
    generateNewWeek();

}

function generateNewWeek() {
    var sundayDate = adjustDate(getSunday(new Date()), weekIndex * 7);
    document.getElementById('weeks').innerHTML += `<div class="col-sm-11"><div class="row" id="week` + weekIndex + `"><div class="col-md-1-5"></div></div></div>` //add opening elements to new week
    for (var i = 0; i < 7; i++) { //generate each day block for the week
        var boxDate = adjustDate(sundayDate, i).getDate();
        document.getElementById('week' + weekIndex).innerHTML += `
            <div class="col-lg-1-5 day-box">
                <a href='#' id='` + daysOfWeek[i] + `' onclick="agendaView('` + adjustDate(sundayDate, i) + `')">
                    <div class="card">
                        <div class="card-header">
                            <div class="day-label">` + daysOfWeek[i] + `</div> 
                            <div class="date-label">` + boxDate + ` ` + monthShortName(adjustDate(sundayDate, i).getMonth() + 1) + `</div>
                        </div>
                        <div class="card-body ` + hightlightToday(adjustDate(sundayDate, i)) + `">
                            <div class="row">
                            ` + fillEvents(rawEventsList, adjustDate(sundayDate, i), false) + `
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }
    weekIndex++;
}

//returns a string of HTML to render all events for the selected day
function fillEvents(eventsList, selectedDate, detailed) {
    var defaultBlock = '<div class="col-sm-12"><br><br><br></div>' //default calendar html when no events are detected
    var useDefaultBlock = true;
    var htmlBlock = "";
    var numberOfEvents = 0; //reccords number of events on calendar
    rawEventsList.forEach(element => {
        var eventStartTime = new Date(element.start.dateTime);
        var eventEndTime = new Date(element.end.dateTime);
        if (areDatesSame(eventStartTime, selectedDate)) {
            if (detailed) { //if detailed data is requested, return event details as well
                useDefaultBlock = false;
                numberOfEvents++;
                htmlBlock += `<div class="col-sm-12 calendar-event">
                                ` + formatTime(eventStartTime) + `-` + formatTime(eventEndTime) + ` ` + element.summary + `
                                <p>` + element.summary + `</p>
                            </div>`;
            } else {
                useDefaultBlock = false;
                numberOfEvents++;
                htmlBlock += `<div class="col-sm-12 calendar-event">
                                ` + formatTime(eventStartTime) + ` ` + element.summary + `
                            </div>`;
            }

        } else {

        }
    });
    if (useDefaultBlock) {
        return defaultBlock;
    } else {
        htmlBlock = htmlBlock.substr(0, htmlBlock.length - 6); //cuts out div tag at end so whitespace can be appended
        for (var i = 0; i < 3 - numberOfEvents; i++) { //fills remaining space on calendar block with whitespace
            htmlBlock += "<br>";
        }
        htmlBlock += "</div>"
        return htmlBlock;
    }
}

//Changes calendar display to next week
function nextWeek() {
    //weekIndex++; IDK WHERE THE EXTRA PLUS ONE IS COMING FROM
    var newSundayDate = getSunday(adjustDate(new Date(), weekIndex * 7)); //calculate the new sunday date based on the selected week
    document.getElementById('weeks').innerHTML = ""; //clear calendar to be regenerated
    generateCalendar(newSundayDate);
}

//Changes calendar display to previous week
function prevWeek() {
    weekIndex -= 2; //for some reason decrementing by 2 is necessary to decrement by one
    var newSundayDate = getSunday(adjustDate(new Date(), weekIndex * 7)); //calculate the new sunday date based on the selected week
    document.getElementById('weeks').innerHTML = ""; //clear calendar to be regenerated
    generateCalendar(newSundayDate);

}

//changes calendar to display next month
function nextMonth() {
    monthIndex++;
    monthView();
}

//changes calendar to display previous month
function prevMonth() {
    monthIndex--;
    monthView();
}

function monthView() {
    var currentMonth = currentDate.getMonth() + monthIndex;
    var sundayDate = getSunday(adjustDate(currentDate, weekIndex * 7));
    var saturdayDate = adjustDate(sundayDate, 6); //the date of saturday of the same week as the sunday date
    var startOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1); //set sstart of month to 1st of selected month
    var endOfMonth = new Date(currentDate.getFullYear(), startOfMonth.getMonth(), maxDaysOfMonth(startOfMonth)); //end of month is the same month as defined in the startOfMonth

    var firstWeekIndex = weekIndexDifference(currentDate, startOfMonth);
    var lastWeekIndex = weekIndexDifference(currentDate, endOfMonth);

    //set weekIndex to first week of the month and reset calendar
    weekIndex = firstWeekIndex;
    resetCalendar();
    //set calendar header to month name
    document.getElementById('calendarDateRangeHeader').innerHTML = monthFullName(startOfMonth.getMonth() + 1) + " " + startOfMonth.getFullYear();

    //Adjust calendar controls to month view
    document.getElementById('toggleCalendarView').innerHTML =
        `<button class="btn btn-primary btn-sm" onclick="weekView()">
            Week View
        </button>`;
    document.getElementById('calendarNavPrevButton').innerHTML =
        `<button class="btn btn-primary btn-sm" onclick="prevMonth()">
            <i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>
        </button>`;
    document.getElementById('calendarNavNextButton').innerHTML =
        `<button class="btn btn-primary btn-sm" onclick="nextMonth()">
        <i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>
    </button>`;


    //generate each week of the month
    for (var i = firstWeekIndex; i <= lastWeekIndex; i++) {
        generateNewWeek();
    }

    isWeekView = false;

}

function weekView() {
    document.getElementById('weeks').innerHTML = ""; //clear calendar to be regenerated
    if (isWeekView) { //if already in week view (like user is just adjusting to mobile viewport) maintain current week index
        weekIndex--; //not sure why i have to decrement this but it works
        generateCalendar(getSunday(adjustDate(new Date(), (weekIndex) * 7)));
    } else {
        //Set calendar to first week of currently selected month
        var currentMonth = currentDate.getMonth() + monthIndex;
        var startOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1);
        var firstWeekIndex = weekIndexDifference(currentDate, startOfMonth);
        weekIndex = firstWeekIndex;
        generateCalendar(getSunday(startOfMonth));
    }

    //Adjust calendar controls for week view
    document.getElementById('toggleCalendarView').innerHTML =
        `<button class="btn btn-primary btn-sm" id="toggleCalendarView" onclick="monthView()">
            Month View
        </button>`;
    document.getElementById('calendarNavPrevButton').innerHTML =
        `<button class="btn btn-primary btn-sm" id="calendarNavPrevButton" onclick="prevWeek()">
            <i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>
        </button>`;
    document.getElementById('calendarNavNextButton').innerHTML =
        `<button class="btn btn-primary btn-sm" id="calendarNavNextButton" onclick="nextWeek()">
        <i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>
    </button>`;

    isWeekView = true;

}

function resetCalendar() {
    document.getElementById('weeks').innerHTML = `<div class="col-sm-11"><div class="row" id="week` + weekIndex + `"><div class="col-md-1-5"></div></div></div>`;
}

//switches view to day's schedule
function agendaView(date) {
    date = new Date(date); //convert the string date into date object
    document.getElementById('weeks').innerHTML = `<div class="row" id="agenda"></div>`; //clear calendar to be regenerated
    document.getElementById('agenda').innerHTML = fillEvents(rawEventsList, date, true); //get events with details

    document.getElementById('toggleCalendarView').innerHTML =
        `<button class="btn btn-primary btn-sm" id="toggleCalendarView" onclick="weekView()">
            Back to Week View
        </button>`;
}

//-------------------------------------------------------------------------------------------------------------------------------------------
//Date manipulation functions
//-------------------------------------------------------------------------------------------------------------------------------------------

//grabs date of sunday of current week
function getSunday(dateToCheck) {
    var sundayDate = adjustDate(dateToCheck, -dateToCheck.getDay());
    var sundayDate = new Date(sundayDate.getFullYear(), sundayDate.getMonth(), sundayDate.getDate());
    return sundayDate;
}

//properly handles adjusting date, change is in unit of days
function adjustDate(oldDate, change) {
    return new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate() + change);
}

//returns the full name of the day of the week given the number of the day; ex: 1 -> Monday
function fullDayName(day) {
    switch (day) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
            break;
    }
    return day;
}

function monthShortName(month) {
    switch (month) {
        case 1:
            month = "Jan"
            break;
        case 2:
            month = "Feb"
            break;
        case 3:
            month = "Mar"
            break;
        case 4:
            month = "Apr"
            break;
        case 5:
            month = "May"
            break;
        case 6:
            month = "Jun"
            break;
        case 7:
            month = "Jul"
            break;
        case 8:
            month = "Aug"
            break;
        case 9:
            month = "Sep"
            break;
        case 10:
            month = "Oct"
            break;
        case 11:
            month = "Nov"
            break;
        case 12:
            month = "Dec"
            break;
    }
    return month;

}

function monthFullName(month) {
    switch (month) {
        case 1:
            month = "January"
            break;
        case 2:
            month = "February"
            break;
        case 3:
            month = "March"
            break;
        case 4:
            month = "April"
            break;
        case 5:
            month = "May"
            break;
        case 6:
            month = "June"
            break;
        case 7:
            month = "July"
            break;
        case 8:
            month = "August"
            break;
        case 9:
            month = "September"
            break;
        case 10:
            month = "October"
            break;
        case 11:
            month = "November"
            break;
        case 12:
            month = "December"
            break;
    }
    return month;

}

//takes date object and returns time in AM/PM notation
function formatTime(date) {
    return twelveHourFormat(date.getHours()) + ":" + formatMinutes(date.getMinutes()) + amOrPm(date.getHours());
}

//takes hour value and returns hour in twelve hour format
function twelveHourFormat(hour) {
    if (hour + 1 > 12) {
        return parseInt(hour - 12 + 1);
    } else {
        return parseInt(hour + 1);
    }
}

//takes minutes, if 0, returns "00"
function formatMinutes(minutes) {
    if (minutes === 0) {
        return "00";
    } else {
        return minutes;
    }
}

function amOrPm(hour) {
    if (hour < 12) {
        return 'AM';
    } else {
        return 'PM';
    }
}

//takes two dates and check if they are the same day
function areDatesSame(dateOne, dateTwo) {
    if (dateOne.getFullYear() === dateTwo.getFullYear() && dateOne.getMonth() === dateTwo.getMonth() && dateOne.getDate() === dateTwo.getDate()) {
        return true;
    } else {
        return false;
    }
}

//if inputed day is the same as today, return HTML to color that box on the calendar
function hightlightToday(day) {
    if (areDatesSame(day, currentDate)) {
        return `" style="background-color: #ffd500;`; //hightlights box yellowish orange
    } else {
        return "";
    }
}

//returns the number of days in the month given a Date object
function maxDaysOfMonth(dateToCheck) {
    var monthToCheck = parseInt(dateToCheck.getMonth() +1);
    var year = dateToCheck.getFullYear();
    if ((monthToCheck <= 7 && monthToCheck % 2 === 1) || (monthToCheck >= 8 && monthToCheck % 2 === 0)) {
        return 31;
    } else if (monthToCheck === 2) { //special condition for February
        //check for leap year
        if (year % 400 === 0) {
            return 27;
        } else if (year % 4 === 0 && year % 100 != 0) {
            return 28;
        } else {
            return 27;
        }
    } else {
        return 30;
    }
}

//takes two dates and finds the difference in the number of weeks between the Sunday's of those dates
function weekIndexDifference(firstDate, lastDate) {
    var milliSecondsPerWeek = 604800000;
    firstDate = getSunday(firstDate);
    lastDate = getSunday(lastDate);
    var timeDifference = lastDate.getTime() - firstDate.getTime();
    return timeDifference / milliSecondsPerWeek;
}


//-------------------------------
//End of Definitions
//--------------------------------------

//Listener for calendar mobile view
//-------------------------------------------------------------------------------------------------
function calendarMobileView(x) {
    if (x.matches && !isMobileView) { // If media query matches and previously not in mobile view
        isMobileView = true;
        weekView();
        document.getElementById('toggleCalendarView').innerHTML = ""; //remove ability to toggle to month view for mobile users
    } else if (!x.matches) {
        //if screen is not a mobile viewport give back desktop controls
        isMobileView = false;
        document.getElementById('toggleCalendarView').innerHTML =
            `<button class="btn btn-primary btn-sm" onclick="monthView()">
            Month View
        </button>`;
    } else {
        //if already in mobile view, do nothing
    }
}

var screenSizeQuery = window.matchMedia("(max-width: 1000px)")
calendarMobileView(screenSizeQuery) // Call listener function at run time
screenSizeQuery.addListener(calendarMobileView) // Attach listener function on state changes
//-------------------------------------------------------------------------------------------------

//gAPI date format
// EventList.items[i].start.dateTime;
//can be directly used as date object

//makes get request to calendar gAPI for events
function start() {
    // Initializes the client with the API key and the Translate API.
    gapi.client.init({
        'apiKey': 'AIzaSyA7sg0i4dp41dzkS2gbbDI7rmLh5iaXuPc',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    }).then(function () {
        // Executes an API request, and returns a Promise.
        return gapi.client.calendar.events.list({
            calendarId: 'business@dvhsrobotics.org'
        });
    }).then(function (response) {
        rawEventsList = response.result.items;
        calendarInit();//intialize the calendar
    }, function (reason) {
        console.log('Error: ' + reason.result.error.message);
    });
};

//----------------------------------
//Start of code to run
//---------------------------------

// Loads the JavaScript client library and invokes `start` afterwards, and then initializes the calendar
gapi.load('client', start);
