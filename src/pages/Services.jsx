import React, { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const servicesRef = ref(database, "App/Services/");
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await remove(ref(database, `App/Services/${id}`));
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleCardClick = (service) => {
    navigate(`/service-details/${service.id}`, { state: { service } });
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <h2 className="services-title">Manage Services</h2>
        <span className="services-count">{services.length} Total</span>
      </div>

      {loading ? (
        <div className="loading">Loading services...</div>
      ) : (
        <div className="card-grid">
          {services.map((service) => (
            <div key={service.id} className="card-hover">
              <div className="card-top" onClick={() => handleCardClick(service)}>
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="card-image"
                />
                <div className="card-content">
                  <h3 className="card-title">{service.title}</h3>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(service.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Inline CSS */}
      <style>{`
        .services-page {
          padding: 20px;
          font-family: "Poppins", sans-serif;
          color: #333;
        }

        .services-header {
          background: linear-gradient(135deg, #2563eb, #1e3a8a);
          padding: 10px 20px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 0 0 12px 12px;
        }

        .services-title {
          font-size: 20px;
          font-weight: 700;
        }

        .services-count {
          font-size: 16px;
          color: #c7d2fe;
        }

        .loading {
          text-align: center;
          font-size: 18px;
          margin-top: 50px;
          color: #555;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .card-hover {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(13, 71, 161, 0.15);
        }

        .card-top {
          cursor: pointer;
        }

        .card-image {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
        }

        .card-content {
          padding: 12px;
          text-align: center;
        }

        .card-title {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #1e3a8a;
        }

        .delete-button {
          width: 100%;
          padding: 10px;
          background-color: #ef4444;
          color: white;
          font-weight: 600;
          border: none;
          cursor: pointer;
          border-top: 1px solid #fca5a5;
          border-radius: 0 0 14px 14px;
          transition: background-color 0.3s ease;
        }

        .delete-button:hover {
          background-color: #dc2626;
        }

        @media (max-width: 500px) {
          .card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Services;
