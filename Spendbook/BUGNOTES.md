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