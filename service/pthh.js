export function pthh(str){
    let text = 'Please check your chemical equation'
    let success = true;
    try {
        //remove space
        str = str.replaceAll(' ','');
        str = str.replaceAll('-','');
        str = str.replaceAll('>','=');
        str = str.replaceAll('→','=');
        console.log(str);
        //get left right
        let left = str.split('=')[0];
        let right = str.split('=')[1];

        left = left.split('+');
        right = right.split('+');

        const dataLeft = {};
        for (let x in left) {
            dataLeft[left[x]] = component_analysis(left[x]);
        }

        const dataRight = {};
        for (let x in right) {
            dataRight[right[x]] = component_analysis(right[x]);
        }

        const element_HH = {}
        for (let x in dataLeft) {
            for (let y in dataLeft[x]) {
                element_HH[y] = 0;
            }
        }

         // Kiem tra xem so nguyen to co bi du hay khong
        for (let x in dataRight) {
            for (let y in dataRight[x]) {
                if (element_HH[y] === undefined) {
                    console.log(y, element_HH[y]);
                    success = false;
                }
            }
        }

        let N = left.length + right.length;
        let M = 0;
        for (let x in element_HH) {
            M++;
        }

        let arr = init_array(N, M);

        let i = 0;
        for (let x in element_HH) {
            let j = 0;
            for (let y in dataLeft) {
                arr[i][j++] = (dataLeft[y][x] == null ? 0 : dataLeft[y][x]);
            }
            for (let y in dataRight) {
                arr[i][j++] = (dataRight[y][x] == null ? 0 : -dataRight[y][x]);
            }
            i++;
        }
        // console.log("arr", arr);
        arr = ladder_matrix(arr);
        // console.log("arr1", arr);
        arr = diagonal_matrix(arr);
        // console.log("arr2", arr);
        let result_array = get_result_array(arr);
        i = 0;
        const resultLeft = {};
        for (let y in dataLeft) {
            resultLeft[y] = result_array[i++]
        }
        const resultRight = {};
        for (let y in dataRight) {
            resultRight[y] = result_array[i++]
        }

        i = 0;
        for (let x in dataLeft) {
            for (let y in dataLeft[x]) {
                element_HH[y] += result_array[i] * dataLeft[x][y];
            }
            i++;
        }
        text = "";
        for (let x in resultLeft) {
            if (resultLeft[x] == null || resultLeft[x] <= 0)
                success = false;
            text = text + ((resultLeft[x] > 1) ? resultLeft[x] : "") + x + " + ";
        }
        text = text.substring(0, text.length - 3);
        text = text + " = ";
        for (let x in resultRight) {
            if (resultRight[x] == null || resultRight[x] <= 0 || resultRight[x] !== resultRight[x])
                success = false;
            text = text + ((resultRight[x] > 1) ? resultRight[x] : "") + x + " + ";
        }
        text = text.substring(0, text.length - 3);
        if (!success)
            text = 'Please double check your chemical equation'
        return {
            success: success,
            input:str,
            left: left,
            right: right,
            element: element_HH,
            data: {
                dataLeft: dataLeft,
                dataRight: dataRight,
            },
            result: {
                resultLeft: resultLeft,
                resultRight: resultRight,
            },
            text: text,
        }
    } catch (error) {
        return {
            success: false,
            text: text,
        }
    }
}

