export default function createReducerByMap(initialState = {}, reducerMap = {}) {
    return (state = initialState, action = {}) => {
        const { type} = action;
        const baseType = type.split('__')[0];

        const reducer = reducerMap[baseType];

        if (!reducer) return state;

        return reducer(state, action);
    };
}
