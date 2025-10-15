// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get references to our HTML elements
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');

    // Attach an event listener to the button to run the calculation on click
    calculateBtn.addEventListener('click', calculateDayOfWeek);

    function calculateDayOfWeek() {
        // --- 1. GET AND VALIDATE INPUT ---
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            resultDiv.innerHTML = "Please enter a valid date.";
            return;
        }

        // --- 2. THE ALGORITHM ---

        // These are the codes for each month. Key for the mental math!
        const monthCodes = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
        // Day names corresponding to the final result (0 = Sunday)
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        let explanation = '<h3>Here’s How It Works:</h3>';

        // --- Step A: Get the last two digits of the year ---
        const lastTwoOfYear = year % 100;
        explanation += `<p><b>1. Year Code:</b> Start with the last two digits of the year: <b>${lastTwoOfYear}</b>.</p>`;

        // --- Step B: How many 12s fit into that? ---
        const dozens = Math.floor(lastTwoOfYear / 12);
        explanation += `<p><b>2. Dozens:</b> Divide that by 12 and ignore the remainder: ${lastTwoOfYear} / 12 = <b>${dozens}</b>.</p>`;
        
        // --- Step C: The remainder ---
        const remainder = lastTwoOfYear % 12;
        explanation += `<p><b>3. Remainder:</b> Find the remainder from that division: ${lastTwoOfYear} % 12 = <b>${remainder}</b>.</p>`;

        // --- Step D: How many 4s fit in the remainder? ---
        const foursInRemainder = Math.floor(remainder / 4);
        explanation += `<p><b>4. Fours in Remainder:</b> Divide the remainder by 4, ignoring any new remainder: ${remainder} / 4 = <b>${foursInRemainder}</b>.</p>`;

        // --- Step E: The Month Code ---
        const monthCode = monthCodes[month - 1]; // month-1 because arrays are 0-indexed
        explanation += `<p><b>5. Month Code:</b> Every month has a code. For month #${month}, the code is <b>${monthCode}</b>.</p>`;

        // --- Step F: The Day Number ---
        const dayNumber = day;
        explanation += `<p><b>6. Day Number:</b> Finally, use the day of the month: <b>${dayNumber}</b>.</p>`;

        // --- Step G: Add them all up! ---
        let total = dozens + remainder + foursInRemainder + monthCode + dayNumber;
        explanation += `<p><b>7. Sum:</b> Add these numbers together: ${dozens} + ${remainder} + ${foursInRemainder} + ${monthCode} + ${dayNumber} = <b>${total}</b>.</p>`;
        
        // --- Century and Leap Year Adjustments ---
        // Gregorian calendar century codes: 1700s=4, 1800s=2, 1900s=0, 2000s=6. It repeats every 400 years.
        let centuryCode = 0;
        if (year >= 1700 && year < 1800) centuryCode = 4;
        else if (year >= 1800 && year < 1900) centuryCode = 2;
        else if (year >= 1900 && year < 2000) centuryCode = 0;
        else if (year >= 2000 && year < 2100) centuryCode = 6;
        else if (year >= 2100 && year < 2200) centuryCode = 4;

        total += centuryCode;
        explanation += `<p><b>8. Century Code:</b> Add the century code. For the ${Math.floor(year/100)}00s, it's <b>${centuryCode}</b>. Total is now <b>${total}</b>.</p>`;

        // Leap Year Check: A year is a leap year if it's divisible by 4, unless it's a century year not divisible by 400.
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        if (isLeapYear && (month === 1 || month === 2)) {
            total -= 1;
            explanation += `<p><b>9. Leap Year Correction:</b> Since it's a leap year and the date is in Jan or Feb, subtract 1. Total is now <b>${total}</b>.</p>`;
        }

        // --- Final Step: Modulo 7 ---
        const dayIndex = total % 7;
        explanation += `<p><b>Final Step:</b> Divide the total by 7 and find the remainder: ${total} % 7 = <b>${dayIndex}</b>.</p>`;
        
        const dayOfWeek = dayNames[dayIndex];
        
        explanation += `<p>The remainder maps to the day of the week (0=Sunday, 1=Monday, ...).</p>`;
        explanation += `<div class="final-answer">${day}/${month}/${year} falls on a ${dayOfWeek}.</div>`;

        // Display the full explanation
        resultDiv.innerHTML = explanation;
    }
});
