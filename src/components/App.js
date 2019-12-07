/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import dayjs from "dayjs";
import { useQuery } from "urql";
import { MealForm } from "./MealForm";

const getMeals = `
  query GetHomepageData($startDate: date!) {
    allMeals: meals(order_by: {id: desc}) {
      id
      item
      good
      date
    }
    goodMeals: meals_aggregate(where: {date: {_gte: $startDate}, good: {_eq: true}}) {
      aggregate {
        count(columns: good)
      }
    }
    badMeals: meals_aggregate(where: {date: {_gte: $startDate}, good: {_eq: false}}) {
      aggregate {
        count(columns: good)
      }
    }
  }
`;

export default function() {
  let [editingMeal, setEditingMeal] = React.useState(null);
  let [isShowingForm, setIsShowingForm] = React.useState(false);

  const [res] = useQuery({
    query: getMeals,
    variables: {
      startDate: dayjs()
        .subtract(6, "day")
        .format("YYYY-MM-DD")
    }
  });

  if (res.error) {
    console.error(res.error);
    return <p>{res.error.message}</p>;
  }

  if (res.fetching) {
    return <p>Loading...</p>;
  }

  let goodMealsThisWeek = res.data.goodMeals.aggregate.count;
  let badMealsThisWeek = res.data.badMeals.aggregate.count;
  let totalMealsThisWeek = goodMealsThisWeek + badMealsThisWeek;
  let compliance = Math.floor((goodMealsThisWeek / totalMealsThisWeek) * 100);
  let isDoingGood = compliance > 80;

  return (
    <div className="antialiased leading-none text-gray-900">
      <header className="flex items-center justify-between px-2 py-3 text-sm font-bold text-white uppercase bg-blue-500">
        <span className="w-4"></span>
        <span>Nutrition</span>
        <button
          className="w-4 text-lg font-semibold"
          onClick={() => setIsShowingForm(true)}
        >
          +
        </button>
      </header>
      <main>
        <div className="mt-8 text-center">
          {res.fetching ? (
            <p className="text-xl text-gray-700">Loading...</p>
          ) : (
            <>
              <p className="text-sm">Past 7 days</p>
              <div className="flex items-center justify-center mt-3">
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

              <div className="flex mt-12 text-lg">
                <div className="w-1/3">❌ {badMealsThisWeek}</div>
                <div className="w-1/3">🍽 {totalMealsThisWeek}</div>
                <div className="w-1/3">✅ {goodMealsThisWeek}</div>
              </div>
            </>
          )}
        </div>

        <div className="px-4 pt-8">
          <MealList meals={res.data.allMeals} onClick={setEditingMeal} />
        </div>
      </main>

      {isShowingForm && (
        <MealForm
          onCancel={() => setIsShowingForm(false)}
          didSave={() => setIsShowingForm(null)}
        />
      )}
      {editingMeal && (
        <MealForm
          meal={editingMeal}
          onCancel={() => setEditingMeal(null)}
          didSave={() => setEditingMeal(null)}
        />
      )}
    </div>
  );
}

function MealList({ meals, onClick }) {
  let groupedMeals = meals.reduce((memo, meal) => {
    memo[meal.date] = memo[meal.date] || [];
    memo[meal.date].push(meal);
    return memo;
  }, {});

  return (
    <>
      {Object.keys(groupedMeals)
        .sort((a, b) => (a > b ? -1 : 1))
        .map(date => (
          <div className="mt-10" key={date}>
            <h2 className="text-lg font-bold">
              {dayjs(date).format("MMM D (dddd)")}
            </h2>

            <ul className="pt-2 pl-4">
              {groupedMeals[date].map(meal => (
                <li className="mt-2" key={meal.id}>
                  <button className="text-left" onClick={() => onClick(meal)}>
                    {meal.good ? "✅" : "❌"} {meal.item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </>
  );
}
