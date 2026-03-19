"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

// Lista persone (modifica secondo il tuo gruppo)
const persone: string[] = ["Marco", "Luca", "Giulia", "Anna"];

// Inserisci un giovedì di riferimento da cui partire
const START_DATE = new Date("2024-01-04");

// Trova il prossimo giovedì (o oggi se è giovedì)
function getNextThursday(from: Date): Date {
  const date = new Date(from);
  const day = date.getDay();
  const diff = (4 - day + 7) % 7; // 4 = giovedì
  date.setDate(date.getDate() + diff);
  return date;
}

// Differenza in settimane tra due date
function getWeekDifference(start: Date, end: Date): number {
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
}

// Aggiunge settimane a una data
function addWeeks(date: Date, weeks: number): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + weeks * 7);
  return newDate;
}

export default function Home() {
  const [oggi, setOggi] = useState<Date | null>(null);

  useEffect(() => {
    setOggi(new Date());
  }, []);

  if (!oggi) return null;

  const prossimoGiovedi = getNextThursday(oggi);
  const settimanePassate = getWeekDifference(START_DATE, prossimoGiovedi);

  const turnoIndex = settimanePassate % persone.length;
  const prossimoIndex = (turnoIndex + 1) % persone.length;

  // Lista ordinata dei turni con date
  const turniOrdinati = persone
    .map((persona, index) => {
      const posizione =
        (index - turnoIndex + persone.length) % persone.length;

      const dataTurno = addWeeks(prossimoGiovedi, posizione);

      return {
        nome: persona,
        posizione,
        data: dataTurno,
      };
    })
    .sort((a, b) => a.posizione - b.posizione);

  const formatData = (date: Date) =>
    date.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  return (
    <main className={styles.container}>
      {/* CARD PRINCIPALE */}
      <div className={styles.card}>
        <p className={styles.date}>
          {formatData(prossimoGiovedi)}
        </p>

        <p className={styles.label}>Turno di questa settimana</p>
        <h1 className={`${styles.name} ${styles.currentTurn}`}>
          {persone[turnoIndex]}
        </h1>

        <p className={styles.nextLabel}>Settimana prossima</p>
        <h2 className={styles.nextName}>
          {persone[prossimoIndex]}
        </h2>
      </div>

      {/* CARD TURNI FUTURI */}
      <div className={styles.futureCard}>
        <p className={styles.listTitle}>Turni futuri</p>

        {turniOrdinati.map((p, i) => (
          <div
            key={i}
            className={`${styles.item} ${
              i === 0 ? styles.activeItem : ""
            }`}
          >
            <span>{p.nome}</span>
            <span className={styles.itemDate}>
              {formatData(p.data)}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}