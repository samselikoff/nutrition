import React from "react";
import dayjs from "dayjs";
import { Dialog } from "@reach/dialog";
import { useMutation } from "urql";
import { Formik, Form, Field } from "formik";

const addMealQuery = `
  mutation insert_meal($objects: [meals_insert_input!]!) {
    insert_meals(objects: $objects) {
      returning {
        id
        item
        good
        date
      }
    }
  }
`;

const updateMealQuery = `
  mutation update_meal($id: Int!, $changes: meals_set_input!) {
    update_meals(where: {id: {_eq: $id}}, _set: $changes) {
      returning {
        id
        item
        good
        date
      }
    }
  }
`;

const deleteMealQuery = `
  mutation deleteMeal($id: Int!) {
    delete_meals(where: {id: {_eq: $id}}) {
      returning {
        id
      }
    }
  }
`;

export function MealForm({ meal, onCancel, didSave }) {
  const [deleteMealResponse, deleteMeal] = useMutation(deleteMealQuery);
  const [res, addMeal] = useMutation(addMealQuery);
  const [updateMealResponse, updateMeal] = useMutation(updateMealQuery);

  function handleDelete() {
    deleteMeal({ id: meal.id }).then(didSave);
  }

  if (res.error) {
    console.error(res.error);
    return "Oh no!";
  }

  return (
    <Dialog
      className="w-3/4 px-8 pt-6 pb-8 rounded shadow-md"
      aria-label="Meal form"
      onDismiss={onCancel}
    >
      <h2 className="font-bold text-lg text-center">New Meal</h2>

      <Formik
        initialValues={{
          item: meal ? meal.item : "",
          good: meal ? meal.good : false,
          date: meal ? meal.date : dayjs().format("YYYY-MM-DD")
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          if (meal) {
            await updateMeal({ id: meal.id, changes: values });
          } else {
            await addMeal({ objects: [values] });
          }

          setSubmitting(false);
          didSave();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mt-4">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="item"
              >
                Item
              </label>

              <Field
                type="text"
                name="item"
                id="item"
                placeholder="Pad Thai"
                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mt-6">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="date"
              >
                Date
              </label>
              <Field
                type="text"
                name="date"
                id="date"
                placeholder="11-17-23"
                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mt-6">
              <p className="block text-gray-700 text-sm font-bold mb-2">
                Was it healthy?
              </p>
              <label className="md:w-2/3 block text-gray-500 font-bold">
                <Field
                  name="good"
                  type="checkbox"
                  className="mr-2 leading-tight"
                />
                <span className="text-sm">It was healthy</span>
              </label>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save it!
              </button>
              {meal && (
                <button
                  type="button"
                  className="text-red-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
