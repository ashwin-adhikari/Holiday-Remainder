import React, { useEffect, useState } from 'react';
import Holidays from './HolidayList';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/events/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

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
            <h1>Events:</h1>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        {event.event_np}/{event.event_en} - {event.is_holiday ? "Event" : "Not an event"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Events;
