import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import Expense from "../pages/Expenses";

test('demo', () => {
    expect(true).toBe(true)
})

test("Renders the main page", () => {
    render(<Expense />)
    expect(true).toBeTruthy()
})

