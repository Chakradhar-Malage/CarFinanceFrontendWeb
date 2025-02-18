// Default values for the global state
export const globalState = {
    TempforViewing: null,
    totalPendingAmount: 0,
    UserName: 'OmSai',
    totalCount: 0,
};

// Function to load saved data from localStorage
export const loadGlobalState = () => {
    try {
        const totalPendingAmount = localStorage.getItem('totalPendingAmount');
        const totalCount = localStorage.getItem('totalCount');
        
        // Update globalState with persisted values
        if (totalPendingAmount !== null) globalState.totalPendingAmount = Number(totalPendingAmount);
        if (totalCount !== null) globalState.totalCount = Number(totalCount);
    } catch (error) {
        console.error('Error loading global state:', error);
    }
};

// Function to save global state to localStorage
export const saveGlobalState = () => {
    try {
        localStorage.setItem('totalPendingAmount', String(globalState.totalPendingAmount));
        localStorage.setItem('totalCount', String(globalState.totalCount));
    } catch (error) {
        console.error('Error saving global state:', error);
    }
};
