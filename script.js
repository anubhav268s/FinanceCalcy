let charts = {};

function switchTab(tab) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".tab-buttons button").forEach(el => el.classList.remove("active"));
    document.getElementById(tab).classList.add("active");
    event.target.classList.add("active");
}


function updateValue(id, isManual = false) {
    let input = document.getElementById(id);
    let slider = document.getElementById(id.replace('-value', '')); // Related slider
    let warning = document.getElementById(id + "-warning"); // Warning span

    let value = parseFloat(input.value);
    let min = parseFloat(input.min);
    let max = parseFloat(input.max);

    // Ensure years input is an integer
    if (id.includes("time")) {
        value = Math.round(value); // Round to nearest integer
        input.value = value; // Update the input field
    }

    // Show warning in red if out of range
    if (value < min || value > max) {
        warning.innerText = `Enter a value between ${min} and ${max}`;
        warning.style.color = "red"; // Set color to red
        return;
    } else {
        warning.innerText = ""; // Remove warning when valid
    }

    if (isManual) {
        slider.value = value; // Update slider if manually entered
    } else {
        input.value = value; // Update number input if slider is used
    }
}




// Sync slider movement with input field
document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", function () {
        let input = document.getElementById(this.id + "-value");
        input.value = this.value;
    });
});


function formatNumber(num) {
    return num.toLocaleString('en-IN'); // Indian number system format
}

function calculateSIP() {
    let P = parseInt(document.getElementById("sip-amount").value);
    let r = parseFloat(document.getElementById("sip-rate").value) / 12 / 100;
    let n = parseInt(document.getElementById("sip-time").value) * 12;
    let FV = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

    let yearlyBalances = [];
    let balance = 0;
    for (let i = 1; i <= n / 12; i++) {
        balance += P * 12;
        balance += balance * (r * 12);
        yearlyBalances.push(balance);
    }

    showSIPResults("sip-result", P * n, FV - P * n, FV, "sip-chart", yearlyBalances);
}

function calculateLumpsum() {
    let P = parseInt(document.getElementById("lumpsum-amount").value);
    let r = parseFloat(document.getElementById("lumpsum-rate").value) / 100;
    let n = parseInt(document.getElementById("lumpsum-time").value);
    let FV = P * Math.pow(1 + r, n);

    let yearlyBalances = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
        balance *= (1 + r);
        yearlyBalances.push(balance);
    }

    showLumpsumResults("lumpsum-result", P, FV - P, FV, "lumpsum-chart", yearlyBalances);
}

function calculateWithdrawal() {
    let principal = parseInt(document.getElementById("withdraw-amount").value);
    let rate = parseFloat(document.getElementById("withdraw-rate").value) / 100;
    let years = parseInt(document.getElementById("withdraw-time").value);
    let monthlyWithdraw = parseInt(document.getElementById("withdraw-monthly").value);

    let balance = principal;
    let totalWithdrawn = 0;
    let yearlyBalances = [];
    
    for (let year = 1; year <= years; year++) {
        let yearlyInterest = balance * rate;
        balance += yearlyInterest;

        let yearlyWithdrawal = monthlyWithdraw * 12;
        if (balance >= yearlyWithdrawal) {
            balance -= yearlyWithdrawal;
            totalWithdrawn += yearlyWithdrawal;
        } else {
            totalWithdrawn += balance;
            balance = 0;
        }

        yearlyBalances.push(balance);
    }

    showWithdrawalResults("withdraw-result", principal, totalWithdrawn, balance, "withdraw-chart", yearlyBalances);
}

function showSIPResults(id, invested, returns, totalValue, chartId, yearlyBalances) {
    document.getElementById(id).innerHTML = `
        Invested: ₹${formatNumber(invested)} <br>
        Returns: ₹${formatNumber(returns)} <br>
        Total Value: ₹${formatNumber(totalValue)}
    `;

    renderChart(chartId, yearlyBalances);
}

function showLumpsumResults(id, invested, returns, totalValue, chartId, yearlyBalances) {
    document.getElementById(id).innerHTML = `
        Invested: ₹${formatNumber(invested)} <br>
        Returns: ₹${formatNumber(returns)} <br>
        Total Value: ₹${formatNumber(totalValue)}
    `;

    renderChart(chartId, yearlyBalances);
}

function showWithdrawalResults(id, invested, withdrawn, remaining, chartId, yearlyBalances) {
    document.getElementById(id).innerHTML = `
        Invested: ₹${formatNumber(invested)} <br>
        Total Withdrawn: ₹${formatNumber(withdrawn)} <br>
        Remaining Balance: ₹${formatNumber(remaining)}
    `;

    renderChart(chartId, yearlyBalances);
}

function renderChart(chartId, yearlyBalances) {
    if (charts[chartId]) charts[chartId].destroy();
    
    let labels = [];
    for (let i = 1; i <= yearlyBalances.length; i++) {
        labels.push("Year " + i);
    }

    charts[chartId] = new Chart(document.getElementById(chartId), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Balance Over Time",
                data: yearlyBalances,
                borderColor: "blue",
                fill: false
            }]
        }
    });
}

function toggleMenu() {
    let menu = document.getElementById("nav-menu");
    menu.classList.toggle("show");
}

// Close menu when a link is clicked (for small screens)
document.querySelectorAll("#nav-menu li a").forEach(link => {
    link.addEventListener("click", () => {
        let menu = document.getElementById("nav-menu");
        if (menu.classList.contains("show")) {
            menu.classList.remove("show");
        }
    });
});



