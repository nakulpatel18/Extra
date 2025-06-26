import React from 'react';

const IncomeList = ({ incomes, onEdit, onDelete }) => (
    <div className="list-section">
        <h2>Incomes</h2>
        <ul>
            {incomes.map((income) => (
                <li key={income._id}>
                    <span>{income.title} - ₹{income.amount} - {income.category}</span>
                    <div className="actions">
                        <button onClick={() => onEdit(income)}>Edit</button>
                        <button onClick={() => onDelete(income._id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default IncomeList;

