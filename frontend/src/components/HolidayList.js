import React, { useState, useEffect } from 'react';

function HolidayList() {
    // Declare state to store holidays and events
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch holiday data from the backend
    const fetchHolidays = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/holidays/'); // Assuming your API endpoint is '/api/holidays'
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

    
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Holiday List</h2>
            <ul>
                {uniqueHolidays.map((holiday, index) => (
                    <li key={index}>
                        {holiday.bs_day}/{holiday.bs_month}/{holiday.bs_year} - {holiday.events.filter(event => event.event_en !== 'Unknown').map(event => event.event_en).join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HolidayList;
