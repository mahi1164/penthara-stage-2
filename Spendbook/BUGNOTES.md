# Bug Notes

## Bug 1 - Timer stopped at 1 second

### Symptom
The "Time on page" counter increased from 0s to 1s, but then stayed at 1s instead of continuing to count.

### Root Cause
The interval callback used `secondsOpen + 1` while the effect had an empty dependency array. This meant the callback kept using the initial `secondsOpen` value instead of the latest state value.

### Why the Fix Is Correct
I changed the state update to use the functional updater form, `setSecondsOpen((prev) => prev + 1)`. This makes React provide the latest state value to the updater before adding one to it, so the interval can continue counting correctly without recreating the interval every second.

### Verification
I ran the app locally and confirmed that the timer continued increasing sequentially beyond 1 second instead of remaining stuck at 1 second.

## Bug 2 - Pagination not working

### Symptom
The "Next" button to change page from 1 to 2, wasn't working. It would flash the screen for a second but wouldn't change the page.

### Root Cause
The useEffect responsible for this pagination was depended on the object 'activeView'. Now, every state render created a new 'activeView' because of which the effect also ran unnecessarily and caused the page to reset to 1, even when the query and categoryFilter remained unchanged.

### Why the Fix Is Correct
I changed the code part of useEffect to use 'query' and 'categoryfilter' dependency rather than any state or object, because these are the only two things that should actually cause the page to reset. Now the page only resets when one of these really changes.

### Verification
I clicked "Next" and "Prev" several times and the page numbers changed correctly without jumping back. I also changed the search text and category filter, and confirmed the page correctly went back to page 1 when it should.

## Bug 3 - The input fields for adding an expense lost cursor focus

### Symptom
The description and amount inputs lost focus whenever i tried to type any expense. It would lose the focus immediately after a second of focusing on the field with the cursor, which in turn would make it impossible for the user to type anything in the input boxes.

### Root Cause
The new form was defined under the App component. So whenever the app re-rendered, a new component function was created which led react to treat the expense form as a new component and caused it to reset or restart. This was causing the elements to lose the cursor focus.

### Why the Fix Is Correct
I moved `NewExpenseForm` outside of `App` so its component identity remains stable across App re-renders. The values and state-update functions it needs are passed to it as props. This prevents the form from being unnecessarily restarted while keeping its existing functionality.

### Verification
I left the inputs focused while the timer continued running and confirmed that the focus remained. I also typed continuously into both the description and amount fields and successfully added an expense. Pagination, reimbursement toggling, and the timer continued to work correctly after the change.

## Bug 4 - Expense notes moved between the expenses

### Symptom
The notes i entered for designated expenses on the list were moving as i performed deletion or any change in the list. So one expense's note automatically moved to another's when the former was deleted, and the latter's moved to the next.

### Root Cause
Expense rows were using the array index as their React key. So whenever an expense was deleted, the remaining expenses shifted positions, which meant the key also shifted among the expenses. Since the note was tied to the position, not the actual expense, it looked like the note had jumped to a different expense.

### Why the Fix Is Correct
I changed the key from the array index to the expense's own unique ID. Now React always knows exactly which row belongs to which expense, even if the list changes order or something gets deleted, the notes now didn't move from one expense to another.

### Verification
I assigned three distinctive notes to the three expenses, officeLunch, metro and june rent. Then, I deleted the office lunch expense but the metro card top up and june rent expenses retained their own notes. So this fixed the row identity problem which was happening because of using the positions as key.