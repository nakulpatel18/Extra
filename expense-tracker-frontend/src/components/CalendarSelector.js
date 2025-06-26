import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarSelector = ({ selectedDate, setSelectedDate, setActiveMonthDate }) => {
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

    return (
        <div className="calendar-wrapper">
            <h2>Select Date</h2>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="react-calendar"
                onActiveStartDateChange={handleMonthChange}
            />
        </div>
    );
};

export default CalendarSelector;
