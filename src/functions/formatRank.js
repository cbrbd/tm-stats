export function formatRank(rank){
    if(rank === 1){
        return 'first'
    }
    let lastDigit = rank.toString().slice(-1);
    let suffix = 'th';
    if(lastDigit === '1'){
        return 'st';
    }
    if(lastDigit === '2'){
        return 'nd';
    }
    if (lastDigit === '3'){
        return 'rd'
    }
    return suffix
}
