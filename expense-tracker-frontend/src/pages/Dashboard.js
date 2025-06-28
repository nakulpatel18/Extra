// import React, { useState, useEffect, useRef } from 'react';
// import api from '../api/api';
// import CalendarSelector from '../components/CalendarSelector';
// import ExpenseForm from '../components/ExpenseForm';
// import ExpenseList from '../components/ExpenseList';
// import IncomeList from '../components/IncomeList';
// import ExpenseChart from '../components/ExpenseChart';
// import '../App.css';

// function Dashboard() {
//     const [expenses, setExpenses] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [activeMonthDate, setActiveMonthDate] = useState(new Date());
//     const [editingItem, setEditingItem] = useState(null);
//     const formRef = useRef(null);

//     const fetchExpenses = async () => {
//         try {
//             const res = await api.get('/expenses');
//             setExpenses(res.data);
//         } catch (err) {
//             console.error('Error fetching expenses:', err);
//             // Handle unauthorized errors by redirecting to login
//             if (err.response && err.response.status === 401) {
//                 localStorage.removeItem('token');
//                 window.location.href = '/login';
//             }
//         }
//     };

//     useEffect(() => {
//         fetchExpenses();
//     }, []);

//     const addOrUpdateExpense = async (data) => {
//         if (editingItem) {
//             try {
//                 const res = await api.put(`/expenses/${editingItem._id}`, data);
//                 setExpenses(expenses.map((item) => (item._id === editingItem._id ? res.data : item)));
//                 setEditingItem(null);
//             } catch (err) {
//                 console.error('Error updating expense:', err);
//             }
//         } else {
//             try {
//                 const res = await api.post('/expenses', data);
//                 setExpenses([...expenses, res.data]);
//             } catch (err) {
//                 console.error('Error adding expense:', err);
//             }
//         }
//     };

//     const deleteExpense = async (id) => {
//         try {
//             await api.delete(`/expenses/${id}`);
//             setExpenses(expenses.filter((exp) => exp._id !== id));
//         } catch (err) {
//             console.error('Error deleting expense:', err);
//         }
//     };

//     const startEditing = (item) => {
//         setEditingItem(item);
//         setSelectedDate(new Date(item.date));
//         setActiveMonthDate(new Date(item.date));
//         if (formRef.current) {
//             formRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     };

//     const filterByTypeAndDate = (type) => {
//         if (!selectedDate) return [];
//         return expenses.filter((exp) => {
//             const expDate = new Date(exp.date);
//             return (
//                 exp.type === type &&
//                 expDate.getMonth() === selectedDate.getMonth() &&
//                 expDate.getFullYear() === selectedDate.getFullYear() &&
//                 expDate.toDateString() === selectedDate.toDateString()
//             );
//         });
//     };

//     const monthlySummary = (type) => {
//         const month = activeMonthDate.getMonth();
//         const year = activeMonthDate.getFullYear();
//         return expenses
//             .filter((exp) => {
//                 const expDate = new Date(exp.date);
//                 return (
//                     exp.type === type &&
//                     expDate.getMonth() === month &&
//                     expDate.getFullYear() === year
//                 );
//             })
//             .reduce((total, item) => total + parseFloat(item.amount), 0);
//     };

//     const chartData = () => {
//         const month = activeMonthDate.getMonth();
//         const year = activeMonthDate.getFullYear();
//         const filtered = expenses.filter((exp) => {
//             const expDate = new Date(exp.date);
//             return (
//                 exp.type === 'expense' &&
//                 expDate.getMonth() === month &&
//                 expDate.getFullYear() === year
//             );
//         });
//         const data = {};
//         filtered.forEach((exp) => {
//             data[exp.category] = (data[exp.category] || 0) + parseFloat(exp.amount);
//         });
//         return Object.entries(data).map(([category, amount]) => ({ category, amount }));
//     };

//     return (
//         <div>
//             <div className="dashboard-container">
//                 {/* Left Panel: Calendar */}
//                 <div className="left-panel">
//                     <CalendarSelector
//                         selectedDate={selectedDate}
//                         setSelectedDate={setSelectedDate}
//                         setActiveMonthDate={setActiveMonthDate}
//                     />
//                     <div ref={formRef}>
//                         <ExpenseForm
//                             onSubmit={addOrUpdateExpense}
//                             selectedDate={selectedDate}
//                             editingItem={editingItem}
//                             clearEdit={() => setEditingItem(null)}
//                         />
//                     </div>
//                 </div>

//                 <div className="right-panel">
//                     <div className="lists">
//                         <ExpenseList expenses={filterByTypeAndDate('expense')} onEdit={startEditing} onDelete={deleteExpense} />
//                         <IncomeList incomes={filterByTypeAndDate('income')} onEdit={startEditing} onDelete={deleteExpense} />
//                     </div>
//                     {/* Right Panel: Lists, Summary, Chart */}
//                     <div className="summary-wrapper">
//                         <div className="summary">
//                             <div>Total Income (Monthly): ₹{monthlySummary('income')}</div>
//                             <div>Total Expense (Monthly): ₹{monthlySummary('expense')}</div>
//                         </div>
//                     </div>

