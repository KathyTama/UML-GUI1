/* File: script.js
Author: Katherine Tamayo
Email: katherine_tamayo@student.uml.edu
Date Created: November 26, 2025
Course: COMP 4610 - GUI Programming I
Assignment: HW4 Part 2 - jQuery UI Slider and Tab Widgets
Instructor: Professor Wenjin Zhou
Description: This JavaScript file contains the logic for generating an interactive dynamic multiplication table based on user input, including input validation and error handling.
*/

$(document).ready(function () {
  const MIN_VAL = -50;
  const MAX_VAL = 50;

  // Initialize jQuery UI tabs
  $("#tabs").tabs({
    // keep first tab (Input) from being closable by UI close handler we attach later
  });

  // ---------- Validation (preserve your Part 1 logic) ----------
  $.validator.addMethod(
    "noDecimal",
    function (value, element) {
      return this.optional(element) || /^-?\d+$/.test(value);
    },
    "Please enter whole numbers only (no decimals)."
  );

  $.validator.addMethod(
    "inRange",
    function (value, element, param) {
      const min = param[0];
      const max = param[1];
      if (!value) return true;
      const val = parseInt(value, 10);
      return val >= min && val <= max;
    },
    `Please enter a value between ${MIN_VAL} and ${MAX_VAL}.`
  );

  $.validator.addMethod(
    "greaterOrEqual",
    function (value, element, param) {
      const targetVal = $(param).val();
      if (!value || !targetVal) return true;
      return parseInt(value, 10) >= parseInt(targetVal, 10);
    },
    "Ending value must be greater than or equal to the starting value."
  );

  $("#multiplicationForm").validate({
    rules: {
      startColumn: {
        required: true,
        number: true,
        noDecimal: true,
        inRange: [MIN_VAL, MAX_VAL],
      },
      endColumn: {
        required: true,
        number: true,
        noDecimal: true,
        inRange: [MIN_VAL, MAX_VAL],
        greaterOrEqual: "#startColumn",
      },
      startRow: {
        required: true,
        number: true,
        noDecimal: true,
        inRange: [MIN_VAL, MAX_VAL],
      },
      endRow: {
        required: true,
        number: true,
        noDecimal: true,
        inRange: [MIN_VAL, MAX_VAL],
        greaterOrEqual: "#startRow",
      },
    },
    messages: {
      startColumn: { required: "Please fill the starting column." },
      endColumn: { required: "Please fill the ending column." },
      startRow: { required: "Please fill the starting row." },
      endRow: { required: "Please fill the ending row." },
    },
    errorElement: "label",
    errorClass: "error plugin-error",
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },
    submitHandler: function (form) {
      // Create a new tab when the form is valid and submitted
      const startCol = parseInt($("#startColumn").val(), 10);
      const endCol = parseInt($("#endColumn").val(), 10);
      const startRow = parseInt($("#startRow").val(), 10);
      const endRow = parseInt($("#endRow").val(), 10);

      createTableTab(startCol, endCol, startRow, endRow);
      return false; // keep page from reloading
    },
  });

  // ---------- Utility: generate table HTML ----------
  function buildTableHtml(startCol, endCol, startRow, endRow) {
    // guard: if values not numbers, return empty string
    if (
      typeof startCol !== "number" ||
      typeof endCol !== "number" ||
      typeof startRow !== "number" ||
      typeof endRow !== "number"
    ) {
      return "";
    }

    // sanity: if start > end for either rows/cols, swap so the table still shows something
    const sc = Math.min(startCol, endCol);
    const ec = Math.max(startCol, endCol);
    const sr = Math.min(startRow, endRow);
    const er = Math.max(startRow, endRow);

    let html = "<table>";
    // header row
    html += "<tr><th>x</th>";
    for (let c = sc; c <= ec; c++) {
      html += `<th>${c}</th>`;
    }
    html += "</tr>";

    for (let r = sr; r <= er; r++) {
      html += `<tr><th>${r}</th>`;
      for (let c = sc; c <= ec; c++) {
        html += `<td>${r * c}</td>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    return html;
  }

  // ---------- Update live preview in Input tab whenever inputs/sliders change ----------
  function updatePreviewIfValid() {
    // clear error container
    $("#errorMessages").removeClass("show").html("");

    if ($("#multiplicationForm").valid()) {
      const sC = parseInt($("#startColumn").val(), 10);
      const eC = parseInt($("#endColumn").val(), 10);
      const sR = parseInt($("#startRow").val(), 10);
      const eR = parseInt($("#endRow").val(), 10);

      const tableHtml = buildTableHtml(sC, eC, sR, eR);
      $("#multiplicationTablePreview").html(tableHtml);
    } else {
      // Show errors in the error container for clarity (copy validator messages)
      const errors = $("#multiplicationForm").validate().errorList;
      if (errors && errors.length) {
        const msgs = errors
          .map(function (e) {
            return `<p>${e.message}</p>`;
          })
          .join("");
        $("#errorMessages").addClass("show").html(msgs);
      } else {
        $("#multiplicationTablePreview").html("");
      }
    }
  }

  // ---------- Setup sliders and two-way binding for each input (Option A: slider below input) ----------
  function setupSliderPair(inputSelector, sliderSelector) {
    const $input = $(inputSelector);
    const $slider = $(sliderSelector);

    // Initialize input with 0 if empty
    if ($input.val() === "") {
      $input.val(0);
    }

    $slider.slider({
      range: "min",
      min: MIN_VAL,
      max: MAX_VAL,
      value: parseInt($input.val(), 10) || 0,
      slide: function (event, ui) {
        $input.val(ui.value);
        // update validator state live and preview
        $("#multiplicationForm").valid();
        updatePreviewIfValid();
      },
      change: function () {
        // ensure preview updates on programmatic changes too
        updatePreviewIfValid();
      },
    });

    // Input -> slider two-way binding (typing into input moves slider)
    $input.on("input change", function () {
      const val = parseInt($(this).val(), 10);
      if (!isNaN(val)) {
        // clamp to MIN/MAX
        const clamped = Math.max(MIN_VAL, Math.min(MAX_VAL, val));
        $slider.slider("value", clamped);
        $(this).val(clamped); // reflect clamp in the input
      }
      // update validation and preview
      $("#multiplicationForm").valid();
      updatePreviewIfValid();
    });
  }

  // call setup for each pair
  setupSliderPair("#startColumn", "#startColumnSlider");
  setupSliderPair("#endColumn", "#endColumnSlider");
  setupSliderPair("#startRow", "#startRowSlider");
  setupSliderPair("#endRow", "#endRowSlider");

  // update preview initially
  updatePreviewIfValid();

  // Also attach preview button to force preview if user wants
  $("#previewBtn").click(function () {
    updatePreviewIfValid();
    // switch to Input tab to show preview
    $("#tabs").tabs("option", "active", 0);
  });

  // ---------- Create a new tab with a table snapshot ----------
  function createTableTab(startCol, endCol, startRow, endRow) {
    // ensure form valid
    if (!$("#multiplicationForm").valid()) {
      return;
    }

    const timestamp = Date.now();
    const panelId = `tab-${timestamp}`;
    const shortLabel = `${startCol}:${endCol} × ${startRow}:${endRow}`;
    const fullLabel = `[${startCol}, ${endCol}] x [${startRow}, ${endRow}]`;

    // create the new panel content (table HTML)
    const tableHtml = buildTableHtml(startCol, endCol, startRow, endRow);

    // create a new li with a checkbox, anchor, and close icon
    const $li = $(
      `<li>
         <input class="tab-select" type="checkbox" title="Select tab for multi-delete">
         <a href="#${panelId}" class="tab-link">${shortLabel}</a>
         <span class="ui-icon ui-icon-close" role="presentation" title="Close tab"></span>
       </li>`
    );

    // append new panel div
    const $panel = $(
      `<div id="${panelId}" class="tab-panel"><h3>${fullLabel}</h3>${tableHtml}</div>`
    );

    // append to DOM
    $("#tabList").append($li);
    $("#tabs").append($panel);

    // refresh tabs so jQuery UI recognizes the new panel
    $("#tabs").tabs("refresh");

    // activate the newly created tab
    const index = $("#tabList li").length - 1; // 0-based; first li is input tab
    $("#tabs").tabs("option", "active", index);

    // scroll/select behavior: ensure visible
  }

  // ---------- Close individual tab when clicking the close icon ----------
  // We listen for click events on the tabs container for close icon clicks
  $("#tabs").on("click", "span.ui-icon-close", function () {
    const $li = $(this).closest("li");
    const panelId = $li.find("a").attr("href"); // e.g. "#tab-12345"
    // protect input tab (first li) from being removed
    const liIndex = $li.index();
    if (liIndex === 0) {
      // input tab — do not allow deletion
      alert("The Input tab cannot be deleted.");
      return;
    }
    // remove panel and tab li
    const selector = panelId;
    $li.remove();
    $(selector).remove();
    $("#tabs").tabs("refresh");
    // select the input tab after deletion
    $("#tabs").tabs("option", "active", 0);
  });

  // ---------- Multi-delete: Delete selected tabs (not Input tab) ----------
  $("#deleteSelected").click(function () {
    // find all checked checkboxes in the tab list
    const $checked = $("#tabList li")
      .find("input.tab-select:checked")
      .closest("li");
    if ($checked.length === 0) {
      alert("No tabs selected for deletion.");
      return;
    }

    // iterate and remove panels for each li (skip index 0)
    let removedAny = false;
    $checked.each(function () {
      const $li = $(this);
      const idx = $li.index();
      if (idx === 0) {
        // skip input tab
        return;
      }
      const panelHref = $li.find("a").attr("href");
      $li.remove();
      if (panelHref) {
        $(panelHref).remove();
      }
      removedAny = true;
    });

    if (!removedAny) {
      alert("Cannot delete the Input tab. Select other tabs to remove.");
    }

    $("#tabs").tabs("refresh");
    $("#tabs").tabs("option", "active", 0);
  });

  // ---------- Optional: convenience - when clicking a tab label, make sure checkbox is not toggled accidentally ----------
  // Prevent the checkbox from switching the active tab when clicked
  $("#tabs").on("click", "input.tab-select", function (e) {
    e.stopPropagation();
  });

  // Also clicking the anchor should not toggle the checkbox; user can check box separately
  $("#tabs").on("click", "a.tab-link", function () {
    // ensure anchor behaves as usual (switches tabs)
  });

  // ---------- Keyboard accessibility: allow delete via keyboard (Delete key) when tab checkbox focused ----------
  $(document).on("keydown", function (e) {
    if (e.key === "Delete") {
      // if any tab-select is focused, delete selected tabs
      const focused = $("input.tab-select:focus");
      if (focused.length) {
        $("#deleteSelected").trigger("click");
      }
    }
  });
});

