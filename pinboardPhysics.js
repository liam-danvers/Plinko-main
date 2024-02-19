import * as THREE from './node_modules/three/build/three.module.js';
import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js';

export function calculatePlinkoPosition(rows, column, probabilityRight) {
    // Function to calculate the binomial coefficient (n choose k)
    function binomialCoefficient(n, k) {
        if (k === 0 || k === n) {
            return 1;
        }
        return binomialCoefficient(n - 1, k - 1) + binomialCoefficient(n - 1, k);
    }

    // Calculate the probability using the binomial distribution formula
    const probability = binomialCoefficient(rows, column) * Math.pow(probabilityRight, column) * Math.pow(1 - probabilityRight, rows - column);

    return probability;
}


// // Example usage
// const rows = 6; // Number of rows in the Plinko board
// const probabilityRight = 0.5; // Probability of moving to the right at each peg

// const result0 = calculatePlinkoPosition(rows, 0, probabilityRight);
// const result1 = calculatePlinkoPosition(rows, 1, probabilityRight);
// const result2 = calculatePlinkoPosition(rows, 2, probabilityRight);
// const result3 = calculatePlinkoPosition(rows, 3, probabilityRight);
// const result4 = calculatePlinkoPosition(rows, 4, probabilityRight);
// const result5 = calculatePlinkoPosition(rows, 5, probabilityRight);
// const result6 = calculatePlinkoPosition(rows, 6, probabilityRight);
// console.log(`The probability of landing in column ${1} is: ${result0}`);
// console.log(`The probability of landing in column ${2} is: ${result1}`);
// console.log(`The probability of landing in column ${3} is: ${result2}`);
// console.log(`The probability of landing in column ${4} is: ${result3}`);
// console.log(`The probability of landing in column ${5} is: ${result4}`);
// console.log(`The probability of landing in column ${6} is: ${result5}`);
// console.log(`The probability of landing in column ${7} is: ${result6}`);