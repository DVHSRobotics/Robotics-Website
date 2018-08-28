// Hopefully this code doesn't turn into ~~~~~~~~~Spaghetti~~~~~~~~~~~
//------------------------------
//Define Functions and Initial Variables
//----------------------------------
var currentDate = new Date();
var weekIndex = 0; //number of weeks displaced from current week (signed). Used as the index for the generateNewWeek() function
var monthIndex = 0; //number of months displaced from current month (signed)
var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var blankCalendar = `<div class="col-md-1-5"></div>` //a spacing column to properly setup the calendar
var dummyEvents = [ //events for testing purposes
    {
        dateTime: "2018-08-29T06:00:00-06:00",
        title: "Event 1"
    },
    {
        dateTime: "2018-08-29T08:00:00-06:00",
        title: "Event 3"
    },
    {
        dateTime: "2018-09-02T02:00:00-06:00",
        title: "Event 2"
    }
];

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
    document.getElementById('calendarDateRangeHeader').innerHTML = parseInt(sundayDate.getMonth() + 1) + '/' + sundayDate.getDate() + '/' + sundayDate.getFullYear() + ' - ' + parseInt(saturdayDate.getMonth() + 1) + '/' + saturdayDate.getDate() + '/' + saturdayDate.getFullYear();
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
                <a href='#' id='` + daysOfWeek[i] + `' onclick="agendaView(` + i + `)">
                    <div class="card">
                        <div class="card-header">
                            <div class="day-label">` + daysOfWeek[i] + `</div> 
                            <div class="date-label">` + boxDate +` `+monthShortName(adjustDate(sundayDate, i).getMonth()+1)+ `</div>
                        </div>
                        <div class="card-body ` + hightlightToday(adjustDate(sundayDate, i)) + `">
                            <div class="row">
                            ` + fillEvents(dummyEvents, adjustDate(sundayDate, i)) + `
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
function fillEvents(eventsList, selectedDate) {
    var defaultBlock = '<div class="col-sm-12"><br><br><br></div>' //default calendar html when no events are detected
    var useDefaultBlock = true;
    var htmlBlock = "";
    var numberOfEvents = 0; //reccords number of events on calendar
    eventsList.forEach(element => {
        var eventStartTime = new Date(element.dateTime);
        if (areDatesSame(eventStartTime, selectedDate)) {
            useDefaultBlock = false;
            numberOfEvents++;
            htmlBlock += `<div class="col-sm-12 calendar-event">
                            ` + formatTime(eventStartTime) + ` ` + element.title + `
                        </div>`;
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
    weekIndex++;
    var newSundayDate = getSunday(adjustDate(new Date(), weekIndex * 7)); //calculate the new sunday date based on the selected week
    document.getElementById('weeks').innerHTML = ""; //clear calendar to be regenerated
    generateCalendar(newSundayDate);
}

//Changes calendar display to previous week
function prevWeek() {
    weekIndex-=2;//for some reason decrementing by 2 is necessary to decrement by one
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
    var currentMonth = currentDate.getMonth()+monthIndex;
    var sundayDate = getSunday(adjustDate(currentDate, weekIndex * 7));
    var saturdayDate = adjustDate(sundayDate, 6);//the date of saturday of the same week as the sunday date
    var startOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1);//set sstart of month to 1st of selected month
    console.log(startOfMonth);
    var endOfMonth = new Date(currentDate.getFullYear(), startOfMonth.getMonth(), maxDaysOfMonth(startOfMonth.getMonth()));//end of month is the same month as defined in the startOfMonth

    var firstWeekIndex = weekIndexDifference(currentDate, startOfMonth);
    var lastWeekIndex = weekIndexDifference(currentDate, endOfMonth);

    //set weekIndex to first week of the month and reset calendar
    weekIndex = firstWeekIndex;
    resetCalendar();
    //set calendar header to month name
    document.getElementById('calendarDateRangeHeader').innerHTML = monthFullName(startOfMonth.getMonth()+1);

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

}

function weekView() {
    //Set calendar to first week of currently selected month
    document.getElementById('weeks').innerHTML = ""; //clear calendar to be regenerated
    var currentMonth = currentDate.getMonth()+monthIndex;
    var startOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1);
    var firstWeekIndex = weekIndexDifference(currentDate, startOfMonth);
    weekIndex = firstWeekIndex;
    generateCalendar(getSunday(startOfMonth));

    //Adjust calendar controls for week view
    document.getElementById('toggleCalendarView').innerHTML = 
        `<button class="btn btn-primary btn-sm" onclick="monthView()">
            Month View
        </button>`;
    document.getElementById('calendarNavPrevButton').innerHTML = 
        `<button class="btn btn-primary btn-sm" onclick="prevWeek()">
            <i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>
        </button>`;
    document.getElementById('calendarNavNextButton').innerHTML = 
    `<button class="btn btn-primary btn-sm" onclick="nextWeek()">
        <i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>
    </button>`;

}

function resetCalendar() {
    document.getElementById('weeks').innerHTML = `<div class="col-sm-11"><div class="row" id="week` + weekIndex + `"><div class="col-md-1-5"></div></div></div>`;
}

//switches view to day's schedule
function agendaView(day) {
    document.getElementById('week').innerHTML = blankCalendar; //clear calendar to be regenerated
    document.getElementById('week').innerHTML = '<p>' + daysOfWeek[day] + '</p>';
}

//-------------------------------------------------------------------------------------------------------------------------------------------
//Date manipulation functions
//-------------------------------------------------------------------------------------------------------------------------------------------

//grabs date of sunday of current week
function getSunday(dateToCheck) {
    var sundayDate = adjustDate(dateToCheck, -dateToCheck.getDay());
    var sundayDate = new Date(sundayDate.getFullYear(),sundayDate.getMonth(), sundayDate.getDate());
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

//returns the number of days in the month 
function maxDaysOfMonth(monthToCheck) {
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


//----------------------------------
//Start of code to run
//---------------------------------

calendarInit();


//gAPI date format
// EventList.items[i].start.dateTime;
//can be directly used as date object
//console.log(new Date("2012-07-11T03:30:00-06:00"));

//starts calendar api request -- Relies on API key which will probably be non-functional when using service account/oauth
// function start() {
//     // 2. Initialize the JavaScript client library.
//     gapi.client.init({
//         'apiKey': 'AIzaSyAEZ93lX2Y2M_IrL4GRsGTm2ltYTrdEr4w',
//         // clientId and scope are optional if auth is not required.
//         // 'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
//         // 'scope': 'profile',
//     }).then(function () {
//         // 3. Initialize and make the API request.
//         return gapi.client.request({
//             'path': 'https://www.googleapis.com/calendar/v3/calendars/en.usa#holiday@group.v.calendar.google.com/events',
//         })
//     }).then(function (response) {
//         console.log(response.result);
//     }, function (reason) {
//         console.log('Error: ' + reason.result.error.message);
//     });
// };
// // 1. Load the JavaScript client library.
// gapi.load('client', start);