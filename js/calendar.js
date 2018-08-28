//------------------------------
//Define Functions and Initial Variables
//----------------------------------
var weekIndex = 0; //number of weeks displaced from current week (signed)
var daysOfWeek = ['sun','mon','tue','wed','thu','fri','sat'];
var blankCalendar = `<div class="col-md-1-5"></div>`//a spacing column to properly setup the calendar

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
            <div class="col-md-1-5 day-box">
                <a href='#' id='`+daysOfWeek[i]+`' onclick="agendaView(`+i+`)">
                    <div class="card">
                        <div class="card-header">
                            <div class="day-label">`+fullDayName(i)+`</div> 
                            <div class="date-label">`+boxDate+`</div>
                        </div>
                        <div class="row">
                            `+fillEvents()+`
                        </div>
                    </div>
                </a>
            </div>
        `;
    }
}

//returns a string of HTML to render all events for the selected day
function fillEvents() {
    return `<div class="col-sm-12">
                lorem ipsum bla bla bla
            </div>`;
}

//properly handles adjusting date, change is in unit of days
function adjustDate(oldDate, change) {
    return new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate()+change);
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
    document.getElementById('week').innerHTML = '<p>'+daysOfWeek[day]+'</p>';
}
//-------------------------------
//End of Definitions
//--------------------------------------


//----------------------------------
//Start of code to run
//---------------------------------

calendarInit();


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