//                     <ExpenseChart chartData={chartData()} />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;


// -- expense-tracker-frontend\src\pages\Dashboard.js --

import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import CalendarSelector from '../components/CalendarSelector';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import IncomeList from '../components/IncomeList';
import ExpenseChart from '../components/ExpenseChart';
import ExpenseLineChart from '../components/ExpenseLineChart';
import '../App.css';

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeMonthDate, setActiveMonthDate] = useState(new Date());
    const [editingItem, setEditingItem] = useState(null);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const formRef = useRef(null);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            setExpenses(res.data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        const datesWithTransactions = new Set();
        expenses.forEach((t) => {
            const transactionDate = new Date(t.date);
            datesWithTransactions.add(transactionDate.toISOString().split('T')[0]);
        });
        setHighlightedDates(Array.from(datesWithTransactions));
    }, [expenses]);

    const addOrUpdateExpense = async (data) => {
        if (editingItem) {
            try {
                const res = await api.put(`/expenses/${editingItem._id}`, data);
                setExpenses(expenses.map((item) => (item._id === editingItem._id ? res.data : item)));
                setEditingItem(null);
            } catch (err) {
                console.error('Error updating expense:', err);
            }
        } else {
            try {
                const res = await api.post('/expenses', data);
                setExpenses([...expenses, res.data]);
            } catch (err) {
                console.error('Error adding expense:', err);
            }
        }
    };

    const deleteExpense = async (id) => {
        try {
            await api.delete(`/expenses/${id}`);
            setExpenses(expenses.filter((exp) => exp._id !== id));
        } catch (err) {
            console.error('Error deleting expense:', err);
        }
    };

    const startEditing = (item) => {
        setEditingItem(item);
        setSelectedDate(new Date(item.date));
        setActiveMonthDate(new Date(item.date));
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const filterByTypeAndDate = (type) => {
        if (!selectedDate) return [];
        return expenses.filter((exp) => {
            const expDate = new Date(exp.date);
            return (
                exp.type === type &&
                expDate.getMonth() === selectedDate.getMonth() &&
                expDate.getFullYear() === selectedDate.getFullYear() &&
                expDate.toDateString() === selectedDate.toDateString()
            );
        });
    };

    const monthlySummary = (type) => {
        const month = activeMonthDate.getMonth();
        const year = activeMonthDate.getFullYear();
        return expenses
            .filter((exp) => {
                const expDate = new Date(exp.date);
                return (
                    exp.type === type &&
                    expDate.getMonth() === month &&
                    expDate.getFullYear() === year
                );
            })
            .reduce((total, item) => total + parseFloat(item.amount), 0);
    };

    const chartData = () => {
        const month = activeMonthDate.getMonth();
        const year = activeMonthDate.getFullYear();
        const filtered = expenses.filter((exp) => {
            const expDate = new Date(exp.date);
            return (
                exp.type === 'expense' &&
                expDate.getMonth() === month &&
                expDate.getFullYear() === year
            );
        });
        const data = {};
        filtered.forEach((exp) => {
            data[exp.category] = (data[exp.category] || 0) + parseFloat(exp.amount);
        });
        return Object.entries(data).map(([category, amount]) => ({ category, amount }));
    };

    const balance = monthlySummary('income') - monthlySummary('expense');

    return (
        <div>
            <div className="dashboard-container">
                {/* Left Panel: Calendar & Form */}
                <div className="left-panel">
                    <CalendarSelector
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        setActiveMonthDate={setActiveMonthDate}
                        highlightedDates={highlightedDates}
                    />
                    <div ref={formRef}>
                        <ExpenseForm
                            onSubmit={addOrUpdateExpense}
                            selectedDate={selectedDate}
                            editingItem={editingItem}
                            clearEdit={() => setEditingItem(null)}
                        />
                    </div>
                </div>

                {/* Right Panel: Lists, Summary, Chart */}
                <div className="right-panel">
                    <div className="lists">
                        <ExpenseList
                            expenses={filterByTypeAndDate('expense')}
                            onEdit={startEditing}
                            onDelete={deleteExpense}
                        />
                        <IncomeList
                            incomes={filterByTypeAndDate('income')}
                            onEdit={startEditing}
                            onDelete={deleteExpense}
                        />
                    </div>
                    <div className="summary-wrapper">
                        <div className="summary">
                            <div>Total Income (Monthly): ₹{monthlySummary('income')}</div>
                            <div>Total Expense (Monthly): ₹{monthlySummary('expense')}</div>
                            <div>
                                Balance:{' '}
                                <span style={{ color: balance >= 0 ? 'green' : 'red' }}>
                                    ₹{balance}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="charts-container">
                        <div className="chart-box">
                            <ExpenseChart chartData={chartData()} />
                        </div>
                        <div className="chart-box">
                            <ExpenseLineChart expenses={expenses} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
