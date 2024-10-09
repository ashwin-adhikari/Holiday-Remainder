import React, { useState, useEffect } from 'react';
import NepaliDate from "nepali-date";

function HolidayList() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  // Function to fetch holiday data from the backend
  const fetchHolidays = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/holidays/');
      const data = await response.json();
      setHolidays(data);  // Update holidays state
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);  // Stop loading indicator once data is fetched
    }
  };

  // Use useEffect to fetch holidays when the component mounts
  useEffect(() => {
    fetchHolidays();
  }, []);

  const today = new NepaliDate();
  const formattedDate = today.format("dddd,MMMM d,YYYY");

  // Filter out holidays that are in the past
  const filterUpcomingHolidays = holidays.filter((holiday) => {
    const todayen = new Date();
    const holidayDate = new Date(holiday.bs_year, holiday.bs_month - 1, holiday.bs_day);
    return holidayDate >= todayen;  // Only show holidays on or after today
  });

  // Sort holidays by month and then by day within each month
  const sortedHolidays = filterUpcomingHolidays.sort((a, b) => {
    if (a.bs_month === b.bs_month) {
      return a.bs_day - b.bs_day;  // Sort by day if the month is the same
    }
    return a.bs_month - b.bs_month;  // Sort by month
  });

  // Group holidays by month
  const groupedHolidays = sortedHolidays.reduce((acc, holiday) => {
    const month = holiday.bs_month;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(holiday);
    return acc;
  }, {});

  const handleHolidayClick = (holiday) => {
    if (selectedHoliday === holiday) {
      setSelectedHoliday(null);
    } else {
      setSelectedHoliday(holiday);
    }
  };


  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (sortedHolidays.length === 0) {
    return <div className="text-center mt-10">No upcoming holidays</div>;  // Message when there are no upcoming holidays
  }

  // Array of month names for display
  const monthNames = [
    'Baisakh', 'Jestha', 'Ashad', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik',
    'Mangshir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Holiday Calendar</h2>
      <div className='container mx-auto p-4 border rounded-lg p-4 bg-blue-100'> <h3 className='text-3xl font-bold mb-6'>Todays Date:</h3><p className='text-2xl font-semibold mb-4'>{formattedDate}</p></div>
      {/* Render the holidays grouped by month */}
      {Object.keys(groupedHolidays).map((month) => (
        <div key={month} className="mb-8">
          {/* Month Header */}
          <h3 className="text-2xl font-semibold mb-4">{monthNames[month - 1]}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render each holiday in the month */}
            {groupedHolidays[month].map((holiday, index) => {

              return (
                <div key={index} className={`border rounded-lg p-4 shadow-md bg-gray-50 hover:bg-blue-100 hover:shadow-lg transition duration 300 transform hover:-translate-y-1 cursor-pointer" ${selectedHoliday === holiday ? 'bg-blue-100' : ''}`}
                  onClick={() => handleHolidayClick(holiday)}>
                  <div className="font-semi-bold text-xl mb-2 ">
                    {holiday.weekday_En},  {holiday.bs_day}/{holiday.bs_month}/{holiday.bs_year}
                  </div>
                  
                  {selectedHoliday === holiday && (
                    <div className="text-gray-700  mt-2">
                      <p className='font-semibold text-red-500'>Events on this day:</p>
                      {holiday.events.length > 0 ? (
                        holiday.events.filter(event => event.event_en !== 'Unknown').map((event, idx) => (
                          <p key={idx}>{event.event_en}</p>
                        ))
                      ) : (
                        <p>No events for this holiday</p>
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
  );
}

export default HolidayList;
