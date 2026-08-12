// Spendbook — stage 2 starter. Replace src/App.jsx of a fresh Vite React
// project with this file, then: npm install && npm run dev
import { useEffect, useState } from 'react';

const STARTING_EXPENSES = [
  { id: 1, description: 'Office lunch', category: 'Food', amount: 240, reimbursed: false },
  { id: 2, description: 'Metro card top-up', category: 'Travel', amount: 500, reimbursed: true },
  { id: 3, description: 'June rent share', category: 'Rent', amount: 9000, reimbursed: false },
  { id: 4, description: 'Movie night', category: 'Fun', amount: 350, reimbursed: false },
  { id: 5, description: 'Groceries', category: 'Food', amount: 1200, reimbursed: false },
];

// Simulated server-side lookup (no network needed): longer queries answer faster.
function lookupExpenses(q, expenses) {
  const wait = 900 - Math.min(q.length * 150, 700);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(expenses.filter((x) => x.description.toLowerCase().includes(q.toLowerCase())));
    }, wait);
  });
}

const PAGE_SIZE = 3;

export default function App() {
  const [expenses, setExpenses] = useState(STARTING_EXPENSES);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [secondsOpen, setSecondsOpen] = useState(0);
  const [serverMatches, setServerMatches] = useState(null);
  const [draftText, setDraftText] = useState('');
  const [draftNum, setDraftNum] = useState('');

  useEffect(() => {
    const tick = setInterval(() => setSecondsOpen((prev) => prev + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  const activeView = { search: query, category: categoryFilter };

  useEffect(() => {
  setPage(1);
}, [query, categoryFilter]);

  useEffect(() => {
    if (query.trim() === '') { setServerMatches(null); return; }
    lookupExpenses(query, expenses).then((found) => setServerMatches(found));
  }, [query, expenses]);

  const visible = expenses
    .filter((x) => x.description.toLowerCase().includes(query.toLowerCase()))
    .filter((x) => categoryFilter === 'All' || x.category === categoryFilter);
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const shown = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleReimbursed(x) {
    x.reimbursed = !x.reimbursed;
    setExpenses(expenses);
  }

  function removeExpense(x) {
    setExpenses(expenses.filter((it) => it.id !== x.id));
  }



  return (
    <div className="app">
      <h1>Spendbook</h1>
      <p className="timer">Time on page: {secondsOpen}s</p>
      <NewExpenseForm
  draftText={draftText}
  setDraftText={setDraftText}
  draftNum={draftNum}
  setDraftNum={setDraftNum}
  expenses={expenses}
  setExpenses={setExpenses}
/>
      <div className="filters">
        <input placeholder="Search expenses…" value={query}
          onChange={(e) => setQuery(e.target.value)} />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option>All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Rent</option>
          <option>Fun</option>
        </select>
      </div>
      {serverMatches !== null && (
        <p className="matches">Server search: {serverMatches.length} match(es) for “{query}”</p>
      )}
      <ul className="rows">
        {shown.map((x, index) => (
          <ExpenseRow key={x.id} expense={x}
            onToggle={() => toggleReimbursed(x)} onRemove={() => removeExpense(x)} />
        ))}
      </ul>
      <div className="pager">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> page {page} of {pageCount} </span>
        <button disabled={page >= pageCount} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
function NewExpenseForm({
  draftText,
  setDraftText,
  draftNum,
  setDraftNum,
  expenses,
  setExpenses,
}) {
  function submit(e) {
    e.preventDefault();

    if (draftText.trim() === '' || Number(draftNum) <= 0) return;

    setExpenses([
      {
        id: Date.now(),
        description: draftText.trim(),
        category: 'Food',
        amount: Number(draftNum),
        reimbursed: false,
      },
      ...expenses,
    ]);

    setDraftText('');
    setDraftNum('');
  }

  return (
    <form className="new-entry" onSubmit={submit}>
      <input
        placeholder="What was it for?"
        value={draftText}
        onChange={(e) => setDraftText(e.target.value)}
      />

      <input
        placeholder="Amount (₹)"
        type="number"
        value={draftNum}
        onChange={(e) => setDraftNum(e.target.value)}
      />

      <button type="submit">Add expense</button>
    </form>
  );
}

function ExpenseRow({ expense, onToggle, onRemove }) {
  const [note, setNote] = useState('');
  return (
    <li className="row">
      <label>
        <input type="checkbox" checked={expense.reimbursed} onChange={onToggle} />
        {' '}Reimbursed
      </label>
      <b> {expense.description} </b>
      <span> · {expense.category} · ₹{expense.amount} </span>
      <input className="note" placeholder="Add a note…" value={note}
        onChange={(e) => setNote(e.target.value)} />
      <button onClick={onRemove}>Remove</button>
    </li>
  );
}