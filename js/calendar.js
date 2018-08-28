// Hopefully this code doesn't turn into ~~~~~~~~~Spaghetti~~~~~~~~~~~
//------------------------------
//Define Functions and Initial Variables
//----------------------------------
var currentDate = new Date();
var weekIndex = 0; //number of weeks displaced from current week (signed)
var daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var blankCalendar = `<div class="col-md-1-5"></div>` //a spacing column to properly setup the calendar
var dummyEvents = [//events for testing purposes
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

//initializes calendar with current date and populates calendar 
function calendarInit() {
    console.log('Initializing calendar...');
    document.getElementById('week').innerHTML = blankCalendar;
    generateCalendar(getSunday(new Date()));
    console.log('Calendar initialization complete');
}

//grabs date of sunday of current week
function getSunday(dateToCheck) {
    var sundayDate = adjustDate(dateToCheck, -dateToCheck.getDay());
    return sundayDate;
}

//generates each of the boxes for each day of the week
function generateCalendar(sundayDate) {
    //generate header
    saturdayDate = adjustDate(sundayDate, 6);
    document.getElementById('calendarDateRangeHeader').innerHTML = parseInt(sundayDate.getMonth() + 1) + '/' + sundayDate.getDate() + '/' + sundayDate.getFullYear() + ' - ' + parseInt(saturdayDate.getMonth() + 1) + '/' + saturdayDate.getDate() + '/' + saturdayDate.getFullYear();
    //generate boxes for each day
    for (var i = 0; i < 7; i++) {
        var boxDate = adjustDate(sundayDate, i).getDate();
        document.getElementById('week').innerHTML += `
            <div class="col-lg-1-5 day-box">
                <a href='#' id='` + daysOfWeek[i] + `' onclick="agendaView(` + i + `)">
                    <div class="card">
                        <div class="card-header">
                            <div class="day-label">` + fullDayName(i) + `</div> 
                            <div class="date-label">` + boxDate + `</div>
                        </div>
                        <div class="card-body `+hightlightToday(adjustDate(sundayDate, i))+`">
                            <div class="row">
                            ` + fillEvents(dummyEvents, adjustDate(sundayDate, i)) + `
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }
}

//returns a string of HTML to render all events for the selected day
function fillEvents(eventsList, selectedDate) {
    var defaultBlock = '<div class="col-sm-12"><br><br><br></div>'//default calendar html when no events are detected
    var useDefaultBlock = true;
    var htmlBlock ="";
    var numberOfEvents = 0;//reccords number of events on calendar
    eventsList.forEach(element => {
        var eventStartTime = new Date(element.dateTime);
        if (areDatesSame(eventStartTime, selectedDate)) {
            useDefaultBlock = false;
            numberOfEvents++;
            htmlBlock += `<div class="col-sm-12 calendar-event">
                            `+formatTime(eventStartTime)+` `+element.title+`
                        </div>`;
        } else {

        }
    });
    if(useDefaultBlock) {
        return defaultBlock;
    }else {
        htmlBlock = htmlBlock.substr(0,htmlBlock.length-6);//cuts out div tag at end so whitespace can be appended
        for(var i = 0;i<3-numberOfEvents;i++) {//fills remaining space on calendar block with whitespace
            htmlBlock+="<br>";
        }
        htmlBlock+="</div>"
        return htmlBlock;
    }
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

//takes date object and returns time in AM/PM notation
function formatTime(date) {
    return twelveHourFormat(date.getHours())+":"+formatMinutes(date.getMinutes())+amOrPm(date.getHours());
}

//takes hour value and returns hour in twelve hour format
function twelveHourFormat(hour) {
    if(hour+1 > 12) {
        return parseInt(hour-12+1);
    }else {
        return parseInt(hour+1);
    }
}

//takes minutes, if 0, returns "00"
function formatMinutes(minutes) {
    if(minutes===0){
        return "00";
    }else {
        return minutes;
    }
}

function amOrPm(hour) {
    if (hour<12) {
        return 'AM';
    }else {
        return 'PM';
    }
}

//takes two dates and check if they are the same day
function areDatesSame(dateOne, dateTwo) {
    if(dateOne.getFullYear() === dateTwo.getFullYear() && dateOne.getMonth() === dateTwo.getMonth() && dateOne.getDate() === dateTwo.getDate()) {
        return true;
    }else {
        return false;
    }
}

//if inputed day is the same as today, return HTML to color that box on the calendar
function hightlightToday(day) {
    if(areDatesSame(day, currentDate)){
        return "bg-info";//hightlights box blue
    }else {
        return "";
    }
}

//Changes calendar display to next week
function nextWeek() {
    weekIndex++;
    var newSundayDate = getSunday(adjustDate(new Date(), weekIndex * 7)); //calculate the new sunday date based on the selected week
    document.getElementById('week').innerHTML = blankCalendar; //clear calendar to be regenerated
    generateCalendar(newSundayDate);
}

//Changes calendar display to previous week week
function prevWeek() {
    weekIndex--;
    var newSundayDate = getSunday(adjustDate(new Date(), weekIndex * 7)); //calculate the new sunday date based on the selected week
    document.getElementById('week').innerHTML = blankCalendar; //clear calendar to be regenerated
    generateCalendar(newSundayDate);

}

//switches view to day's schedule
function agendaView(day) {
    document.getElementById('week').innerHTML = blankCalendar; //clear calendar to be regenerated
    document.getElementById('week').innerHTML = '<p>' + daysOfWeek[day] + '</p>';
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