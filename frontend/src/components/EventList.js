import React, { useState, useEffect } from 'react';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/events/');  // Check the correct API endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            console.log('Fetched events:', data);  // Log fetched data to verify structure
            setEvents(data);  // Update state with fetched events
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (events.length === 0) {
        return <div>No events to display</div>;  // Message when there are no events
    }

    return (
        <div>
            <h2>Event List</h2>
            <ul>
                {events
                    .filter(event => event.event_en && event.event_en !== 'Unknown') // Filter out unwanted events
                    .map((event, index) => (
                        <li key={index}>
                            {event.event_en || 'Unknown'}
                            ({event.event_np || 'Unknown'}) - {event.is_holiday ? 'Holiday' : 'Event'}
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default EventList;
