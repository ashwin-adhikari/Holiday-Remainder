import React, { useEffect, useState } from 'react';


const Events = () => {
    const [events, setEvents] = useState([]);
    

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

    
    return (
        <div>
            <h1>Events:</h1>
            <ol>
                {events.filter(event=> event.is_holiday && event.event_np).map(event=>(
                    <li key={event.id}>
                        {event.event_np}/{event.event_en} - Event
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Events;
