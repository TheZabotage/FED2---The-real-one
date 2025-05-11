// src/components/jobs/ExpenseList.jsx
import PropTypes from 'prop-types';

const ExpenseList = ({ expenses, onDeleteExpense = null }) => {
    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Format currency
    const formatCurrency = (amount) => {
        return Number(amount).toFixed(2);
    };

    return (
        <ul className="expenses-list">
            {expenses.map(expense => (
                <li key={expense.expenseId} className="expense-item">
                    <div className="expense-amount">${formatCurrency(expense.amount)}</div>
                    <div className="expense-text">{expense.text}</div>
                    <div className="expense-date">{formatDate(expense.date)}</div>

                    {onDeleteExpense && (
                        <button
                            onClick={() => onDeleteExpense(expense.expenseId)}
                            className="delete-expense-btn"
                            title="Delete this expense"
                        >
                            Delete
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
};

ExpenseList.propTypes = {
    expenses: PropTypes.arrayOf(
        PropTypes.shape({
            expenseId: PropTypes.string.isRequired,
            amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            text: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired
        })
    ).isRequired,
    onDeleteExpense: PropTypes.func
};

export default ExpenseList;