function component_analysis(str){
    str = str + "Z";
    //Fe2(SO4)3
    const data = {};
    let element = "";
    let quantity = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] >= '0' && str[i] <= '9') {
            quantity = quantity + str[i];
        } else if (str[i] >= 'A' && str[i] <= 'Z') {
            if (element.length > 0) {
                data[element] = ((typeof data[element] !== 'undefined') ? Math.floor(data[element]) : 0) +
                    ((quantity.length > 0) ? Math.floor(quantity) : 1);
                element = "";
                quantity = "";
            }
            element = element + str[i];
        } else if (str[i] >= 'a' && str[i] <= 'z') {
            element = element + str[i];
        } if (str[i] === '(') {
            if (element.length > 0)
                data[element] = ((typeof data[element] !== 'undefined') ? Math.floor(data[element]) : 0) +
                    ((quantity.length > 0) ? Math.floor(quantity) : 1);
            element = "";
            quantity = "";
            let count = 1;
            let str2 = "";
            i++;
            while(count > 0 && i < str.length) {
                if (str[i] === '(')
                    count++;
                if (str[i] === ')')
                    count--;
                if (count === 0)
                    break;
                str2 = str2 + str[i];
                i++;
            }
            i++;
            while(str[i] >= '0' && str[i] <= '9' && i < str.length){
                quantity = quantity + str[i++];
            }
            i--;
            if (quantity.length == 0)
                quantity = '1';
            let sub_data = component_analysis(str2);
            for (let x in sub_data) {
                data[x] = ((data[x] != null) ? data[x] : 0) +
                    Math.floor(sub_data[x]) * Math.floor(quantity);
            }
            element = "";
            quantity = "";
        }
    }
    return data;
}
function init_array(N, M) {
    let arr = [];
    for (let i = 0; i < M; i++) {
        arr[i] = [];
        for (let j = 0; j < N; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function ladder_matrix(arr) {
    let M = arr.length;
    let N = arr[0].length;
    for (let i = 0; i < M - 1; i++) {
        let indexNotZero = i;
        for (let j = i; j < M; j++) {
            if (arr[j][i] != 0) {
                let temp = arr[indexNotZero];
                arr[indexNotZero] = arr[j];
                arr[j] = temp;
                indexNotZero++;
            }
        }
        for (let j = i; j < M; j++) {
            if (arr[j][i] < 0)
                for (let k = i; k < N; k++) {
                    arr[j][k] *= -1;
                }
        }
        for (let j = i + 1; j < M; j++) {
            if (arr[j][i] == 0)
                break;
            let lcm = lcm_two_numbers(arr[i][i], arr[j][i]);
            let k1 = lcm / arr[j][i];
            let k2 = lcm / arr[i][i];
            for (let k = 0; k < N; k++) {
                arr[i][k] *= k2
                arr[j][k] *= k1;
            }
            for (let k = 0; k < N; k++) {
                arr[j][k] -= arr[i][k];
            }
        }
    }
    for (let i = M - 1; i >= 0; i--) {
        let checkRowZero = true;
        for (let j = 0; j < N; j++) {
            if (arr[i][j] !== 0){
                checkRowZero = false;
                break;
            }
        }
        if (checkRowZero)
            arr.splice(i, 1);
    }
    return arr;
}

function  diagonal_matrix(arr) {
    let M = arr.length;
    let N = arr[0].length;
    for (let i = M - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            if (arr[j][i] == 0)
                continue;
            let lcm = lcm_two_numbers(arr[i][i], arr[j][i]);
            let k1 = lcm / arr[j][i];
            let k2 = lcm / arr[i][i];
            for (let k = 0; k < N; k++) {
                arr[i][k] *= k2
                arr[j][k] *= k1;
            }
            for (let k = 0; k < N; k++) {
                arr[j][k] -= arr[i][k];
            }
        }
    }
    return arr;
}

function get_result_array(arr) {
    let M = arr.length;
    let N = arr[0].length;
    let result = [];
    let lcm = 1;
    for (let i = 0; i < M; i++) {
       lcm = lcm_two_numbers(lcm, arr[i][i])
    }
    lcm = Math.abs(lcm);
    result[N - 1] = lcm;
    for (let i = M - 1; i >= 0; i--) {
        result[i] = (-lcm * arr[i][N - 1]) / arr[i][i];
    }
    let gcd = result[0];
    for (let i = 0; i < N; i++) {
        gcd = gcd_two_numbers(gcd, result[i]);
    }
    for (let i = 0; i < N; i++) {
        result[i] /= gcd;
    }
    return result;
}

function lcm_two_numbers(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number'))
        return false;
    return (!x || !y) ? 0 : ((x * y) / gcd_two_numbers(x, y));
}

function gcd_two_numbers(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}