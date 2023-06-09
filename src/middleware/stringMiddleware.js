//                                        dispatch
export const stringMiddleware = (store) => (next) => (action) => {
    if(typeof action === "string") {
        return next({type: action})
    }
    return next(action);
}

// dispatch('FETCH_TODOS');
// dispatch(fetchTodos())

// const fetchTodos = (action) => {

// return {type: action}
//}