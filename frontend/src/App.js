// src/App.js

import React from 'react';
import HolidayList from './components/HolidayList';
import EventList from './components/EventList';

const App = () => {
    return (
        <div>
            <HolidayList />
            <EventList />
        </div>
    );
};

export default App;
