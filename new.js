const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const detailDiv = document.getElementById('detail');

form.addEventListener('submit', e => {
  e.preventDefault();
  detailDiv.innerHTML = '';
  fetchMeals(input.value.trim());
});

async function fetchMeals(query) {
  resultsDiv.textContent = 'Loading...';
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    if (!data.meals) {
      resultsDiv.textContent = 'No meals found.';
      return;
    }
    renderMealCards(data.meals);
  } catch {
    resultsDiv.textContent = 'Error fetching meals.';
  }
}

function renderMealCards(meals) {
  resultsDiv.innerHTML = '';
  meals.forEach(meal => {
    const card = document.createElement('div');
    card.className = 'meal-card';
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <p>${meal.strMeal}</p>`;
    card.addEventListener('click', () => fetchMealDetail(meal.idMeal));
    resultsDiv.appendChild(card);
  });
}

async function fetchMealDetail(id) {
  detailDiv.textContent = 'Loading details...';
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals[0];
    detailDiv.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>Ingredients:</h3>
      <ul>${getIngredients(meal).map(i => `<li>${i}</li>`).join('')}</ul>
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>`;
  } catch {
    detailDiv.textContent = 'Error loading details.';
  }
}

function getIngredients(meal) {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient) list.push(`${measure} ${ingredient}`.trim());
  }
  return list;
}
