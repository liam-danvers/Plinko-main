// I wanted to use this to vary the payout
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

export function calculateReward(rewardIndex, basic, bet){    
    if(basic){
        let rewardResults = calculateBaseRewardValue();
        return Math.round(rewardResults[rewardIndex.bucketNumber]);
    }else{
        let rewardResults = calculateBaseRewardValue();
        let newReward = rewardResults[rewardIndex.bucketNumber] * (bet / 10) * 2;
        return Math.round( newReward);
    }
}

//This was the formula I was going to use but didn't have the time to implement it correctly
function calculateRewardValue(){
    const columns = 10; 
    const probabilityRight = 0.5;
    let results = [];
    
    for(let i = 0; i <= columns; i++){
        let invertedVal = (1 / calculatePlinkoPosition(columns, i, probabilityRight));
        results.push(invertedVal);
    }
    return results;
}

function calculateBaseRewardValue(){
    let results = [10, 5, 2, 1, 0, 1, 2, 5, 10 ];  
    return results;
}
