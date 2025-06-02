import React, { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import { FaTrash } from "react-icons/fa";

const LoanServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const servicesRef = ref(database, "App/LoanServices/");
    onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, item]) => ({
          id,
          ...item,
        }));
        setServices(list);
      } else {
        setServices([]);
      }
      setLoading(false);
    });
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this loan service?");
    if (confirmDelete) {
      remove(ref(database, `App/LoanServices/${id}`));
    }
  };

  return (
    <div style={styles.page}>
      <div className="property-header">
        <h2 className="property-title">Manage Loan Services</h2>
        <span className="property-count">{services.length} Total</span>
      </div>

      {loading ? (
        <div className="loading">Loading loan services...</div>
      ) : (
        <div className="card-grid">
          {services.map((service) => (
            <div key={service.id} className="card-hover" style={styles.card}>
              <h3 style={styles.cardTitle}>{service.serviceName}</h3>
              <div style={styles.cardLine}><strong>Name:</strong> {service.customerName}</div>
              <div style={styles.cardLine}><strong>Mobile:</strong> {service.mobileNumber}</div>
              <div style={styles.cardLine}><strong>Address:</strong> {service.address}</div>
              <div style={styles.cardLine}><strong>Loan Type:</strong> {service.loanType}</div>
              <div style={styles.cardLine}><strong>Date:</strong> {service.date}</div>
              <button className="delete-button" onClick={() => handleDelete(service.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          ))}
        </div>
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
          margin-top: 20px;
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
        }

        .card-hover:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 30px rgba(13, 71, 161, 0.3);
        }

        .delete-button {
          width: 100%;
          margin-top: 10px;
          background-color: #d32f2f;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .delete-button:hover {
          background-color: #b71c1c;
          transform: scale(1.03);
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
    fontSize: "13.5px",
  },
};

export default LoanServices;
