//------------------------------
//Define Functions and Initial Variables
//----------------------------------

var currentDateData = new Date();//grabs date data as of loading of website
var date = currentDateData.getDate();
var month = currentDateData.getMonth() + 1; //months are counted starting at 0 in JS
var year = currentDateData.getFullYear();
var dayOfWeek = currentDateData.getDay();

var weekIndex = 0; //number of weeks displaced from current week (signed)
var monthIndex = 0;//number of months displaced from current month (signed)

//initializes calendar with current data populates calendar 
function calendarInit() {
    generateCalendar(getSunday(date));
}

//grabs date of sunday of current week
function getSunday(dateToCheck) {
    var sundayDate = dateToCheck;
    for (var i = dayOfWeek; i > 0; i--) { //calculate the date of Sunday of the current week
        sundayDate--;
    }
    return sundayDate;
}

//generates each of the boxes for each day of the week
function generateCalendar(sundayDate) {
    //generate boxes for each day
    for (var i = 0; i < 7; i++) {
        boxDate = parseInt(sundayDate + i);
        if (boxDate > maxDaysOfMonth(month+monthIndex)) {
            boxDate -= maxDaysOfMonth(month+monthIndex);
            monthIndex++;
        }
        document.getElementById('week').innerHTML += `
        <div class="col day-box">
            <p>Lorem ipsum dolor sit amet,` + boxDate + ` </p>
        </div>
        `;
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

//Changes calendar display to next week
function nextWeek() {
    weekIndex++;
    newSundayDate = getSunday(currentDateData.getDate()+(7*weekIndex));//calculate the new sunday date based on the selected week
    document.getElementById('week').innerHTML = "";//clear calendar to be regenerated
    generateCalendar(newSundayDate);
}

//Changes calendar display to previous week week
function prevWeek() {
    weekIndex--;

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