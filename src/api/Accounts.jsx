export const getAccounts = async () => {
    const res = await fetch('https://683dc621199a0039e9e6d42d.mockapi.io/accounts');
    if (!res.ok) {
        throw new Error("Failed to fetch accounts");
    }
    return await res.json();
};
