/*File: index.html
Author: Katherine Tamayo
Email: katherine_tamayo@student.uml.edu
Date Created: October 30, 2025
Course: COMP 4610 - GUI Programming I
Assignment: HW3 - Interactive Dynamic Multiplication Table
Instructor: Professor Wenjin Zhou
Description: This JavaScript file contains the logic for generating an interactive dynamic multiplication table based on user input, including input validation and error handling.
*/
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("multiplicationForm");
  const tableContainer = document.getElementById("multiplicationTable");
  const errorContainer = document.getElementById("errorMessages");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values (will be empty string "" if not filled)
    const startColValue = document.getElementById("startColumn").value;
    const endColValue = document.getElementById("endColumn").value;
    const startRowValue = document.getElementById("startRow").value;
    const endRowValue = document.getElementById("endRow").value;

    // Validate input values
    if (
      !validateInputs(startColValue, endColValue, startRowValue, endRowValue)
    ) {
      tableContainer.innerHTML = "";
      return;
    }

    // Convert to integers and generate table
    const startCol = parseInt(startColValue);
    const endCol = parseInt(endColValue);
    const startRow = parseInt(startRowValue);
    const endRow = parseInt(endRowValue);

    generateTable(startCol, endCol, startRow, endRow);
  });

  function validateInputs(startCol, endCol, startRow, endRow) {
    const errorMessages = [];

    // Check if all fields are filled
    if (startCol === "" || endCol === "" || startRow === "" || endRow === "") {
      errorMessages.push("⚠️Please fill in all four fields.");
    }

    // Check if inputs are valid numbers (only if they're not empty)
    if (startCol !== "" && (isNaN(startCol) || startCol.trim() === "")) {
      errorMessages.push("Starting column must be a valid number.");
    }
    if (endCol !== "" && (isNaN(endCol) || endCol.trim() === "")) {
      errorMessages.push("Ending column must be a valid number.");
    }
    if (startRow !== "" && (isNaN(startRow) || startRow.trim() === "")) {
      errorMessages.push("Starting row must be a valid number.");
    }
    if (endRow !== "" && (isNaN(endRow) || endRow.trim() === "")) {
      errorMessages.push("Ending row must be a valid number.");
    }

    // If there are already errors, stop here
    if (errorMessages.length > 0) {
      displayErrors(errorMessages);
      return false;
    }

    // Convert to numbers for further validation
    const startColNum = parseFloat(startCol);
    const endColNum = parseFloat(endCol);
    const startRowNum = parseFloat(startRow);
    const endRowNum = parseFloat(endRow);

    // Check if inputs are integers (no decimals)
    if (
      !Number.isInteger(startColNum) ||
      !Number.isInteger(endColNum) ||
      !Number.isInteger(startRowNum) ||
      !Number.isInteger(endRowNum)
    ) {
      errorMessages.push("Please enter whole numbers only (no decimals).");
    }

    // Check for number ranges (-50 to 50)
    if (
      startColNum < -50 ||
      startColNum > 50 ||
      endColNum < -50 ||
      endColNum > 50 ||
      startRowNum < -50 ||
      startRowNum > 50 ||
      endRowNum < -50 ||
      endRowNum > 50
    ) {
      errorMessages.push("All values must be between -50 and 50.");
    }

    // Check that start is less than or equal to end
    if (startColNum > endColNum) {
      errorMessages.push("Starting column must be ≤ ending column value.");
    }
    if (startRowNum > endRowNum) {
      errorMessages.push("Starting row must be ≤ ending row value.");
    }

    // Display errors if any exist
    if (errorMessages.length > 0) {
      displayErrors(errorMessages);
      return false;
    }

    // Clear errors if validation passes
    errorContainer.innerHTML = "";
    errorContainer.classList.remove("show");
    return true;
  }

  function displayErrors(errorMessages) {
    errorContainer.innerHTML = errorMessages
      .map((msg) => `<p>${msg}</p>`)
      .join("");
    errorContainer.classList.add("show");
  }

  function generateTable(startCol, endCol, startRow, endRow) {
    const table = document.createElement("table");

    // Create table header
    const headerRow = document.createElement("tr");
    const emptyCell = document.createElement("th");
    emptyCell.textContent = "×";
    headerRow.appendChild(emptyCell);

    // Create column headers
    for (let col = startCol; col <= endCol; col++) {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create table rows
    for (let row = startRow; row <= endRow; row++) {
      const tr = document.createElement("tr");

      // Create row header
      const rowHeader = document.createElement("th");
      rowHeader.textContent = row;
      tr.appendChild(rowHeader);

      // Create data cells
      for (let col = startCol; col <= endCol; col++) {
        const td = document.createElement("td");
        td.textContent = row * col;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    // Clear previous table and display the new one
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
  }
});
