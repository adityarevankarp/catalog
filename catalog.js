const fs = require('fs');

function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

function lagrangeInterpolation(x, y, xInterp) {
    let result = 0;
    const n = x.length;

    for (let i = 0; i < n; i++) {
        let term = y[i];
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term *= (xInterp - x[j]) / (x[i] - x[j]);
            }
        }
        result += term;
    }

    return result;
}

function findSecret(jsonData) {
    const keys = jsonData.keys;
    const n = keys.n;
    const k = keys.k;

    let x = [];
    let y = [];

    for (let i = 1; i <= n; i++) {
        if (jsonData[i]) {
            const point = jsonData[i];
            x.push(i);
            y.push(decodeValue(point.base, point.value));
        }
    }

    // We only need k points to reconstruct the secret
    x = x.slice(0, k);
    y = y.slice(0, k);

    // The secret is f(0)
    const secret = Math.round(lagrangeInterpolation(x, y, 0));
    return secret;
}

// Read JSON data from file
fs.readFile('input2.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        const secret = findSecret(jsonData);
        console.log(`The secret (constant term 'c') is: ${secret}`);
    } catch (error) {
        console.error("Error parsing JSON or finding secret:", error);
    }
});