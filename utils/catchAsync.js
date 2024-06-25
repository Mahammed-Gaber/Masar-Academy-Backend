


module.exports = fn => {
    return (req, res, next)=> {
        fn(req, res, next).catch(next);
    }
}

// const catchAsync = fn => (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
// };


// module.exports = fn => {
//     return (req, res, next) => {
//         fn(req, res, next).catch(err => {
//             res.status(500).json({ error: err.message });
//         });
//     }
// }


