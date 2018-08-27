var currentDateData = new Date();
var date = currentDateData.getDate();
var month = currentDateData.getMonth() + 1; //months are counted starting at 0 in JS
var year = currentDateData.getFullYear();
var dayOfWeek = currentDateData.getDay();

//initializes calendar with current data populates calendar 
function calendarInit() {
    var sundayDate = date;
    for (var i = dayOfWeek; i > 0; i--) { //calculate the date of Sunday of the current week
        sundayDate--;
    }
    generateCalendar(sundayDate);

}

//generates each of the boxes for each day of the week
function generateCalendar(sundayDate) {
    //generate boxes for each day
    for (var i = 0; i < 7; i++) {
        boxDate = parseInt(sundayDate + i);
        if (boxDate > maxDaysOfMonth(month)) {
            boxDate -= maxDaysOfMonth(month);
        }
        document.getElementById('week').innerHTML += `
        <div class="col day-box" id="mon">
            <p>Lorem ipsum dolor sit amet,` + boxDate + ` </p>
        </div>
        `;
    }
}

function maxDaysOfMonth(monthToCheck) {
    if ((monthToCheck <= 7 && monthToCheck%2===1) || (monthToCheck >= 8 && monthToCheck%2===0)) {
        return 31;
    }else if(monthToCheck === 2) {//special condition for February
        //check for leap year
        if(year%400 === 0){
            return 27;
        }else if(year%4 === 0 && year%100 != 0) {
            return 28;
        }else {
            return 27;
        }
    }else {
        return 30;
    }
}

calendarInit();

//Changes calendar display to next week
function nextWeek() {

}

//Changes calendar display to previous week week
function prevWeek() {

}

//switches view to day's schedule
function agendaView() {

}

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