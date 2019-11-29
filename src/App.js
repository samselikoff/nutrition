/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import dayjs from "dayjs";
import { useQuery } from "urql";

const getMeals = `
  query {
    meals {
      id
      item
      good
      date
    }
  }
`;

export default function() {
  const [res] = useQuery({
    query: getMeals
  });

  if (res.error) {
    console.error(res.error);
    return "Oh no!";
  }

  let meals = (res.data && res.data.meals) || [];
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
          {res.fetching ? (
            <p className="text-xl text-gray-700">Loading...</p>
          ) : (
            <>
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
            </>
          )}
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

          <ul className="pt-2 pl-4">
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
