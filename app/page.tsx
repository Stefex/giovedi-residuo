"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type Person = {
  name: string;
};

const initialPeople: Person[] = [
  { name: "Mario Rossi" },
  { name: "Lucia Bianchi" },
  { name: "Giovanni Verdi" },
  { name: "Anna Neri" },
];

export default function HomePage() {
  const [people] = useState<Person[]>(initialPeople);

  const today = new Date();

  // trova il giovedì corrente (se oggi è giovedì usa oggi)
  const getCurrentThursday = () => {
    const d = new Date(today);
    const day = d.getDay();
    const diff = (day + 7 - 4) % 7; // 4 = giovedì
    d.setDate(d.getDate() - diff);
    return d;
  };

  const currentThursday = getCurrentThursday();

  // lista di tutti i giovedì a partire da una data base
  const startDate = new Date("2026-01-01");

  const getThursdayIndex = (date: Date) => {
    const diffTime = date.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  };

  const currentIndex =
    ((getThursdayIndex(currentThursday) % people.length) + people.length) %
    people.length;

  const currentPerson = people[currentIndex];

  // prossimi giovedì REALI
  const nextTurns = useMemo(() => {
    const result = [];

    for (let i = 1; i <= 4; i++) {
      const nextDate = new Date(currentThursday);
      nextDate.setDate(currentThursday.getDate() + i * 7);

      const index = (currentIndex + i) % people.length;

      result.push({
        date: nextDate.toLocaleDateString("it-IT", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
        }),
        name: people[index].name,
      });
    }

    return result;
  }, [people, currentIndex, currentThursday]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Turni del Giovedì</h1>

      {/* turno attuale */}
      <div className={styles.currentCard}>
        <div className={styles.label}>Turno attuale</div>
        <div className={styles.name}>{currentPerson.name}</div>
        <div className={styles.date}>
          {currentThursday.toLocaleDateString("it-IT", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
          })}
        </div>
      </div>

      {/* prossimi turni */}
      <div className={styles.nextCard}>
        <div className={styles.label}>Prossimi turni</div>
        {nextTurns.map((t, i) => (
          <div key={i} className={styles.item}>
            <span>{t.date}</span>
            <span>{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
