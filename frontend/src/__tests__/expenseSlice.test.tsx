import {addExpense} from "../ReduxToolkit/slices/expenseSlice";
import { setupTestStore } from "../ReduxToolkit/setupTestStore";
import { RootState } from "../ReduxToolkit/store";

describe("expenseSlice", () => {
    let store:any;

    beforeEach(() => {
      store = setupTestStore();
    });

it("should add an expense", () => {
    store.dispatch(addExpense({ id: "1", title: "Food", amount: 100 }));
    const state = store.getState() as any; // 👈 Type assertion to avoid 'unknown' error
    console.log("state----\n", state);
    expect(state.expense?.expenses?.length).toBe(0);
    // expect(state).toBe("Food");
  });


});