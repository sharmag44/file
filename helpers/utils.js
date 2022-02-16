'use strict';


exports.difference = (arrayOne, arrayTwo, by)=>{
    //Find values that are in arrayOne but not in arrayTwo
    var uniqueOne = arrayOne.filter(function(obj) {
        return !arrayTwo.some(function(obj2) {
            return obj[by] == obj2[by];
        });
    });
    //Find values that are in arrayTwo but not in arrayOne
    var uniqueTwo = arrayTwo.filter(function(obj) {
        return !arrayOne.some(function(obj2) {
            return obj[by] == obj2[by];
        });
    });
    
    return uniqueOne.concat(uniqueTwo);
}
