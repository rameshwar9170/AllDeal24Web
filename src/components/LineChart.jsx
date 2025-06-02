import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getDatabase, ref, onValue } from "firebase/database";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = () => {
  const [filter, setFilter] = useState("week");
  const [labels, setLabels] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "Users/");
    const now = new Date();

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const userDates = [];

      // Collect createdAt timestamps
      Object.values(data || {}).forEach((user) => {
        const registrationDate = user.Info?.registrationDate;
        if (registrationDate) {
          const [year, month, day] = registrationDate.split("-").map(Number);
          const dateObj = new Date(year, month - 1, day);
          userDates.push(dateObj);
        }
        
      });

      let grouped = {};

      if (filter === "today") {
        grouped = {
          "12am": 0,
          "4am": 0,
          "8am": 0,
          "12pm": 0,
          "4pm": 0,
          "8pm": 0,
        };

        userDates.forEach((date) => {
          if (date.toDateString() === now.toDateString()) {
            const hour = date.getHours();
            if (hour < 4) grouped["12am"]++;
            else if (hour < 8) grouped["4am"]++;
            else if (hour < 12) grouped["8am"]++;
            else if (hour < 16) grouped["12pm"]++;
            else if (hour < 20) grouped["4pm"]++;
            else grouped["8pm"]++;
          }
        });

        setLabels(Object.keys(grouped));
        setDataPoints(Object.values(grouped));
      }

      else if (filter === "week") {
        grouped = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 6);

        userDates.forEach((date) => {
          if (date >= oneWeekAgo) {
            const day = date.toLocaleDateString("en-US", { weekday: "short" });
            if (grouped[day] !== undefined) grouped[day]++;
          }
        });

        setLabels(Object.keys(grouped));
        setDataPoints(Object.values(grouped));
      }

      else if (filter === "month") {
        grouped = {};
        for (let i = 1; i <= 30; i++) {
          grouped[`Day ${i}`] = 0;
        }

        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(now.getDate() - 29);

        userDates.forEach((date) => {
          if (date >= oneMonthAgo) {
            const dayDiff = Math.floor((date - oneMonthAgo) / (1000 * 60 * 60 * 24));
            const label = `Day ${dayDiff + 1}`;
            if (grouped[label] !== undefined) grouped[label]++;
          }
        });

        setLabels(Object.keys(grouped));
        setDataPoints(Object.values(grouped));
      }

      else if (filter === "lastmonth") {
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const daysInLastMonth = lastMonthEnd.getDate();

        grouped = {};
        for (let i = 1; i <= daysInLastMonth; i++) {
          grouped[`Day ${i}`] = 0;
        }

        userDates.forEach((date) => {
          if (date >= lastMonthDate && date <= lastMonthEnd) {
            const day = date.getDate();
            const label = `Day ${day}`;
            if (grouped[label] !== undefined) grouped[label]++;
          }
        });

        setLabels(Object.keys(grouped));
        setDataPoints(Object.values(grouped));
      }
    });
  }, [filter]);

  const totalUsers = dataPoints.reduce((sum, value) => sum + value, 0);

  const data = {
    labels,
    datasets: [
      {
        label: "New Users",
        data: dataPoints,
        borderColor: "#ffffff",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");
          return gradient;
        },
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#0d47a1",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { weight: "500", size: 12 },
        },
        position: "top",
      },
      title: {
        display: true,
        text: `User Statistics - ${
          filter === "lastmonth" ? "Last Month" : filter.charAt(0).toUpperCase() + filter.slice(1)
        }`,
        color: "#fff",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  const filterButtonStyle = (active) => ({
    padding: "6px 16px",
    marginRight: "12px",
    border: "1px solid #ffffff55",
    borderRadius: "6px",
    background: active ? "#ffffff" : "#0d47a1",
    color: active ? "#0d47a1" : "#fff",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  return (
    <div
      style={{
        background: "#0d47a1",
        borderRadius: "16px",
        padding: "25px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
        marginTop: "30px",
        color: "#fff",
      }}
    >
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setFilter("today")} style={filterButtonStyle(filter === "today")}>Today</button>
        <button onClick={() => setFilter("week")} style={filterButtonStyle(filter === "week")}>This Week</button>
        <button onClick={() => setFilter("month")} style={filterButtonStyle(filter === "month")}>This Month</button>
        <button onClick={() => setFilter("lastmonth")} style={filterButtonStyle(filter === "lastmonth")}>Last Month</button>
      </div>

      <div style={{ marginBottom: "15px", fontSize: "16px", fontWeight: "500", color: "#fff" }}>
        Total {filter === "today"
          ? "Today's"
          : filter === "week"
          ? "This Week's"
          : filter === "month"
          ? "This Month's"
          : "Last Month's"} Users:{" "}
        <span style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>{totalUsers}</span>
      </div>

      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
