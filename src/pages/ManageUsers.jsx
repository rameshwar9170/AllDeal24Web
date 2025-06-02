import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaClipboardList,
  FaWrench,
  FaCalendarAlt,
  FaStickyNote,
  FaFileExport,
  FaUserSlash,
  FaUserCheck,
} from "react-icons/fa";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase";

// Utility functions
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr);
};

const isWithinRange = (date, filter) => {
  const now = new Date();
  if (!date) return false;
  const d = new Date(date);
  switch (filter) {
    case "Today":
      return d.toDateString() === now.toDateString();
    case "This Week": {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return d >= startOfWeek;
    }
    case "This Month":
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    case "Last Month": {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    }
    case "Last 3 Months": {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3);
      return d >= threeMonthsAgo;
    }
    case "Last 6 Months": {
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6);
      return d >= sixMonthsAgo;
    }
    case "Last 1 Year": {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth());
      return d >= yearAgo;
    }
    default:
      return true;
  }
};

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

const ManageUsers = () => {
  const [selectedFilter, setSelectedFilter] = useState("Total");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [userNotes, setUserNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const usersRef = ref(database, "Users/");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersArray = [];
      const notesState = {};
  
      for (const uid in data) {
        const user = data[uid];
        const info = user.Info || {};
        const ads = user.MyAds || {};
        const services = user.myServices || {};
  
        usersArray.push({
          uid,
          name: info.name || "N/A",
          phone: info.mobile || "N/A",
          totalAds: Object.keys(ads).length,
          serviceAds: Object.keys(services).length,
          registrationDate: info.registrationDate || "N/A",
          note: info.note || "",
          isBlocked: info.isBlocked || false,
        });
  
        notesState[uid] = {
          note: info.note || "",
          changed: false,
        };
      }
  
      setUsers(usersArray);
      setUserNotes(notesState);
      filterData(usersArray, selectedFilter); // Filter before hiding loader
      setLoading(false); // ✅ Hide loader immediately after data is ready
    });
  
    return () => unsubscribe();
  }, []);
  

  const filterData = (allUsers, filter, search = "") => {
    setFilterLoading(true);
    let filtered = allUsers.filter((user) =>
      isWithinRange(parseDate(user.registrationDate), filter)
    );
  
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.phone.toLowerCase().includes(query)
      );
    }
  
    setFilteredUsers(filtered);
    setFilterLoading(false);
  };
  


  const handleFilterChange = (option) => {
    setSelectedFilter(option);
    filterData(users, option);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    filterData(users, selectedFilter, value);
  };


  const toggleBlockUser = async (uid, currentState) => {
    try {
      const userRef = ref(database, `Users/${uid}/Info`);
      await update(userRef, { isBlocked: !currentState });
      console.log("User block status updated");
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
    }
  };

  const updateUserNote = async (uid, newNote) => {
    try {
      const userRef = ref(database, `Users/${uid}/Info`);
      await update(userRef, { note: newNote });
      console.log("User note updated");
    } catch (err) {
      console.error("Error updating user note:", err);
    }
  };

  const handleNoteChange = (uid, newNote, originalNote) => {
    setUserNotes((prevNotes) => ({
      ...prevNotes,
      [uid]: {
        note: newNote,
        changed: newNote !== originalNote,
      },
    }));
  };

  const handleNoteSave = (uid) => {
    const updatedNote = userNotes[uid].note;
    updateUserNote(uid, updatedNote);
    setUserNotes((prevNotes) => ({
      ...prevNotes,
      [uid]: {
        ...prevNotes[uid],
        changed: false,
      },
    }));
  };

  const IconText = ({ icon, label, value }) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      {icon}
      <span style={{ fontWeight: "bold", marginLeft: 6 }}>{label}:</span>
      <span style={{ marginLeft: 6 }}>{value}</span>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={{ ...styles.header, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
        <h2 style={styles.title}>Manage Users</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search user by name or phone"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: "280px",
              padding: "10px 14px",
              border: "1px solid #0d47a1",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              backgroundColor: "#f9f9f9",
              color: "#333",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04), 0 2px 6px rgba(13, 71, 161, 0.05)",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => e.target.style.boxShadow = "0 0 0 3px rgba(13, 71, 161, 0.2)"}
            onBlur={(e) => e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.04), 0 2px 6px rgba(13, 71, 161, 0.05)"}
          />


          <button style={styles.exportBtn} className="export-hover">
            <FaFileExport style={{ marginRight: 8 }} />
            Export to Excel
          </button>
        </div>
      </div>
      <div style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <button
            key={option}
            style={styles.filterBtn}
            className={`filter-hover ${selectedFilter === option ? "active-filter" : ""}`}
            onClick={() => handleFilterChange(option)}
            disabled={filterLoading}
          >
            {filterLoading && selectedFilter === option ? "Loading..." : option}
          </button>
        ))}
      </div>


      {loading ? (
        <div style={styles.loaderContainer}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="card-grid">
          {filteredUsers.map((user) => {
            const noteData = userNotes[user.uid] || { note: "", changed: false };

            return (
              <div key={user.uid} className="card-hover" style={styles.card}>
                <h3 style={styles.cardTitle}>{user.name}</h3>

                <div style={styles.cardLine}>
                  <IconText icon={<FaPhone />} label="Phone" value={user.phone} />
                </div>
                <div style={styles.cardLine}>
                  <IconText icon={<FaClipboardList />} label="Total Ads" value={user.totalAds} />
                </div>
                <div style={styles.cardLine}>
                  <IconText icon={<FaWrench />} label="Service Ads" value={user.serviceAds} />
                </div>
                <div style={styles.cardLine}>
                  <IconText icon={<FaCalendarAlt />} label="Registered" value={user.registrationDate} />
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>
                    <FaStickyNote style={{ marginRight: 6 }} />
                    Note
                  </label>
                  <textarea
                    value={noteData.note || ""}
                    placeholder="Add note"
                    onChange={(e) => handleNoteChange(user.uid, e.target.value, user.note)}
                    onInput={(e) => {
                      e.target.style.height = "auto"; // Reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
                    }}
                    rows={1}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: 6,
                      resize: "none",
                      overflow: "hidden",
                      minHeight: "60px",
                      lineHeight: "1.4",
                      fontSize: "14px",
                      fontFamily: "inherit",
                    }}
                  />

                  {noteData.changed && (
                    <button
                      onClick={() => handleNoteSave(user.uid)}
                      style={{
                        marginTop: 8,
                        padding: "6px 12px",
                        backgroundColor: "#0d47a1",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "0.3s",
                        marginBottom: "10px"
                      }}
                    >
                      Save Note
                    </button>
                  )}
                </div>

                <div style={styles.actions}>
                  <button
                    onClick={() => toggleBlockUser(user.uid, user.isBlocked)}
                    style={{
                      ...styles.blockBtn,
                      backgroundColor: user.isBlocked ? "#d32f2f" : "#2e7d32",
                      color: "#fff",
                      border: "none",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                    }}
                    className="block-btn-hover"
                  >
                    {user.isBlocked ? (
                      <>
                        <FaUserCheck /> Unblock
                      </>
                    ) : (
                      <>
                        <FaUserSlash /> Block
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
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
  }

  .card-hover:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 30px rgba(13, 71, 161, 0.3);
  }

  .export-hover:hover {
    background-color: #08306b;
    transform: scale(1.03);
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
    position: relative;
    z-index: 0;
  }

  .filter-hover:hover {
    background-color: #0d47a1;
    color: white;
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .active-filter {
    color: white !important;
    background-color: #0d47a1 !important;
    border: 1px solid #0d47a1 !important;
    z-index: 1;
  }

  .active-filter:hover {
    background-color: #08306b !important;
    border-color: #08306b !important;
  }

  .spinner {
    border: 6px solid #f3f3f3;
    border-top: 6px solid #0d47a1;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}
      </style>
    </div>
  );
};

// Reusable component for field with icon
const IconText = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <div style={styles.iconWrapper}>{icon}</div>
    <span><strong>{label}:</strong> {value}</span>
  </div>
);

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    color: "#333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#0d47a1",
  },
  exportBtn: {
    padding: "10px 16px",
    backgroundColor: "#0d47a1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
  filterContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "25px",
  },
  filterBtn: {
    padding: "8px 14px",
    border: "1px solid #0d47a1",
    borderRadius: "6px",
    background: "#fff",
    color: "#0d47a1",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  activeFilter: {
    backgroundColor: "#0d47a1",
    color: "#fff",
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
    marginBottom: "12px",
    color: "#0d47a1",
    fontSize: "16px",
    fontWeight: "600",
  },

  cardLine: {
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    fontSize: "13.5px",
    lineHeight: "1.4",
  },

  iconWrapper: {
    backgroundColor: "#e3f2fd",
    padding: "4px",
    borderRadius: "50%",
    color: "#0d47a1",
    fontSize: "13px",
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "8px",
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  noteInput: {
    width: "100%",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#333",
  }


};

export default ManageUsers;
