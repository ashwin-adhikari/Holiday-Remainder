import React, { useState } from 'react';

const Popup = ({ holidays, onClose }) => {
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    // Function to handle the holiday click
    const handleHolidayClick = (holiday) => {
        // Toggle the selected holiday if it is clicked again, otherwise set it as selected
        setSelectedHoliday((prev) => (prev === holiday ? null : holiday));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Popup Container */}
            <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                >
                    &times;
                </button>
                
                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-center">Holidays Found:</h3>

                {/* Holiday List */}
                {holidays.map((holiday) => (
                    <div key={holiday.id} className="border rounded-lg p-4 shadow-md bg-gray-50 hover:bg-blue-100 hover:shadow-lg transition duration 300 transform hover:-translate-y-1 cursor-pointer">
                        <button
                            onClick={() => handleHolidayClick(holiday)}
                            className="font-semibold text-left w-full text-gray-800 hover:text-blue-600"
                        >
                            {holiday.weekday_En}, {holiday.bs_day}/{holiday.bs_month}/{holiday.bs_year}
                        </button>

                        {/* Conditionally render events if this holiday is selected */}
                        {selectedHoliday === holiday && (
                            <div className="mt-2">
                                <p className="font-semibold">Events on this day:</p>
                                {holiday.events.length > 0 ? (
                                    holiday.events.map((event, idx) => (
                                        <p key={idx} className="text-red-600">{event.event_en}</p>
                                    ))
                                ) : (
                                    <p className="text-green-600">No events for this holiday</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Close Button (Extra for Mobile) */}
                <button
                    onClick={onClose}
                    className="mt-6 bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Popup;
