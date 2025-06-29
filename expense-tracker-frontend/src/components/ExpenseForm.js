import React, { useEffect, useState } from 'react';
import './component.css';


const ExpenseForm = ({ onSubmit, selectedDate, editingItem, clearEdit }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [type, setType] = useState('expense'); 
    const [date, setDate] = useState(selectedDate);

    const expenseCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'SIP', 'Auto', 'Entertainment', 'Health', 'General', 'Other'];
    const incomeCategories = ['Salary', 'Investment', 'Savings', 'Previous Month', 'Rental Income', 'Gift', 'Other'];

    const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

    useEffect(() => {
        if (editingItem) {
            setTitle(editingItem.title);
            setAmount(editingItem.amount);
            setType(editingItem.type);
            setDate(new Date(editingItem.date));

            // Set category and custom category when editing an item
            const itemCategories = editingItem.type === 'income' ? incomeCategories : expenseCategories;
            if (itemCategories.includes(editingItem.category)) {
                setCategory(editingItem.category);
                setCustomCategory('');
            } else {
                setCategory('Other');
                setCustomCategory(editingItem.category);
            }
        } else {
            // Reset form fields for a new entry
            setTitle('');
            setAmount('');
            setDate(selectedDate);
            setCategory('');
            setCustomCategory('');
        }
    }, [editingItem, selectedDate]);

    // Reset category and custom category when the type changes
    useEffect(() => {
        if (!editingItem || (editingItem && editingItem.type !== type)) {
            setCategory('');
            setCustomCategory('');
        }
    }, [type, editingItem]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !amount || !date || (!category && !customCategory)) {
            alert('Please fill in all fields');
            return;
        }
        const selectedCategory = category === 'Other' ? customCategory : category;
        onSubmit({ title, amount, category: selectedCategory, type, date });

        // Reset the form state properly after submission
        setTitle('');
        setAmount('');
        setCategory('');
        setCustomCategory('');
        setType('expense');
        setDate(new Date()); // Reset to default date
    };

    const getLocalDateString = (date) => {
        return date
            ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .split('T')[0]
            : '';
    };

    return (
        <div className="form-section">
            <h1>{editingItem ? 'Edit Entry' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    type="date"
                    value={getLocalDateString(date)}
                    onChange={(e) => setDate(new Date(e.target.value))}
                />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {currentCategories.filter(cat => cat !== 'Other').map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                    <option value="Other">Other</option>
                </select>
                {category === 'Other' && (
                    <input
                        type="text"
                        placeholder="Custom Category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                    />
                )}
                <button type="submit">
                    {editingItem ? 'Update' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
                </button>
                {editingItem && <button type="button" onClick={clearEdit}>Cancel</button>}
            </form>
        </div>
    );
};

export default ExpenseForm;