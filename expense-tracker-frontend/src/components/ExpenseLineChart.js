import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    LabelList
} from 'recharts';
import './component.css';


const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const ExpenseLineChart = ({ expenses }) => {
    const monthlyTotals = Array(12).fill(0);

    expenses.forEach((exp) => {
        const date = new Date(exp.date);
        if (exp.type === 'expense') {
            monthlyTotals[date.getMonth()] += parseFloat(exp.amount);
        }
    });

    const data = months.map((month, index) => ({
        month,
        amount: monthlyTotals[index]
    }));

    const maxAmount = Math.max(...monthlyTotals);
    const yAxisDomainMax = maxAmount > 0 ? maxAmount * 1.2 : 100;

    return (
        <div className="line-chart-section">
            <h2>Yearly Expense Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, yAxisDomainMax]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#82ca9d" strokeWidth={2}>
                        <LabelList dataKey="amount" position="top" offset={10} />
                    </Line>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseLineChart;