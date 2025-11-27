var state = {
  earnings: 0,
  expense: 0,
  net: 0,
  transactions: [],
};

var isUpdate = false;
var tid = null;

var transactionFormEl = document.getElementById("transactionForm");

function renderTransactions() {
  var container = document.querySelector(".transactions");
  var netAmountEl = document.getElementById("netAmount");
  var earningEl = document.getElementById("earning");
  var expenseEl = document.getElementById("expense");

  var earning = 0;
  var expense = 0;
  var net = 0;

  container.innerHTML = "";

  for (var i = 0; i < state.transactions.length; i++) {
    var t = state.transactions[i];
    var isCredit = t.type === "credit";
    var sign = isCredit ? "+" : "-";

    var transactionHTML =
      '<div class="transaction" id="' +
      t.id +
      '">' +
      '<div class="content" onclick="showEdit(' +
      t.id +
      ')">' +
      '<div class="left">' +
      "<p>" +
      t.text +
      "</p>" +
      "<p>" +
      sign +
      t.amount +
      "Rs" +
      "</p>" +
      "</div>" +
      '<div class="status ' +
      (isCredit ? "credit" : "debit") +
      '">' +
      (isCredit ? "C" : "D") +
      "</div>" +
      "</div>" +
      '<div class="lower">' +
      '<div class="icon" onclick="handleUpdate(' +
      t.id +
      ')">' +
      '<img src="" alt="pen">' +
      "</div>" +
      '<div class="icon" onclick="handleDelete(' +
      t.id +
      ')">' +
      '<img src="./icons/trash.svg" alt="trash">' +
      "</div>" +
      "</div>" +
      "</div>";

    container.innerHTML = transactionHTML + container.innerHTML;

    if (isCredit) {
      earning += t.amount;
    } else {
      expense += t.amount;
    }
  }

  net = earning - expense;

  netAmountEl.innerHTML = net + " Rs";
  earningEl.innerHTML = earning + " Rs";
  expenseEl.innerHTML = expense + " Rs";
}

function addTransaction(e) {
  e.preventDefault();

  var earnButtonClicked = false;
  if (e.submitter.id === "earnBtn") {
    earnButtonClicked = true;
  }

  var textInput = document.getElementById("text").value;
  var amountInput = document.getElementById("amount").value;

  var transaction = {
    id: isUpdate ? tid : Math.floor(Math.random() * 1000),
    text: textInput,
    amount: Number(amountInput),
    type: earnButtonClicked ? "credit" : "debit",
  };

  if (isUpdate) {
    for (var i = 0; i < state.transactions.length; i++) {
      if (state.transactions[i].id === tid) {
        state.transactions[i] = transaction;
        break;
      }
    }
    isUpdate = false;
    tid = null;
  } else {
    state.transactions.push(transaction);
  }

  renderTransactions();
  transactionFormEl.reset();
}

function showEdit(id) {
  var selected = document.getElementById(id);
  var lower = selected.querySelector(".lower");

  if (lower.className.indexOf("showTransaction") !== -1) {
    lower.className = "lower";
  } else {
    lower.className = "lower showTransaction";
  }
}

function handleUpdate(id) {
  var transaction = null;
  for (var i = 0; i < state.transactions.length; i++) {
    if (state.transactions[i].id === id) {
      transaction = state.transactions[i];
      break;
    }
  }

  document.getElementById("text").value = transaction.text;
  document.getElementById("amount").value = transaction.amount;

  tid = id;
  isUpdate = true;
}

function handleDelete(id) {
  var newList = [];
  for (var i = 0; i < state.transactions.length; i++) {
    if (state.transactions[i].id !== id) {
      newList.push(state.transactions[i]);
    }
  }
  state.transactions = newList;
  renderTransactions();
}

renderTransactions();
transactionFormEl.addEventListener("submit", addTransaction);
