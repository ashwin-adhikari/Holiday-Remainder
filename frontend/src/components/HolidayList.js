import React, { useEffect, useState } from 'react';

const Holidays = () => {
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/holidays/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHolidays(data);
            } catch (error) {
                console.error('Error fetching holidays:', error);
            }
        };

        fetchHolidays();
    }, []);

    return (
        <div>
            <h1>Holidays</h1>
            <ol>
                {holidays.map(holiday => (
                    <li key={holiday.id}>
                        {holiday.bs_day}/{holiday.bs_month}/{holiday.bs_year} - {holiday.is_holiday ? "Holiday" : "Not a Holiday"}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Holidays;
