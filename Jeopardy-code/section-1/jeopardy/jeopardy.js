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
  );

  console.log(`getting category ${catId}`, categoryInfo.title, randomClues);

  return {
    title: categoryInfo.title,
    clues: randomClues,
  };
}

getCategory(18);

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
  const jeopardyTable = document.getElementById(`jeopardy`);

  // add thead to table
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  jeopardyTable.appendChild(thead);

  // select thead from the table to add tr and th
  thead.appendChild(tr);
  // document.querySelector("thead").appendChild(tr);
  for (let i = 0; i < NUM_CATEGORIES; i++) {
    const th = document.createElement("th");
    tr.appendChild(th);
  }
}
fillTable();

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
