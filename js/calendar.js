//------------------------------
//Define Functions and Initial Variables
//----------------------------------

var currentDateData = new Date();//grabs date data as of loading of website


var weekIndex = 0; //number of weeks displaced from current week (signed)


const MILLISECONDS_IN_DAY = 86400000;

//initializes calendar with current date and populates calendar 
function calendarInit() {
    generateCalendar(getSunday(new Date()));
}

//grabs date of sunday of current week
function getSunday(dateToCheck) {
    var sundayDate = dateToCheck;
    for (var i = dateToCheck.getDay(); i > 0; i--) { //calculate the date of Sunday of the current week
        sundayDate = adjustDate(sundayDate, -1);
    }
    return sundayDate;
}

//generates each of the boxes for each day of the week
function generateCalendar(sundayDate) {
    //generate header
    saturdayDate = adjustDate(sundayDate, 6);
    document.getElementById('calendarDateRangeHeader').innerHTML = parseInt(sundayDate.getMonth()+1)+"/"+sundayDate.getDate()+"/"+sundayDate.getFullYear()+" - "+parseInt(saturdayDate.getMonth()+1)+"/"+saturdayDate.getDate()+"/"+saturdayDate.getFullYear()
    //generate boxes for each day
    for (var i = 0; i < 7; i++) {
        var boxDate = adjustDate(sundayDate, i).getDate();
        document.getElementById('week').innerHTML += `
        <div class="col day-box">
            <p>Lorem ipsum dolor sit amet,` + boxDate + ` </p>
        </div>
        `;
    }
}

//properly handles adjusting date, change is in unit of days
function adjustDate(oldDate, change) {
    newDate = new Date(parseInt(oldDate.getTime()+MILLISECONDS_IN_DAY*change));
    return newDate;
}

//Changes calendar display to next week
function nextWeek() {
    weekIndex++;
    var newSundayDate = getSunday(adjustDate(new Date(), weekIndex*7));//calculate the new sunday date based on the selected week
    document.getElementById('week').innerHTML = "";//clear calendar to be regenerated
    generateCalendar(newSundayDate);
}

//Changes calendar display to previous week week
function prevWeek() {
    weekIndex--;
    var newSundayDate = getSunday(adjustDate(new Date(), weekIndex*7));//calculate the new sunday date based on the selected week
    document.getElementById('week').innerHTML = "";//clear calendar to be regenerated
    generateCalendar(newSundayDate);

}

//switches view to day's schedule
function agendaView() {

}
//-------------------------------
//End of Definitions
//---------------------------------------


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