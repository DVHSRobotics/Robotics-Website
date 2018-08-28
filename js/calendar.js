//------------------------------
//Define Functions and Initial Variables
//----------------------------------
var weekIndex = 0; //number of weeks displaced from current week (signed)
var daysOfWeek = ['sun','mon','tue','wed','thu','fri','sat'];

//initializes calendar with current date and populates calendar 
function calendarInit() {
    console.log('Initializing calendar...');
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
                            <div class="col-sm-12">
                                <p>Lorem ipsum dolor sit amet </p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }
}

//properly handles adjusting date, change is in unit of days
function adjustDate(oldDate, change) {
    var newDate = oldDate;
    if (change > 0) { //this block runs if change is positive
        for (var i = 0; i < change; i++) {
            if (newDate.getDate() + 1 > maxDaysOfMonth(newDate.getMonth() + 1)) {
                //if adding a day causes the date to exceed the days of the month, set the date to the first of next month
                newDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1);
            } else {
                //add one day to the date
                newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
            }
        }
    } else if (change === 0) {
        //if you don't adjust the date then just return the date
        return newDate;
    } else { //this block runs if change is negative
        for (var i = 0; i < Math.abs(change); i++) {
            if (newDate.getDate() - 1 < 1) {
                //if subtracting a day causes it to be less than 1, set date to last day of previous month
                newDate = new Date(newDate.getFullYear(), newDate.getMonth() - 1, maxDaysOfMonth(newDate.getMonth()));
            } else {
                //subtracts one day from the date
                newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() - 1);
            }
        }
    }
    return newDate;
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
    document.getElementById('week').innerHTML = ""; //clear calendar to be regenerated
    generateCalendar(newSundayDate);
}

//Changes calendar display to previous week week
function prevWeek() {
    weekIndex--;
    var newSundayDate = getSunday(adjustDate(new Date(), weekIndex * 7)); //calculate the new sunday date based on the selected week
    document.getElementById('week').innerHTML = ""; //clear calendar to be regenerated
    generateCalendar(newSundayDate);

}

//switches view to day's schedule
function agendaView(day) {
    document.getElementById('week').innerHTML = ""; //clear calendar to be regenerated
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