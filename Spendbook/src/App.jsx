(1) useEffect(() => {localStorage.setItem('spendbook-expenses', JSON.stringify(expenses));}, [expenses]);   
    //after fix: It now happens on subsequent changes as well.

(2) Debounced server effect does not protect against out-of-order async setServerMatches
 ANS]  Yes, debounce server effect alone is not sufficient to protect against out-of-order async setServerMatches because debounce cannot fix the condition where an older request has already been sent and now a newer request is being sent. 
  For this, the code has the ignore flag, which helps erase the old server requests as soon as a newer request is sent to the server in the search query. So whenn a newer request or first time request is sent the part "let ignore=false;" runs and the search is started from initial empty requests in the server.
  Then, when the request sent matches the latest request the "if(!ignore)" works and the output of the request is shown on the screen. And when an older requestis processing and a newer request is generated then the cleanup part runs so that the older request can be erased from the server, for which we have, "ignore=true;".
  Therefore, the ignore flag helps in making sure that the old request is not mistakenly shown or overwrites a newer one, however the debounce waits for 300 ms to prevent frequent searches.

  //Code for this:
  let ignore=false;

  const timer=setTimeout(() => {
    lookupExpenses(query, expenses).then(found)=>{
      if (!ignore){
        setServerMatches(found);
      }
    });
}, 300);
return() => {
  ignore=true;
  clearTimeout(timer);
};

  (3) const amountInvalid = !Number.isFinite(amount) || amount <= 0;   
    //After fix: Now, it does not allow blank or zero submissions, making them invalid.
