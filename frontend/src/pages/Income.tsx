import { useState } from "react";
import styles from "./Income.module.css";

interface IncomeProps {

}

const initialState = {
    type: '',
    income: 0,
    date: ''
}
const Income: React.FC<IncomeProps> = () => {
    const [formData, setFormData] = useState(initialState)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState, // Spread the previous state
            [id]: value, // Update the field that matches the input's id
        }));
    };
    
    return (
        <>
            <div className={styles.container}>
                <div className={styles.incomeBox}>
                    <h2 className={styles.headingTitle}>Income</h2>
                    <button className={styles.btn}>Add Income</button>
                </div>
                <form className={styles.form}>
                    <div className={styles.floatingLabel} style={{ flexGrow: 1 }}>
                        <input type="text" id="type"
                            value={formData.type}
                            placeholder=" "
                            onChange={handleChange}
                            required />
                        <label htmlFor="type">Type</label>
                    </div>
                    <div className={styles.floatingLabel} style={{ flexGrow: 0.5 }}>
                        <input type="number" id="income" value={formData.income}
                            placeholder=" "
                            onChange={handleChange}
                            required />
                        <label htmlFor="income">Income</label>
                    </div>
                    <div className={`${styles.floatingLabel} ${styles.dateInputContainer}`} style={{ flexGrow: 0.5 }}>
                        <input type="date" id="date"
                            value={formData.date}
                            placeholder=""
                            onChange={handleChange}
                            required />
                        <label htmlFor="date">Date</label>
                    </div>


                    <button className={styles.btn} style={{ flexGrow: 0.5 }}>Submit</button>
                </form>
            </div>
        </>
    );
}

export default Income;