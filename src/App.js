/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import dayjs from "dayjs";

export default function() {
  let meals = [
    { id: 1, item: "toast with peanut butter", good: true, date: "2019-11-17" },
    { id: 2, item: "bacon egg wrap", good: true, date: "2019-11-17" },
    { id: 3, item: "pad thai", good: false, date: "2019-11-17" },
    { id: 4, item: "drinks", good: false, date: "2019-11-17" },
    { id: 5, item: "chicken steak eggs", good: true, date: "2019-11-16" },
    { id: 6, item: "soup, bread", good: true, date: "2019-11-16" },
    { id: 7, item: "drinks", good: false, date: "2019-11-16" },
    { id: 8, item: "chicken pasta", good: true, date: "2019-11-16" },
    { id: 9, item: "baklava", good: false, date: "2019-11-16" }
  ];
  let goodMeals = meals.filter(meal => meal.good);
  let badMeals = meals.filter(meal => !meal.good);
  let compliance = Math.floor((goodMeals.length / meals.length) * 100);
  let isDoingGood = compliance > 75;

  return (
    <div className="text-gray-900 antialiased leading-none">
      <header className="px-2 py-3 text-sm uppercase bg-blue-500 text-white font-bold text-center">
        <span>Nutrition</span>
      </header>
      <main>
        <div className="mt-8 text-center">
          <p className="text-sm">Past 7 days</p>
          <div className="mt-3 flex items-center justify-center">
            <span
              className={`text-2xl w-16 ${isDoingGood ? "invisible" : ""}`}
              role="img"
              aria-label="rating"
            >
              👎
            </span>
            <span className="text-5xl font-light">{compliance}%</span>{" "}
            <span
              className={`text-2xl w-16 ${isDoingGood ? "" : "invisible"}`}
              role="img"
              aria-label="rating"
            >
              👍
            </span>
          </div>

          <div className="mt-12 flex text-lg">
            <div className="w-1/3">❌ {badMeals.length}</div>
            <div className="w-1/3">🍽 {meals.length}</div>
            <div className="w-1/3">✅ {goodMeals.length}</div>
          </div>
        </div>

        <div className="px-4 pt-8">
          <MealList meals={meals} />
        </div>
      </main>
    </div>
  );
}

function MealList({ meals }) {
  let groupedMeals = meals.reduce((memo, meal) => {
    memo[meal.date] = memo[meal.date] || [];
    memo[meal.date].push(meal);
    return memo;
  }, {});

  return (
    <>
      {Object.keys(groupedMeals).map(date => (
        <div className="mt-10" key={date}>
          <h2 className="text-lg font-bold">
            {dayjs(date).format("MMM D (dddd)")}
          </h2>

          <ul className="pt-2 pl-8 list-disc">
            {groupedMeals[date].map(meal => (
              <li className="mt-2" key={meal.id}>
                {meal.good ? "✅" : "❌"} {meal.item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
