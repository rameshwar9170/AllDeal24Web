import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import { FaMapMarkerAlt, FaRupeeSign, FaTrash } from "react-icons/fa";

const filterOptions = [
  "Today",
  "This Week",
  "This Month",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 1 Year",
  "Total",
];

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Total");
  const navigate = useNavigate();

  useEffect(() => {
    const carsRef = ref(database, "Cars/");
    onValue(carsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const carsArray = Object.entries(data).map(([id, car]) => ({
          id,
          ...car,
        }));
        setCars(carsArray);
      } else {
        setCars([]);
      }
    });
  }, []);

  useEffect(() => {
    applyFilter();
  }, [cars, selectedFilter]);

  const applyFilter = () => {
    const now = new Date();
    const filtered = cars.filter((car) => {
      const postDate = new Date(car.postedTime);
      const timeDiff = now - postDate;
      const oneDay = 86400000;
      const oneWeek = oneDay * 7;
      const oneMonth = oneDay * 30;
      const threeMonths = oneMonth * 3;
      const sixMonths = oneMonth * 6;
      const oneYear = oneDay * 365;

      switch (selectedFilter) {
        case "Today":
          return timeDiff < oneDay;
        case "This Week":
          return timeDiff < oneWeek;
        case "This Month":
          return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
        case "Last Month": {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return (
            postDate.getMonth() === lastMonth.getMonth() &&
            postDate.getFullYear() === lastMonth.getFullYear()
          );
        }
        case "Last 3 Months":
          return timeDiff < threeMonths;
        case "Last 6 Months":
          return timeDiff < sixMonths;
        case "Last 1 Year":
          return timeDiff < oneYear;
        case "Total":
        default:
          return true;
      }
    });

    setFilteredCars(filtered);
  };



  const handleCarClick = (carId) => {
    navigate(`/car/${carId}`);
  };

  return (
    <div style={styles.page}>
      {cars.length === 0 ? (
        <div className="loading">Loading cars...</div>
      ) : (
        <>
          <div className="property-header">
            <h2 className="property-title">Manage Cars</h2>
            <span className="property-count">Total: {filteredCars.length}</span>
          </div>

          <div style={styles.filterContainer}>
            {filterOptions.map((option) => (
              <button
                key={option}
                className={`filter-hover ${selectedFilter === option ? "active-filter" : ""}`}
                onClick={() => setSelectedFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="card-grid">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="card-hover"
                style={styles.card}
                onClick={() => handleCarClick(car.id)}
              >
                <img src={car.carImages?.[0]} alt={car.carTitle} style={styles.image} />
                <h3 style={styles.cardTitle}>{car.carTitle}</h3>
                <div style={styles.cardLine}>
                  <FaMapMarkerAlt style={styles.icon} /> {car.carLocation}
                </div>
                <div style={styles.cardLine}>
                  <FaRupeeSign style={styles.icon} /> ₹{car.carPrice}
                </div>
               
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .loading {
          text-align: center;
          font-size: 18px;
          margin-top: 50px;
          color: #555;
        }

        .property-header {
          background: linear-gradient(135deg, #2563eb, #1e3a8a);
          padding: 8px 20px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          border-radius: 0 0 12px 12px;
          margin-bottom: 20px;
        }

        .property-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .property-count {
          font-size: 16px;
          color: #e0e7ff;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        @media (max-width: 500px) {
          .card-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .card-hover {
          border: 2px solid transparent;
          background: linear-gradient(#fff, #fff) padding-box,
                      linear-gradient(135deg, #0d47a1, #42a5f5) border-box;
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .card-hover:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 30px rgba(13, 71, 161, 0.3);
        }

        .filter-hover {
          padding: 8px 14px;
          border: 1px solid #0d47a1;
          border-radius: 6px;
          background: #fff;
          color: #0d47a1;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .filter-hover:hover {
          background-color: #0d47a1;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .active-filter {
          background-color: #0d47a1;
          color: #fff;
        }

      `}</style>
    </div>
  );
};

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    color: "#333",
  },
  filterContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "25px",
    marginTop: "10px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "14px 16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    fontSize: "14px",
  },
  cardTitle: {
    margin: "10px 0 6px",
    color: "#0d47a1",
    fontSize: "16px",
    fontWeight: "600",
  },
  cardLine: {
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    fontSize: "13.5px",
  },
  icon: {
    marginRight: "8px",
    color: "#0d47a1",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "8px",
  },
};

export default ManageCars;