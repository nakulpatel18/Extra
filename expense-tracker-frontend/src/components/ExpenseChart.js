import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from 'recharts';
import './component.css'

const ExpenseChart = ({ chartData }) => {
    const maxAmount = chartData.reduce((max, item) => Math.max(max, item.amount), 0);
    const yAxisDomainMax = maxAmount > 0 ? maxAmount * 1.2 : 100; 

    return (
        <div className="chart-section">
            <h2>Monthly Expense Chart</h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, yAxisDomainMax]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" minPointSize={5}>
                        <LabelList dataKey="amount" position="top" offset={10} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseChart;
