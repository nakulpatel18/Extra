import React from 'react';
import './Landing.css';

const features = [
    {
        title: 'Track Expenses & Incomes',
        description: 'Effortlessly add, view, edit, and delete all your daily expenses and incomes, categorized for clear financial tracking.'
    },
    {
        title: 'Secure Authentication',
        description: 'Register, log in securely with robust authentication, and easily manage your account with password reset options.'
    },
    {
        title: 'Personalized Profile',
        description: 'Manage your user profile, update personal details, and change your password with ease.'
    },
    {
        title: 'Monthly Spending Insights',
        description: 'Get a clear monthly overview of your income and expenses, helping you understand your financial position.'
    },
    {
        title: 'Admin Control Panel',
        description: 'Admins can manage all users and view, sort, and delete all transactions recorded across the platform.'
    },
    {
        title: 'Interactive Charts',
        description: 'Visualize your spending patterns using bar charts./nVisualize your monthly spending trends with an interactive line chart'
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
