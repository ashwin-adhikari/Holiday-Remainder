import React, { useState, useEffect, useRef, useCallback } from "react";
import NepaliDate from "nepali-date";
import Popup from "./Popup";

function HolidayList() {
  const [holidays, setHolidays] = useState([]);
  const [currentYearHolidays, setCurrentYearHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHoliday, setSelectedHoliday] = useState()
  const [searchedHolidays, setSearchedHolidays] = useState([])
  const [showPopup, setShowPopup] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new NepaliDate().getYear());

  const monthRefs = useRef({});
  // Function to fetch holiday data from the backend
  const fetchHolidays = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/holidays/?year=${selectedYear}`);
      const data = await response.json();
      return data; // Update holidays state
    } catch (error) {
      console.error("Error fetching holidays:", error);
    } finally {
      setLoading(false); // Stop loading indicator once data is fetched
    }
  };

  // Use effect to fetch holidays when the component mounts
  useEffect(() => {
    const fetchCurrentYearHolidays = async () => {
        const currentYearData = await fetchHolidays(new NepaliDate().getYear());
        setCurrentYearHolidays(currentYearData); // Set holidays for the current year
    };

    fetchCurrentYearHolidays(); // Fetch current year holidays initially
}, []);

// Use effect to fetch holidays for selected year
useEffect(() => {
    const fetchSelectedYearHolidays = async () => {
        const selectedYearData = await fetchHolidays(selectedYear);
        setHolidays(selectedYearData); // Update holidays state for selected year
    };

    fetchSelectedYearHolidays(); // Fetch holidays for selected year
}, [selectedYear]);

  const today = new NepaliDate();
  const formattedDate = today.format("dddd,MMMM d,YYYY");
  const currentBsMonth = today.getMonth() + 1;
  const currentBsYear = today.getYear();
  const currentBsDay = today.getDate();

  // Filter out holidays that are in the past for selected year
  const filterUpcomingHolidays = currentYearHolidays.filter((holiday) => {
    if (holiday.bs_year > currentBsYear) {
      return true; // Future year
    } else if (holiday.bs_year === currentBsYear) {
      if (holiday.bs_month > currentBsMonth) {
        return true; // Future month in the current year
      } else if (holiday.bs_month === currentBsMonth) {
        return holiday.bs_day >= currentBsDay; // Future day in the current month
      }
    }
    return false;
  });

  // Sort holidays by month and then by day within each month
  const sortedHolidays = filterUpcomingHolidays.sort((a, b) => {
    if (a.bs_month === b.bs_month) {
      return a.bs_day - b.bs_day; // Sort by day if the month is the same
    }
    return a.bs_month - b.bs_month; // Sort by month
  });

  // Group holidays by month
  const groupedHolidays = [...Array(12).keys()].reduce((acc, i) => {
    const month = i + 1;
    acc[month] = holidays.filter((holiday) => holiday.bs_month === month);
    return acc;
  }, {});

  const handleHolidayClick = useCallback((holiday) => {
    setSelectedHoliday(selectedHoliday === holiday ? null : holiday);
    }, [selectedHoliday]);

  const nextHoliday = sortedHolidays.length > 0 ? sortedHolidays[0] : null;

  const calculateDaysToHoliday = (holiday) => {
    const holidayDate = new NepaliDate(
      holiday.bs_year,
      holiday.bs_month - 1,
      holiday.bs_day
    );
    const todayDate = new NepaliDate(
      currentBsYear,
      currentBsMonth - 1,
      currentBsDay
    );
    const timeDiff = holidayDate.getTime() - todayDate.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return Math.ceil(dayDiff);
  };

  const searchMonth = () => {
    const monthName = document.querySelector("input").value.trim().toLowerCase();
    const monthIndex = monthNames.findIndex((name) => name.toLowerCase() === monthName)
    if (monthIndex === -1) {
      alert("Month not found");
      return;
    }
    const holidaysForMonth = holidays.filter(holiday => holiday.bs_month === (monthIndex + 1));
    if (holidaysForMonth.length > 0) {
      setSearchedHolidays(holidaysForMonth);
      setShowPopup(true); // Show popup when there are results
    } else {
      alert("No holidays found for this month");
    }
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setSearchedHolidays([]); // Reset selected holiday when closing
  };

  const generateYearOptions = () => {
    const currentYear = new NepaliDate().getYear();
    return Array.from({ length: 96 }, (_, i) => currentYear - 80 + i); // Generate years from current - 80 to current + 15
    
  };

  const handleYearChange = (event) => {
   setSelectedYear(Number(event.target.value));
  };
  const resetToCurrentYear = () => {
    setSelectedYear(new NepaliDate().getYear());
};

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (sortedHolidays.length === 0) {
    return <div className="text-center mt-10">No upcoming holidays</div>; // Message when there are no upcoming holidays
  }

  // Array of month names for display
  const monthNames = [
    "Baisakh",
    "Jestha",
    "Ashad",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra",
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Holiday Calendar</h2>

      <div className="container mx-auto p-4 border rounded-lg p-4 bg-blue-100 mb-6 flex justify-between items-start">
        <div className="text-left">
          <h3 className="text-3xl font-bold mb-6">Todays Date:</h3>
          <p className="text-2xl font-semibold mb-4 ">{formattedDate}</p>
          <div className="text-right">
            {/* Year Selection Dropdown */}
            <div className="text-left">
              <label htmlFor="yearSelect" className="text-xl">Select Year: </label>
              <select
                id="yearSelect"
                value={selectedYear}
                onChange={handleYearChange}
                className="p-2 border rounded"
                style={{ maxHeight: "200px", overflowY: "auto" }} // Make dropdown scrollable
              >
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button onClick={resetToCurrentYear} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
                           Current Year
              </button>
            </div>
          </div>
        </div>


        <div className="text-right">
          {nextHoliday && (
            <div className="text-left">
              <p className="text-3xl font-bold mb-2">
                {" "}
                Next Holiday
                {calculateDaysToHoliday(nextHoliday) !== 0
                  ? " in: " +
                  calculateDaysToHoliday(nextHoliday) +
                  " days."
                  : " "}
              </p>
              <p className="text-xl font-semibold ">
                {nextHoliday.weekday_En}, {nextHoliday.bs_month_en}{" "}
                {nextHoliday.bs_day} {nextHoliday.event_en}
              </p>

              {Array.isArray(nextHoliday.events) && nextHoliday.events.length > 0 ? (
                nextHoliday.events.map((event, idx) => (
                  <p key={idx} className="text-red-600 ">
                    {event.event_en}
                  </p>
                ))
              ) : (
                <p className="text-green-600">No events for this holiday</p>
              )}
            </div>
          )}
          <div className="mt-4 text-left">
            <input id="input" type="text" placeholder="Baisakh" className="p-2" />
            <button onClick={searchMonth} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
              Search
            </button>
          </div>
          {showPopup && searchedHolidays.length > 0 && (
            <Popup holidays={searchedHolidays} onClose={handleClosePopup} />
          )}
        </div>
      </div>
      {/* Holiday for each months*/}
      <div className="flex flex-row">
        <div className="w-full md:w-2/3">
          {Object.keys(groupedHolidays).map((month) => (
            <div
              key={month}
              ref={(el) => (monthRefs.current[month] = el)}
              className="mb-8"
            >
              {/* Month Header */}
              <h3 className="text-2xl font-semibold mb-4">
                {monthNames[month - 1]}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Render each holiday in the month */}
                {groupedHolidays[month].map((holiday, index) => {
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 shadow-md bg-gray-50 hover:bg-blue-100 hover:shadow-lg transition duration 300 transform hover:-translate-y-1 cursor-pointer" ${selectedHoliday === holiday ? "bg-blue-100" : ""
                        }`}
                      onClick={() => handleHolidayClick(holiday)}
                    >
                      <div className="font-semi-bold text-xl mb-2 ">
                        {holiday.weekday_En}, {holiday.bs_day}/
                        {holiday.bs_month}/{holiday.bs_year}
                      </div>

                      {selectedHoliday === holiday && (
                        <div className="text-gray-700  mt-2">
                          <p className="font-semibold text-gray-800">
                            Events on this day:
                          </p>
                          {holiday.events.length > 0 ? (
                            holiday.events
                              .filter((event) => event.event_en !== "Unknown")
                              .map((event, idx) => (
                                <p key={idx} className="text-red-600 mb-2">
                                  {event.event_en}
                                </p>
                              ))
                          ) : (
                            <p className="text-green-600">
                              No events for this holiday
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="w-auto md:w-1/3 ml-6 inline-block ">
          <h3 className="text-xl font-bold mb-4">Upcoming Holidays</h3>
          <ul className="space-y-4">
            {sortedHolidays.slice(0, 5).map((holiday, index) => (
              <li
                key={index}
                className="p-4 border rounded-lg shadow bg-blue-50 "
              >
                <div className="font-semibold">
                  {holiday.bs_day !== currentBsDay
                    ? holiday.weekday_En +
                    "," +
                    holiday.bs_day +
                    "/" +
                    holiday.bs_month +
                    "/" +
                    holiday.bs_year
                    : "Today"}
                </div>
                <div>
                  {holiday.events.length > 0 ? (
                    holiday.events
                      .filter((event) => event.event_en !== "Unknown")
                      .map((event, idx) => (
                        <p key={idx} className="text-red-600">
                          {event.event_en}
                        </p>
                      ))
                  ) : (
                    <p className="text-green-600">No events</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HolidayList;
