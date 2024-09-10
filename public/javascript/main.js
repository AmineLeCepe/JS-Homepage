let hour = document.getElementById('hour');
let minute = document.getElementById('minute');
let second = document.getElementById('second');
let day = document.getElementById('day');
let month = document.getElementById('month');
let year = document.getElementById('year');

const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function time () {
    hour.innerHTML = new Date().getHours();
    minute.innerHTML = new Date().getMinutes();
    second.innerHTML = new Date().getSeconds();
    day.innerHTML = new Date().getDay();
    month.innerHTML = monthList[new Date().getMonth()];
    year.innerHTML = new Date().getFullYear();
}

time();

setInterval(time, 1000);