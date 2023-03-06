let searchData = async (A) =>{
    try{
        const B = {};
        return w(E(A, B), B);

    } catch(error){

    }
}
let B = [
    /('[^']+')/,
    /("[^"]+")/,
    /\(([^()]+)\)/,
    /([^&|]+>=[^&|]+)/,
    /([^&|]+>[^&|]+)/,
    /([^&|]+<=[^&|]+)/,
    /([^&|]+<[^&|]+)/,
    /([^&|]+!=[^&|]+)/,
    /([^&|]+=[^&|]+)/,
    /([^&|]+~\*[^&|]+)/,
    /([^&|]+~[^&|]+)/,
    /([^|]*[&][^|]*)/,
]
function E(A, w = {}, Q = {}) {
    if ((Q.c || (Q.c = 0), !Q.p))
        do {
            Q.p = Math.random().toString(16).slice(2);
        } while (A.indexOf(Q.p) > -1);
    for (let s = 0; s < B.length; s++) {
        const C = B[s];
        for (;;) {
            const B = A.match(C);
            if (!B) break;
            const g = `x${++Q.c}_${Q.p}`;
            A = A.replace(B[0], g);
            const I = B[0] !== B[1] ? E(B[1], w, Q) : B[1];
            w[g] = s < 2 ? I : I.replace(/\s/g, "");
        }
    }
    return A;
}
function w(A, B = {}) {
    const E = B[A] || A;
    switch (!0) {
        case /^'[^']*'$/.test(E):
            return E.split(/^'([^']*)'$/)[1] || "";
        case /^"[^"]*"$/.test(E):
            return E.split(/^"([^"]*)"$/)[1] || "";
        case /^\[[^[\]]*\]$/.test(E): {
            const A = [],
                Q = E.slice(1, -1).split(",");
            for (let E = 0; E < Q.length; E++) {
                const s = w(Q[E], B);
                A.push(s);
            }
            return A;
        }
        case />=/.test(E): {
            const A = E.split(">=");
            return { [w(A[0], B)]: { $gte: w(A[1], B) } };
        }
        case />/.test(E): {
            const A = E.split(">");
            return { [w(A[0], B)]: { $gt: w(A[1], B) } };
        }
        case /<=/.test(E): {
            const A = E.split("<=");
            return { [w(A[0], B)]: { $lte: w(A[1], B) } };
        }
        case /</.test(E): {
            const A = E.split("<");
            return { [w(A[0], B)]: { $lt: w(A[1], B) } };
        }
        case /!=/.test(E): {
            const A = E.split("!=");
            return { [w(A[0], B)]: { $ne: w(A[1], B) } };
        }
        case /=/.test(E): {
            const A = E.split("=");
            return { [w(A[0], B)]: w(A[1], B) };
        }
        case /~\*/.test(E): {
            const A = E.split("~*");
            return { [w(A[0], B)]: { $regex: w(A[1], B), $options: "i" } };
        }
        case /~/.test(E): {
            const A = E.split("~");
            return { [w(A[0], B)]: { $regex: w(A[1], B) } };
        }
        case /&/.test(E): {
            const A = [],
                Q = E.split("&");
            for (let E = 0; E < Q.length; E++) {
                const s = w(Q[E], B);
                A.push(s);
            }
            return { $and: A };
        }
        case /\|/.test(E): {
            const A = [],
                Q = E.split("|");
            for (let E = 0; E < Q.length; E++) {
                const s = w(Q[E], B);
                A.push(s);
            }
            return { $or: A };
        }
        default: {
            let A = E;
            for (; B[A]; ) A = w(B[A], B);
            return A ? A.trim() : null;
        }
    }
}
let connection  = async (params)=>{

}
module.exports = {
    searchData,
    connection
}
