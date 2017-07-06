/*
 * 文字对比相似度
*/
function compareText(x, y) {  
    var z = 0;
    if (typeof x == 'string') {
        x = x.split('')
    } 
    if (typeof y == 'string') {
        y = y.split('')
    }
    var s = x.length + y.length;;  
  
    x.sort();  
    y.sort();  
    var a = x.shift();  
    var b = y.shift();  
  
    while(a !== undefined && b !== undefined) {  
        if (a === b) {  
            z++;  
            a = x.shift();  
            b = y.shift();  
        } else if (a < b) {  
            a = x.shift();  
        } else if (a > b) {  
            b = y.shift();  
        }  
    }  
    return z/s * 200;  
}  
  
// console.log(compare(['123', '中文', 'hello'], ['123', '中文', 'hello']))  
// console.log(compare(['123', '中文', 'hello'], ['123', '中文', 'hello'].sort()))  
// console.log(compare(['123', '中文', 'hello'], ['123', '中文', 'hello'].reverse()))  
// console.log(compare(['123', '中文', 'hello','中2文'], ['12', '中2文', '123','中文3']))  
// console.log(compare(['123', '中文', 'hello'], ['中文', 'world', '456']))  
// console.log(compare(['123', '中3文', 'hello'], ['中文', 'world', '汉字']))
console.log(compare('杨岳1231231奥数2', '杨岳1231231asd12啊啊啊啊岳'))