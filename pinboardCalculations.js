function calculatePlinkoPosition(rows, column, probabilityRight) {
    function binomialCoefficient(n, k) {
        if (k === 0 || k === n) {
            return 1;
        }
        return binomialCoefficient(n - 1, k - 1) + binomialCoefficient(n - 1, k);
    }

    const probability = binomialCoefficient(rows, column) * Math.pow(probabilityRight, column) * Math.pow(1 - probabilityRight, rows - column);

    return probability;
}

export function calculateReward(rewardIndex){    
    let rewardResults = calculateRewardValue();
    return Math.round(rewardResults[rewardIndex.bucketNumber]);
}

function calculateRewardValue(){
    const columns = 8; // Number of columns in the Plinko board
    const probabilityRight = 0.5;
    let results = [];
    
    for(let i = 0; i <= columns; i++){
        let invertedVal = (1 / calculatePlinkoPosition(columns, i, probabilityRight)) * 0.9;
        results.push(invertedVal);
    }
    return results;
}
