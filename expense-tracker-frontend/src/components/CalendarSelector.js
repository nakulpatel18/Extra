// -- components/CalendarSelector.js --

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './component.css'

const CalendarSelector = ({
    selectedDate,
    setSelectedDate,
    setActiveMonthDate,
    highlightedDates = []
}) => {
    const handleMonthChange = ({ activeStartDate }) => {
        if (setActiveMonthDate) {
            setActiveMonthDate(activeStartDate);
        }

        if (selectedDate && setSelectedDate) {
            const newDate = new Date(activeStartDate);

            // Clamp day to the last day of the new month
            const day = Math.min(
                selectedDate.getDate(),
                new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()
            );
            newDate.setDate(day);

            setSelectedDate(newDate);
        }
    };

    // Convert date to local YYYY-MM-DD format (avoiding timezone shifts)
    const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Check if date should be highlighted
    const isHighlighted = (date) => {
        const localDateStr = getLocalDateString(date);
        return highlightedDates.includes(localDateStr);
    };

    return (
        <div className="calendar-wrapper">
            <h2>Select Date</h2>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="react-calendar"
                onActiveStartDateChange={handleMonthChange}
                tileClassName={({ date, view }) => {
                    if (view === 'month' && isHighlighted(date)) {
                        return 'highlight-date';
                    }
                    return null;
                }}
            />
        </div>
    );
};

export default CalendarSelector;
