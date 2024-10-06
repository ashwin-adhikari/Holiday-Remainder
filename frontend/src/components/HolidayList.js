import React, { useState, useEffect } from 'react';

function HolidayList() {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Handle duplication prevention (if necessary, depending on data structure)
    const uniqueHolidays = holidays.filter((holiday, index, self) =>
        index === self.findIndex(h => h.bs_day === holiday.bs_day && h.bs_month === holiday.bs_month && h.bs_year === holiday.bs_year)
    );

      // Group holidays by month
  const groupedHolidays = holidays.reduce((acc, holiday) => {
    const month = holiday.bs_month;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(holiday);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Array of month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Holiday Calendar</h2>

      {/* Render the holidays grouped by month */}
      {Object.keys(groupedHolidays).map((month) => (
        <div key={month} className="mb-8">
          {/* Month Header */}
          <h3 className="text-2xl font-semibold mb-4">{monthNames[month - 1]}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render each holiday in the month */}
            {groupedHolidays[month].map((holiday, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-md bg-gray-50">
                <div className="font-bold text-xl mb-2">
                  {holiday.bs_day}/{holiday.bs_month}/{holiday.bs_year}
                </div>
                <div className="text-gray-700">
                  {holiday.events
                    .filter((event) => event.event_en !== 'Unknown')
                    .map((event) => event.event_en)
                    .join(', ') || 'No events'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HolidayList;
