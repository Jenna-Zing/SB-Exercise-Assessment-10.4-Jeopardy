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

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <th> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
  // creates a table with an id 'jeopardy'
  const jeopardyTable = document.createElement("table");
  jeopardyTable.id = `jeopardy`;

  // 1. HEADER ROW SETUP

  // add thead to table
  // thead - HTML element encapsulating a set of table rows - comprising the head of a table with info about the table's columns
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  jeopardyTable.appendChild(thead);

  // thead will have one row of th cells -> the table header cells will contain the category
  thead.appendChild(tr);

  // for each category, create a th cell and make its displayed text show the category title
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
      td.textContent = "?"; // by default, each table data cell shows '?'.

      // add event listener for clicking clues -> * this lets you click td cells so ? -> question -> answer
      td.addEventListener("click", handleClick);

      // add the table data cell to the table row element
      tr.append(td);
    }

    // add the newly created row to the tbody
    tbody.append(tr);
  }

  // append the instantiated tbody to the table
  jeopardyTable.append(tbody);

  // append the jeopardyTable (now that its been filled in) to the document.body
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
  // sets loadinggif to display it
  loadinggif.style.display = "inline-block";

  // get the restart button and hide it while we load new category data
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    restartBtn.style.display = "none";
  }
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  // set loading gif display -> None, this hides the loading-gif
  loadinggif.style.display = "none";

  // now that new category data has loaded, we display the restart btn
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    restartBtn.style.display = "inline-block";
  }
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

/** On click of start / restart button, set up game. */
function addRestartButton() {
  // creates a button with text "Restart Game"
  const restartButton = document.createElement("button");

  // adding id to restartButton for displaying at appropriate times, and styling
  restartButton.id = "restart-btn";
  restartButton.textContent = "Restart Game";

  // adds event handler so when you click, it calls restartGame()
  restartButton.addEventListener("click", restartGame);

  // add the restart button to the document.body
  document.body.appendChild(restartButton);
}

function addLoadingGif() {
  // uses the img tag created at the start, sets its source to the loading_icon.gif I added
  loadinggif.src = "Loading_icon.gif";

  // by default, it shows as none - its display is toggled as needed by showLoadingView() and hideLoadingView() which are called in setupAndStart().
  loadinggif.style.display = "none";

  // adds the loading-gif to the document.body
  document.body.appendChild(loadinggif);
}

function restartGame() {
  console.log("restart game clicked");

  // wipe the category data
  categories = [];

  // remove existing jeopardy table - I do it by its id
  document.body.removeChild(document.getElementById("jeopardy"));

  // set up and start a new jeopardy game
  setupAndStart();
}

/** On page load, start a jeopardy game */
document.addEventListener("DOMContentLoaded", () => {
  // JS code here executes after the DOM is ready (without waiting for stylesheets, images, subframes to finish loading - preferred for code that manipulates the DOM since it runs earlier than window.onload)

  // add a header to display Jeopardy at top
  const header = document.createElement("h1");
  header.textContent = "Jeopardy";
  document.body.appendChild(header);

  // THESE ARE SETUP TO ONLY SETUP ONCE
  addLoadingGif();
  addRestartButton();

  // Start a jeopardy game - kicks off category data retrieval and sets up the table
  setupAndStart();
});
