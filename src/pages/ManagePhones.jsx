import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import { FaRupeeSign, FaTrash } from "react-icons/fa";

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

const ManagePhones = () => {
  const [phones, setPhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Total");
  const navigate = useNavigate();

  useEffect(() => {
    const phonesRef = ref(database, "Phones/");
    onValue(phonesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const phonesArray = Object.entries(data).map(([id, phone]) => ({
          id,
          ...phone,
        }));
        setPhones(phonesArray);
      } else {
        setPhones([]);
      }
    });
  }, []);

  useEffect(() => {
    applyFilter();
  }, [phones, selectedFilter]);

  const applyFilter = () => {
    const now = new Date();
    const filtered = phones.filter((phone) => {
      const postDate = new Date(phone.postedTime);
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

    setFilteredPhones(filtered);
  };



  const handlePhoneClick = (phoneId) => {
    navigate(`/phone/${phoneId}`);
  };

  return (
    <div style={styles.page}>
      {phones.length === 0 ? (
        <div className="loading">Loading phones...</div>
      ) : (
        <>
          <div className="property-header">
            <h2 className="property-title">Manage Phones</h2>
            <span className="property-count">Total: {filteredPhones.length}</span>
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
            {filteredPhones.map((phone) => (
              <div
                key={phone.id}
                className="card-hover"
                style={styles.card}
                onClick={() => handlePhoneClick(phone.id)}
              >
                <img
                  src={phone.images?.[0]}
                  alt={phone.name}
                  style={styles.image}
                />
                <h3 style={styles.cardTitle}>{phone.name}</h3>
                <div style={styles.cardLine}>
                  <FaRupeeSign style={styles.icon} /> ₹{phone.price}
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

export default ManagePhones;