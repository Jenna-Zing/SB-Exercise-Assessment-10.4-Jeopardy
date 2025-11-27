// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

// CONSTANTS - to set up Jeopardy table (6 categories, 5 questions per category)
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CATEGORY = 5;
const API_URL = "https://rithm-jeopardy.herokuapp.com/api";

let categories = [];
const loadinggif = document.createElement("img");

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  // get as many category ids as possible
  // let res = await axios.get(
  //   "https://projects.springboard.com/jeopardy/api/categories?count=100"
  // );
  let res = await axios.get(`${API_URL}/categories?count=100`);

  // pick random sample of category ids of size NUM_CATEGORIES (used lodash for random unique sampling)
  let catIds = _.sampleSize(
    res.data.map((cat) => cat.id),
    NUM_CATEGORIES
  );

  console.log(catIds);
  return catIds;
}

// let categoryIds = getCategoryIds();

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  // retrieve data about category with given category ID
  // let res = await axios.get(
  //   `https://projects.springboard.com/jeopardy/api/category?id=${catId}`
  // );
  let res = await axios.get(`${API_URL}/category?id=${catId}`);

  let categoryInfo = res.data;

  // randomly choose 5 clues from the available clues
  let randomClues = _.sampleSize(
    categoryInfo.clues,
    NUM_QUESTIONS_PER_CATEGORY
  ).map((clue) => {
    return {
      question: clue.question,
      answer: clue.answer,
      showing: null,
    };
  });

  console.log(`getting category ${catId}`, categoryInfo.title, randomClues);

  return {
    title: categoryInfo.title,
    clues: randomClues,
  };
}

// getCategory(18);

// YOU CANNOT CALL iterate over promises... also can't await in top-level
// let categoryIds = await getCategoryIds();
// for (let id of categoryIds) {
//   let category = getCategory(id);
//   categories.push(category);
// }
// console.log(categoryIds);

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <th> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
  const jeopardyTable = document.createElement("table");
  jeopardyTable.id = `jeopardy`;
  // const jeopardyTable = document.getElementById(`jeopardy`);

  // 1. HEADER ROW SETUP

  // add thead to table
  // thead - HTML element encapsulating a set of table rows - comprising the head of a table with info about the table's columns
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  jeopardyTable.appendChild(thead);

  // select thead from the table to add tr and th
  thead.appendChild(tr);

  for (let category of categories) {
    console.log(category);
    const th = document.createElement("th");
    th.textContent = category.title;
    tr.appendChild(th);
  }

  // 2. TABLE BODY SETUP

  // tbody - HTML element encapsulating a set of table rows (comprising of the body of a table's main data)
  const tbody = document.createElement("tbody");
  jeopardyTable.appendChild(tbody);

  for (let row = 0; row < NUM_QUESTIONS_PER_CATEGORY; row++) {
    // building one row at a top (top-down) - number of rows per col = NUM_QUESTIONS_PER_CATEGORY (5)
    // create tr row
    const tr = document.createElement("tr");

    // create each cell in the row and add it to the tr
    for (let col = 0; col < NUM_CATEGORIES; col++) {
      // adding each question/clue one at a time, left to right - number of columns per row = NUM_CATEGORIES (6)
      const td = document.createElement("td");
      td.textContent = "?";

      // add click handler to td
      td.addEventListener("click", handleClick);

      tr.append(td);
    }

    // add the newly created row to the tbody
    tbody.append(tr);
  }

  // append the instantiated tbody to the table
  jeopardyTable.append(tbody);

  document.body.appendChild(jeopardyTable);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  console.log("handleClick!", evt);
  const clickTd = evt.target;
  const col = clickTd.cellIndex;
  const row = clickTd.parentElement.rowIndex;
  console.log(`clicked cell row: ${row}, col: ${col}`);

  console.log(categories, categories[col].clues[row - 1]);

  const clickedClue = categories[col].clues[row - 1];
  if (clickedClue.showing === null) {
    clickedClue.showing = "question";
    clickTd.textContent = clickedClue.question;
  } else {
    clickedClue.showing = "answer";
    clickTd.textContent = clickedClue.answer;
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
  // replace this with a loading gif -> display:
  loadinggif.style.display = "inline-block";
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  // set loading gif display -> None
  loadinggif.style.display = "none";
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  showLoadingView();

  // 1. get random category ids
  let categoryIds = await getCategoryIds();

  // 2. get data for each category
  for (let id of categoryIds) {
    let category = await getCategory(id);
    categories.push(category);
  }
  console.log(categoryIds);

  hideLoadingView();

  // 3. create HTML table
  fillTable();
}

addLoadingGif();
addRestartButton();
setupAndStart();

/** On click of start / restart button, set up game. */
function addRestartButton() {
  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Game";
  restartButton.addEventListener("click", restartGame);
  document.body.appendChild(restartButton);
}

function addLoadingGif() {
  loadinggif.src = "Loading_icon.gif";
  loadinggif.style.display = "none";
  document.body.appendChild(loadinggif);
}

// TODO
function restartGame() {
  console.log("restart game clicked");
  categories = [];

  // remove existing jeopardy table - I do it by its id
  document.body.removeChild(document.getElementById("jeopardy"));
  setupAndStart();
}

/** On page load, add event handler for clicking clues */
// TODO
