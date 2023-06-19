const fs = require('fs');
const readline = require('readline');

let v = 0; //버보즈

let mem = []; //메모리 값
let input = [];

const fileName = 'test.al';
let file = fs.readFileSync(fileName, 'utf-8');

input = file.split('\n');

let token = [];
let str = [];
let pros = [];

if (input[0] == "setln(-v)") {
    v = 1;
}

function read(code) {
    for (let i = 1; i<input.length; i++) {
        proc = code[i].split('(');
        token[i] = proc[0].slice();
        token[i] = token[i].replace('    ', '');
        let strr = 0;
        if (proc[1] == undefined) {
            strr = ('%close')
        } else {
            strr = proc[1].slice();
        }
        str[i] = strr.replace(')', '');
    }
}

read(input);

if (v == 1) {
    console.log("token = " + token);
    console.log("str = " + str)
}

let string = [];
let detail = [];

async function interpret(st, ed) {
    for (let i = st; i<ed; i++) {
        let logic = 0;
        string = str[i].split('//');
        if (token[i] === 'ln') {
            let sstr = string[0].replace(/"/g, '');
            let sttr = string.slice();
            sttr.shift();
            console.log(sttr);
            out(sstr, sttr);
        } else if (token[i] == 'startln') {
            mem = [];
            mem2 = [];
            console.log("%start");
        } else if (token[i] == 'endln') {
            console.log("\n returned with code " + string[0]);
        } else if (token[i] == 'n') {
            let adress = parseInt(string[0]);
            let value = string[1];
            console.log(value);
            if (String(value).includes('`')) {
                detail = value.split('`')
                console.log("details : " + detail);
                if (detail[1] == '+') {
                    let add1 = detail[0];
                    let add2 = detail[2];
                    add1 = tag(add1);
                    add2 = tag(add2);
                    console.log("add1 : " + add1 + " add2 : " + add2)
                    value = parseInt(add1) + parseInt(add2);
                    console.log("value : " + value);
                    mem[adress] = value;
                    console.log("$debug adress : " + adress + " value : " + mem[adress]);
                }
            } else {
                mem[adress] = value;
            }
        } else if (token[i] == 'if') {
            string = str[i].split(' ');
            if (string[1] = "==") {
                let std = tag(string[0]);
                let con = tag(string[2]);
                if (std == con) {
                    i = await interpret(i+1, token.length);
                    logic = 0;
                } else {
                    i = pass(i);
                    logic = 1;
                }
            }
        } else if (token[i] == 'else') {
            if (logic == 0) {
                i = pass(i);
            } else {
                i = await interpret(i+1, token.length);
            }
        } else if (str[i] == '%close') {
            return i;
        } else if (token[i] == 'in') {
            let adress = parseInt(string[0]);
            let value = await ReadLine();
            mem[adress] = value;
        } else{
            console.log("%unknown");
        }
    }
}

interpret(1, token.length);

function pass(st) {
    for (let i = st; i<token.length; i++) {
        if (str[i] == '%close') {
            return i;
        }
    }
    console.log("%err : end")
}

function out(format, ...args) {
    let index = 0;
    let result = String(format).replaceAll('%n', function (match) {
        let arg = args[index++];
        if (typeof arg === 'undefined') {
            return match;
        } else if (match === '%n') {
            console.log(match);
            return String(mem[parseInt(arg)]);
        }
    });
    console.log(result);
    return result;
}

function tag(format) {
    let value = 0;
    let result = 0;
    if (format.includes('%')) {
        value = format.replace('%', '');
        result = mem[parseInt(value)];
    } else {
        result = format;
    }
    return result;
}

async function ReadLine() {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    let input = await new Promise(r => {
        rl.question('',r);
    });
    rl.close();
    return input;
}

return 0;