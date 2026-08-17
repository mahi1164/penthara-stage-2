(1) useEffect(() => {localStorage.setItem('spendbook-expenses', JSON.stringify(expenses));}, []);   // Only on initial mount, not on subsequent expense changes

(2) Debounced server effect does not protect against out-of-order async setServerMatches

(3) const amountInvalid = !Number.isFinite(amount) || amount < 0;   // Allows 0 and blank/'' as valid