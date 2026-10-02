const API_URL = "http://localhost:8000";
let currentUser = null;

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    
    toast.className = `fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg font-medium transform transition-all duration-300 z-50 ${isError ? 'bg-red-500' : 'bg-green-500'}`;
    toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-xmark' : 'fa-circle-check'} mr-2"></i> <span>${msg}</span>`;
    
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

async function registerUser() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    
    if(!name || !email) {
        showToast('Please enter both name and email', true);
        return;
    }
    
    const btn = document.getElementById('reg-btn');
    btn.disabled = true;
    btn.innerText = 'Creating...';
    
    try {
        const response = await fetch(`${API_URL}/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data;
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('user-info').classList.remove('hidden');
            document.getElementById('display-name').innerText = data.name;
            document.getElementById('display-balance').innerText = `$${data.account_balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
            document.getElementById('tx-overlay').classList.add('hidden');
            showToast('Account created successfully!');
            fetchTransactions();
        } else {
            showToast(data.detail || 'Error creating account', true);
        }
    } catch (e) {
        showToast('Failed to connect to API', true);
    }
    
    btn.disabled = false;
    btn.innerText = 'Create Account';
}

async function submitTransaction() {
    if (!currentUser) return;
    
    const amount = parseFloat(document.getElementById('tx-amount').value);
    const type = document.getElementById('tx-type').value;
    const location = document.getElementById('tx-location').value;
    
    if(!amount || amount <= 0) {
        showToast('Please enter a valid amount', true);
        return;
    }
    
    const btn = document.getElementById('tx-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Analyzing...';
    
    try {
        const response = await fetch(`${API_URL}/transactions/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_id: currentUser.id,
                amount: amount,
                transaction_type: type,
                location: location
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (data.is_fraud) {
                document.getElementById('alert-modal').classList.replace('hidden', 'flex');
            } else {
                currentUser.account_balance -= amount;
                document.getElementById('display-balance').innerText = `$${currentUser.account_balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
                showToast('Transaction processed successfully');
                document.getElementById('tx-amount').value = '';
            }
            fetchTransactions();
        } else {
            showToast(data.detail || 'Error processing transaction', true);
        }
    } catch (e) {
        showToast('Failed to connect to API', true);
    }
    
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i> Process Transaction';
}

async function fetchTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions/`);
        const data = await response.json();
        
        const tbody = document.getElementById('tx-table-body');
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-400">No transactions found.</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.reverse().map(tx => `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="py-3 px-2 text-gray-500 font-mono text-xs">#${tx.id.toString().padStart(4, '0')}</td>
                <td class="py-3 px-2 capitalize">${tx.transaction_type}</td>
                <td class="py-3 px-2 capitalize">${tx.location}</td>
                <td class="py-3 px-2 text-right font-medium">$${tx.amount.toLocaleString()}</td>
                <td class="py-3 px-2 text-center">
                    ${tx.is_fraud 
                        ? '<span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200"><i class="fa-solid fa-shield-virus mr-1"></i> BLOCKED</span>' 
                        : '<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200"><i class="fa-solid fa-check mr-1"></i> SAFE</span>'}
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error(e);
    }
}

fetchTransactions();
