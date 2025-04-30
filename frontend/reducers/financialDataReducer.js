export const initialState = {
    personalBudget: { spent: 0, total: 0, percentage: 0 },
    sharedBudget: { spent: 0, total: 0, percentage: 0 },
    childBudget: { spent: 0, total: 0, percentage: 0 },
}

export function financialDataReducer(state, action) {
    switch (action.type) {
        case "set_all":
            return { ...action.payload }

        case "update_personal":
            return {
                ...state,
                personalBudget: { ...state.personalBudget, ...action.payload },
            }

        case "update_shared":
            return {
                ...state,
                sharedBudget: { ...state.sharedBudget, ...action.payload },
            }

        case "update_child":
            return {
                ...state,
                childBudget: { ...state.childBudget, ...action.payload },
            }

        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}
