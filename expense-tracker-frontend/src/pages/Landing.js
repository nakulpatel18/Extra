import React from 'react';
import './Landing.css';

const features = [
    {
        title: 'Track Expenses',
        description: 'Add, view, edit, and delete daily expenses with categories.'
    },
    {
        title: 'Track Incomes',
        description: 'Record income sources like salary, gifts, or investments.'
    },
    {
        title: 'Monthly Overview',
        description: 'View your monthly summary of income and expenses.'
    },
    {
        title: 'Interactive Charts',
        description: 'Visualize your spending patterns using bar charts.'
    }
];

const Landing = () => {
    return (
        <div className="landing-container">
            <h2>Welcome to Expense Tracker</h2>
            <p className="landing-intro">Manage your finances effortlessly with our powerful features.</p>
            <div className="feature-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-box">
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Landing;
