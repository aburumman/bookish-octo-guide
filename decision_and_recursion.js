/**
 * Determines if a year is a leap year.
 * Rules: divisible by 4, but century years must be divisible by 400.
 * @param {number} year
 * @returns {boolean}
 */
function isLeapYear(year) {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  }
  return false;
}

// Test examples
console.log('Leap Year Checker:');
console.log('2000:', isLeapYear(2000)); // true
console.log('1900:', isLeapYear(1900)); // false
console.log('2024:', isLeapYear(2024)); // true
console.log('2023:', isLeapYear(2023)); // false

/**
 * Returns the ticket price based on age.
 * Children (<=12): $10
 * Teenagers (13-17): $15
 * Adults (>=18): $20
 * @param {number} age
 * @returns {string} price message
 */
function getTicketPrice(age) {
  if (age <= 12) {
    return `Age ${age}: $10 (Children's ticket)`;
  } else if (age <= 17) {
    return `Age ${age}: $15 (Teenager's ticket)`;
  } else {
    return `Age ${age}: $20 (Adult ticket)`;
  }
}

// Test examples
console.log('\nTicket Pricing:');
console.log(getTicketPrice(10)); // $10
console.log(getTicketPrice(15)); // $15
console.log(getTicketPrice(25)); // $20

/**
 * Advises on clothing based on temperature and rain.
 * @param {number} temp - temperature in Celsius
 * @param {boolean} isRaining
 * @returns {string} advice
 */
function clothingAdviser(temp, isRaining) {
  let advice = `Temperature: ${temp}°C, Rain: ${isRaining ? 'Yes' : 'No'}. `;

  if (isRaining) {
    advice += 'Take a raincoat or umbrella. ';
  }

  if (temp < 0) {
    advice += 'Wear a heavy winter coat, gloves, and scarf.';
  } else if (temp < 10) {
    advice += 'Wear a warm jacket and layers.';
  } else if (temp < 20) {
    advice += 'A light jacket or sweater should be enough.';
  } else if (temp < 30) {
    advice += 'T-shirt and shorts are fine.';
  } else {
    advice += 'Stay cool with light, breathable clothing.';
  }

  return advice;
}

// Test examples
console.log('\nClothing Adviser:');
console.log(clothingAdviser(25, false));
console.log(clothingAdviser(5, true));
console.log(clothingAdviser(-5, false));

/**
 * Recursively computes the nth Fibonacci number (0-indexed).
 * Sequence: 0, 1, 1, 2, 3, 5, 8, ...
 * @param {number} n - a non-negative integer
 * @returns {number}
 */
function fibonacci(n) {
  if (n < 0) throw new Error('Input must be non-negative');
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Optimized version with memoization (for larger n)
function fibonacciMemo(n, memo = {}) {
  if (n < 0) throw new Error('Input must be non-negative');
  if (n === 0) return 0;
  if (n === 1) return 1;
  if (memo[n]) return memo[n];
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}

// Test examples
console.log('\nFibonacci:');
console.log('fib(5):', fibonacci(5));   // 5
console.log('fib(10):', fibonacci(10)); // 55
// Using memoized for larger values
console.log('fibMemo(50):', fibonacciMemo(50)); // 12586269025

/**
 * Recursively checks if a string is a palindrome.
 * Ignores spaces, punctuation, and capitalization.
 * @param {string} str
 * @returns {boolean}
 */
function isPalindrome(str) {
  // Clean the string: remove non-alphanumeric characters, lowercase
  const clean = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  function check(s, left, right) {
    if (left >= right) return true;
    if (s[left] !== s[right]) return false;
    return check(s, left + 1, right - 1);
  }

  return check(clean, 0, clean.length - 1);
}

// Test examples
console.log('\nPalindrome Checker:');
console.log('"racecar":', isPalindrome('racecar')); // true
console.log('"A man, a plan, a canal: Panama":', isPalindrome('A man, a plan, a canal: Panama')); // true
console.log('"hello":', isPalindrome('hello')); // false