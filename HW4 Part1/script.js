/*File: index.html
Author: Katherine Tamayo
Email: katherine_tamayo@student.uml.edu
Date Created: November 26, 2025
Course: COMP 4610 - GUI Programming I
Assignment: HW3 - Interactive Dynamic Multiplication Table
Instructor: Professor Wenjin Zhou
Description: This JavaScript file contains the logic for generating an interactive dynamic multiplication table based on user input, including input validation and error handling.
*/
$(document).ready(function () {
  // No decimal validator
  $.validator.addMethod(
    "noDecimal",
    function (value, element) {
      return this.optional(element) || /^-?\d+$/.test(value);
    },
    "Please enter whole numbers only (no decimals)."
  );

  // Range validator
  $.validator.addMethod(
    "inRange",
    function (value, element, param) {
      const min = param[0];
      const max = param[1];

      if (!value) return true; // allow typing

      const val = parseInt(value);
      return val >= min && val <= max;
    },
    "Please enter a value between -50 and 50."
  );

  // Greater than or equal validator
  $.validator.addMethod(
    "greaterOrEqual",
    function (value, element, param) {
      const targetVal = $(param).val();

      // Allow typing as long as one is empty
      if (!value || !targetVal) return true;

      return parseInt(value) >= parseInt(targetVal);
    },
    "Ending value must be greater than or equal to the starting value."
  );

  // Multiplication form validation
  $("#multiplicationForm").validate({
    rules: {
      startColumn: {
        required: true,
        number: true,
        noDecimal: true,
        inRange: [-50, 50],
      },
      endColumn: {
        required: true,
        number: true,
        noDecimal: true,
        inRange: [-50, 50],
        greaterOrEqual: "#startColumn",
      },
      startRow: {
        required: true,
        number: true,
        noDecimal: true,
        inRange: [-50, 50],
      },
      endRow: {
        required: true,
        number: true,
        noDecimal: true,
        inRange: [-50, 50],
        greaterOrEqual: "#startRow",
      },
    },

    messages: {
      startColumn: {
        required: "Please fill the starting column.",
      },
      endColumn: {
        required: "Please fill the ending column.",
      },
      startRow: {
        required: "Please fill the starting row.",
      },
      endRow: {
        required: "Please fill the ending row.",
      },
    },

    errorElement: "label",
    errorClass: "error plugin-error",

    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },

    submitHandler: function (form) {
      const startCol = parseInt($("#startColumn").val());
      const endCol = parseInt($("#endColumn").val());
      const startRow = parseInt($("#startRow").val());
      const endRow = parseInt($("#endRow").val());

      generateTable(startCol, endCol, startRow, endRow);
      return false;
    },
  });

  function generateTable(startCol, endCol, startRow, endRow) {
    const tableContainer = document.getElementById("multiplicationTable");

    const table = document.createElement("table");

    // Create table header
    const headerRow = document.createElement("tr");
    const emptyCell = document.createElement("th");
    emptyCell.textContent = "x";
    headerRow.appendChild(emptyCell);

    for (let col = startCol; col <= endCol; col++) {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Rows
    for (let row = startRow; row <= endRow; row++) {
      const tr = document.createElement("tr");

      const rowHeader = document.createElement("th");
      rowHeader.textContent = row;
      tr.appendChild(rowHeader);

      for (let col = startCol; col <= endCol; col++) {
        const td = document.createElement("td");
        td.textContent = row * col;
        tr.appendChild(td);
      }

      table.appendChild(tr);
    }

    // Replace old table
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
  }
});

