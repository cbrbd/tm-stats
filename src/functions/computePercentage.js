export function computePercentage(number, total){
    let percentage = parseFloat(100*number/total);
    if(percentage>9){
        return percentage.toPrecision(2);
    } else {
        return percentage.toPrecision(1);
    }
}