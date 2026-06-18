const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const icon = question.querySelector("span");

  question.addEventListener("click", () => {
    const isOpen = item.classList.toggle("active");

    question.setAttribute("aria-expanded", isOpen);

    if (icon) {
      icon.textContent = isOpen ? "−" : "+";
    }
  });
});
const mortgageForm = document.querySelector("#mortgageCalculator");
const mortgageResult = document.querySelector("#mortgageResult");

if (mortgageForm && mortgageResult) {
  mortgageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const homePrice = Number(document.querySelector("#homePrice").value);
    const downPayment = Number(document.querySelector("#downPayment").value);
    const interestRate = Number(document.querySelector("#interestRate").value);
    const amortizationYears = Number(document.querySelector("#amortization").value);
    const propertyTax = Number(document.querySelector("#propertyTax").value) || 0;
    const monthlyFees = Number(document.querySelector("#monthlyFees").value) || 0;

    if (homePrice <= 0 || downPayment < 0 || interestRate < 0 || amortizationYears <= 0) {
      mortgageResult.innerHTML = `
        <p class="result-label">Estimated Monthly Payment</p>
        <strong class="result-total">$0</strong>
        <p class="result-subtext">Please enter valid numbers to calculate an estimate.</p>
        <div class="result-breakdown">
          <div><span>Mortgage</span><strong>$0</strong></div>
          <div><span>Property Tax</span><strong>$0</strong></div>
          <div><span>Other Fees</span><strong>$0</strong></div>
        </div>
      `;
      return;
    }

    if (downPayment >= homePrice) {
      mortgageResult.innerHTML = `
        <p class="result-label">Estimated Monthly Payment</p>
        <strong class="result-total">$0</strong>
        <p class="result-subtext">Down payment must be less than the home price.</p>
        <div class="result-breakdown">
          <div><span>Mortgage</span><strong>$0</strong></div>
          <div><span>Property Tax</span><strong>$0</strong></div>
          <div><span>Other Fees</span><strong>$0</strong></div>
        </div>
      `;
      return;
    }

    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = amortizationYears * 12;

    let monthlyMortgagePayment;

    if (monthlyRate === 0) {
      monthlyMortgagePayment = loanAmount / numberOfPayments;
    } else {
      monthlyMortgagePayment =
        loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const monthlyPropertyTax = propertyTax / 12;
    const totalMonthlyEstimate = monthlyMortgagePayment + monthlyPropertyTax + monthlyFees;

    const formatCurrency = new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0
    });

    mortgageResult.innerHTML = `
      <p class="result-label">Estimated Monthly Payment</p>
      <strong class="result-total">${formatCurrency.format(totalMonthlyEstimate)}</strong>
      <p class="result-subtext">
        Based on a ${formatCurrency.format(loanAmount)} mortgage over ${amortizationYears} years.
      </p>
      <div class="result-breakdown">
        <div>
          <span>Mortgage</span>
          <strong>${formatCurrency.format(monthlyMortgagePayment)}</strong>
        </div>
        <div>
          <span>Property Tax</span>
          <strong>${formatCurrency.format(monthlyPropertyTax)}</strong>
        </div>
        <div>
          <span>Other Fees</span>
          <strong>${formatCurrency.format(monthlyFees)}</strong>
        </div>
      </div>
    `;
  });
}
const cashNeededForm = document.querySelector("#cashNeededCalculator");
const cashNeededResult = document.querySelector("#cashNeededResult");

function calculateOntarioLandTransferTax(purchasePrice) {
  let tax = 0;

  if (purchasePrice > 2000000) {
    tax += (purchasePrice - 2000000) * 0.025;
    purchasePrice = 2000000;
  }

  if (purchasePrice > 400000) {
    tax += (purchasePrice - 400000) * 0.02;
    purchasePrice = 400000;
  }

  if (purchasePrice > 250000) {
    tax += (purchasePrice - 250000) * 0.015;
    purchasePrice = 250000;
  }

  if (purchasePrice > 55000) {
    tax += (purchasePrice - 55000) * 0.01;
    purchasePrice = 55000;
  }

  if (purchasePrice > 0) {
    tax += purchasePrice * 0.005;
  }

  return tax;
}

