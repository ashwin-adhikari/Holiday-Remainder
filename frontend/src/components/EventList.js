import React, { useState, useEffect } from 'react';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/events/'); 
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
        return <div className='text-center mt-10'>Loading...</div>;
    }

    if (events.length === 0) {
        return <div className='text-center mt-10'>No events to display</div>;  // Message when there are no events
    }

    return (
        <div className='container mx-auto p-4'>
    
            <h2 className="text-3xl font-bold mb-6 text-center">Event List</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {events
                    .filter(event => event.event_en && event.event_en !== 'Unknown') // Filter out unwanted events
                    .map((event, index) => (
                        <div key={index} className='border p-4 rounded-lg shadow-lg bg-white hover:bg-blue-100 hover:shadow-xl transition duration-300 transfoem hover:-translate-y-1 cursor-pointer'>
                            <h3 className="text-lg font-semibold mb-2"> {event.event_en || 'Unknown'}</h3>
                            <p className="text-gray-600 mb-2">{event.event_np || 'Unknown'}</p>
                            <p className={event.is_holiday ? 'text-red-500':'text-green-500'}>{event.is_holiday ? 'Holiday' : 'Event'}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default EventList;
