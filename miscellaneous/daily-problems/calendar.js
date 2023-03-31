function generate_year_range(start, end) {
    var years = "";
    for (var year = start; year <= end; year++) {
      years += "<option value='" + year + "'>" + year + "</option>";
    }
    return years;
  }
  
  var today = new Date();
  var currentMonth = today.getMonth();
  var currentYear = today.getFullYear();
  var selectYear = document.getElementById("year");
  var selectMonth = document.getElementById("month");
  
  
  var createYear = generate_year_range(2023, 2023);
  /** or
   * createYear = generate_year_range( 1970, currentYear );
   */
  
  document.getElementById("year").innerHTML = createYear;
  
  var calendar = document.getElementById("calendar");
  var lang = calendar.getAttribute('data-lang');
  
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  var dayHeader = "<tr>";
  for (day in days) {
    dayHeader += "<th data-days='" + days[day] + "'>" + days[day] + "</th>";
  }
  dayHeader += "</tr>";
  
  document.getElementById("thead-month").innerHTML = dayHeader;
  
  
  monthAndYear = document.getElementById("monthAndYear");
  showCalendar(currentMonth, currentYear);
  
  
  
  function next() {
    if (currentMonth !== 3 || currentYear !== 2023) {
      currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
      currentMonth = (currentMonth + 1) % 12;
      showCalendar(currentMonth, currentYear);
      links ()
    }
  }
  
  function previous() {
    if (currentMonth !== 0 || currentYear !== 2023) {
      currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
      currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
      showCalendar(currentMonth, currentYear);
      links();
    }
  }
  
  function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
    links () 
  }
  
  function showCalendar(month, year) {
  
    var firstDay = (new Date(year, month)).getDay();
  
    tbl = document.getElementById("calendar-body");
  
  
    tbl.innerHTML = "";
  
  
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;
  
    // creating all cells
    var date = 1;
    for (var i = 0; i < 6; i++) {
      var row = document.createElement("tr");
  
      for (var j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          cell = document.createElement("td");
          cellText = document.createTextNode("");
          cell.appendChild(cellText);
          row.appendChild(cell);
        } else if (date > daysInMonth(month, year)) {
          break;
        } else {
          cell = document.createElement("td");
          cell.setAttribute("data-date", date);
          cell.setAttribute("data-month", month + 1);
          cell.setAttribute("data-year", year);
          cell.setAttribute("data-month_name", months[month]);
          cell.className = "date-picker";
          cell.innerHTML = "<span>" + date + "</span>";
  
          if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
            cell.className = "date-picker selected";
          }
          row.appendChild(cell);
          date++;
        }
  
  
      }
  
      tbl.appendChild(row);
    }
  
  }
  
  function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }
  
  function links () {
  document.querySelectorAll('td.date-picker > span').forEach(element => {
    var year = element.parentElement.getAttribute('data-year');
    var month = element.parentElement.getAttribute('data-month');
    var day =  element.textContent;
    if (month.length === 1) {
      month = "0" + month;
    }
      if (day.length === 1) {
      day = "0" + day;
    }
    element.innerHTML = '<a href="../daily-problems/' + year + '-' + month + '-' + day + '">' + element.textContent + '</a> '
  })
  }
  
  links ()