if (cashNeededForm && cashNeededResult) {
  cashNeededForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const purchasePrice = Number(document.querySelector("#cashPurchasePrice").value);
    const downPayment = Number(document.querySelector("#cashDownPayment").value);
    const firstTimeBuyer = document.querySelector("#firstTimeBuyer").value;

    const legalFees = Number(document.querySelector("#legalFees").value) || 0;
    const inspectionFee = Number(document.querySelector("#inspectionFee").value) || 0;
    const appraisalFee = Number(document.querySelector("#appraisalFee").value) || 0;
    const adjustmentBuffer = Number(document.querySelector("#adjustmentBuffer").value) || 0;
    const movingCosts = Number(document.querySelector("#movingCosts").value) || 0;

    const formatCurrency = new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0
    });

    if (purchasePrice <= 0 || downPayment < 0) {
      cashNeededResult.innerHTML = `
        <p class="result-label">Estimated Cash Needed</p>
        <strong class="result-total">$0</strong>
        <p class="result-subtext">Please enter a valid purchase price and down payment.</p>
        <div class="result-breakdown">
          <div><span>Down Payment</span><strong>$0</strong></div>
          <div><span>Land Transfer Tax</span><strong>$0</strong></div>
          <div><span>First-Time Buyer Refund</span><strong>$0</strong></div>
          <div><span>Other Closing Costs</span><strong>$0</strong></div>
        </div>
      `;
      return;
    }

    if (downPayment > purchasePrice) {
      cashNeededResult.innerHTML = `
        <p class="result-label">Estimated Cash Needed</p>
        <strong class="result-total">$0</strong>
        <p class="result-subtext">Down payment cannot be higher than the purchase price.</p>
        <div class="result-breakdown">
          <div><span>Down Payment</span><strong>$0</strong></div>
          <div><span>Land Transfer Tax</span><strong>$0</strong></div>
          <div><span>First-Time Buyer Refund</span><strong>$0</strong></div>
          <div><span>Other Closing Costs</span><strong>$0</strong></div>
        </div>
      `;
      return;
    }

    const landTransferTax = calculateOntarioLandTransferTax(purchasePrice);
    const firstTimeBuyerRefund = firstTimeBuyer === "yes"
      ? Math.min(landTransferTax, 4000)
      : 0;

    const netLandTransferTax = Math.max(landTransferTax - firstTimeBuyerRefund, 0);

    const otherClosingCosts =
      legalFees +
      inspectionFee +
      appraisalFee +
      adjustmentBuffer +
      movingCosts;

    const totalCashNeeded =
      downPayment +
      netLandTransferTax +
      otherClosingCosts;

    cashNeededResult.innerHTML = `
      <p class="result-label">Estimated Cash Needed</p>
      <strong class="result-total">${formatCurrency.format(totalCashNeeded)}</strong>
      <p class="result-subtext">
        Based on a ${formatCurrency.format(purchasePrice)} purchase price and
        ${formatCurrency.format(downPayment)} down payment.
      </p>

      <div class="result-breakdown">
        <div>
          <span>Down Payment</span>
          <strong>${formatCurrency.format(downPayment)}</strong>
        </div>
        <div>
          <span>Land Transfer Tax</span>
          <strong>${formatCurrency.format(landTransferTax)}</strong>
        </div>
        <div class="refund-row">
          <span>First-Time Buyer Refund</span>
          <strong>-${formatCurrency.format(firstTimeBuyerRefund)}</strong>
        </div>
        <div>
          <span>Net Land Transfer Tax</span>
          <strong>${formatCurrency.format(netLandTransferTax)}</strong>
        </div>
        <div>
          <span>Legal Fees</span>
          <strong>${formatCurrency.format(legalFees)}</strong>
        </div>
        <div>
          <span>Inspection</span>
          <strong>${formatCurrency.format(inspectionFee)}</strong>
        </div>
        <div>
          <span>Appraisal</span>
          <strong>${formatCurrency.format(appraisalFee)}</strong>
        </div>
        <div>
          <span>Adjustments / Buffer</span>
          <strong>${formatCurrency.format(adjustmentBuffer)}</strong>
        </div>
        <div>
          <span>Moving / Setup Costs</span>
          <strong>${formatCurrency.format(movingCosts)}</strong>
        </div>
      </div>
    `;
  });
}