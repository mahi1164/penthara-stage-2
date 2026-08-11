# Bug Notes

## Bug 1 — Timer stopped at 1 second

### Symptom
The "Time on page" counter increased from 0s to 1s, but then stayed at 1s instead of continuing to count.

### Root Cause
The interval callback used `secondsOpen + 1` while the effect had an empty dependency array. This meant the callback kept using the initial `secondsOpen` value instead of the latest state value.

### Why the Fix Is Correct
I changed the state update to use the functional updater form, `setSecondsOpen((prev) => prev + 1)`. This makes React provide the latest state value to the updater before adding one to it, so the interval can continue counting correctly without recreating the interval every second.

### Verification
I ran the app locally and confirmed that the timer continued increasing sequentially beyond 1 second instead of remaining stuck at 1 second.