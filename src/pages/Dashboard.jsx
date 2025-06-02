import React, { useState, useEffect } from "react";
import LineChart from "../components/LineChart.jsx";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase"; // adjust the path if needed
import {
    FaUsers,
    FaHome,
    FaCar,
    FaMotorcycle,
    FaTruck,
    FaMobileAlt,
    FaMoneyCheckAlt,
    FaCogs,
} from "react-icons/fa";
import PropertyDialog from "../components/PropertyDialog";
import AllProperties from "./AllProperties.jsx";


const Dashboard = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const [showPropertyDialog, setShowPropertyDialog] = useState(false);
    const [propertyCount, setPropertyCount] = useState(0);
    const [carCount, setCarCount] = useState(0);
    const [bikeCount, setBikeCount] = useState(0);
    const [phoneCount, setPhoneCount] = useState(0);
    const [commVehicleCount, setCommVehicleCount] = useState(0);
    const [loanServiceCount, setLoanServiceCount] = useState(0);
    const [homeServiceCount,setHomeServiceCount]=useState(0);

const [otherServiceCount, setOtherServiceCount] = useState(0);


    useEffect(() => {
        const usersRef = ref(database, "Users/");
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setUserCount, count);
        });

        const propertiesRef = ref(database, "App/FeaturedItems/");
        onValue(propertiesRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setPropertyCount, count);
        });
    }, []);

    const animateCount = (setter, finalCount) => {
        let start = 0;
        const duration = 1000;
        const stepTime = Math.abs(Math.floor(duration / finalCount));
        const counter = setInterval(() => {
            start += 1;
            setter(start);
            if (start >= finalCount) clearInterval(counter);
        }, stepTime || 1);
    };

    useEffect(() => {
        // Users count
        // const usersRef = ref(database, "Users/");
        // onValue(usersRef, (snapshot) => {
        //     const data = snapshot.val();
        //     const count = data ? Object.keys(data).length : 0;
        //     animateCount(setUserCount, count);
        // });

        // Properties count
        const propertiesRef = ref(database, "App/FeaturedItems/");
        onValue(propertiesRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setPropertyCount, count);
        });

        // Cars
        const carsRef = ref(database, "Cars/");
        onValue(carsRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setCarCount, count);
        });

        // Bikes
        const bikesRef = ref(database, "Bikes/");
        onValue(bikesRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setBikeCount, count);
        });

        // Phones
        const phonesRef = ref(database, "Phones/");
        onValue(phonesRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setPhoneCount, count);
        });

        // Commercial Vehicles
        const commRef = ref(database, "CommVehicals/");
        onValue(commRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setCommVehicleCount, count);
        });

        // Loan Services
        const loanRef = ref(database, "App/LoanServices/");
        onValue(loanRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setLoanServiceCount, count);
        });

        const homeServiceRef = ref(database, "App/HomeServices/");
        onValue(homeServiceRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setHomeServiceCount, count);
        });

        // Other Services
        const servicesRef = ref(database, "App/Services/");
        onValue(servicesRef, (snapshot) => {
            const data = snapshot.val();
            const count = data ? Object.keys(data).length : 0;
            animateCount(setOtherServiceCount, count);
        });

    }, []);

    // 🔁 MOVE CARD DATA INSIDE THE COMPONENT HERE
    const cardData = [
        // {
        //     title: "Total Users",
        //     count: `${userCount}+`,
        //     description: "Registered users on the platform",
        //     icon: <FaUsers />,
        //     bg: "linear-gradient(135deg, #6dd5ed, #2193b0)",
        // },
        {
            title: "Properties",
            count: `${propertyCount}+`,
            description: "Listed houses, flats, and plots",
            icon: <FaHome />,
            bg: "linear-gradient(135deg, #f7971e, #ffd200)",
        },
        {
            title: "Cars",
            count: `${carCount}+`,
            description: "Used and new cars for sale",
            icon: <FaCar />,
            bg: "linear-gradient(135deg, #43cea2, #185a9d)",
        },
        {
            title: "Bikes",
            count: `${bikeCount}+`,
            description: "Scooters, sports bikes & more",
            icon: <FaMotorcycle />,
            bg: "linear-gradient(135deg, #ff0844, #ffb199)",
        },
        {
            title: "Commercial Vehicles",
            count: `${commVehicleCount}+`,
            description: "Tempos, trucks and more",
            icon: <FaTruck />,
            bg: "linear-gradient(135deg, #00c6ff, #0072ff)",
        },
        {
            title: "Phones",
            count: `${phoneCount}`,
            description: "Old and new phones",
            icon: <FaMobileAlt />,
            bg: "linear-gradient(135deg, #f953c6, #b91d73)",
        },
        {
            title: "Loan Services",
            count: `${loanServiceCount}+`,
            description: "Home, personal & car loans",
            icon: <FaMoneyCheckAlt />,
            bg: "linear-gradient(135deg, #1e3c72, #2a5298)",
        },
        {
            title: "Home Services",
            count: `${homeServiceCount}+`,
            description: "Home, services",
            icon: <FaMoneyCheckAlt />,
            bg: "linear-gradient(135deg,rgb(196, 128, 20),rgb(187, 217, 21))",
        },
        {
            title: "Services",
            count: `${otherServiceCount}+`,
            description: "Tutors, health, events & more",
            icon: <FaCogs />,
            bg: "linear-gradient(135deg, #fc466b, #3f5efb)",
        },
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Welcome to Admin Dashboard👋</h1>
            <p style={styles.subheading}>Manage your app’s content and users here.</p>

            <div style={styles.cardGrid}>
                {cardData.map((card, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.card,
                            background: card.bg,
                            ...(hoveredIndex === index ? styles.cardHover : {}),
                            // Added flexShrink and marginRight for horizontal layout
                            flexShrink: 0,
                            marginRight: '20px', // Add spacing between cards
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => {
                            if (card.title === "Total Users") {
                                navigate("/manage-users");
                            } else if (card.title === "Cars") {
                                navigate("/manage-cars");
                            } else if (card.title === "Bikes") {
                                navigate("/manage-bikes");
                            } else if (card.title === "Commercial Vehicles") {
                                navigate("/manage-coomercial-vehicles");
                            } else if (card.title === "Properties") {
                                setShowPropertyDialog(true);
                            } else if (card.title === "Loan Services") {
                                navigate("/loan-services");
                            } else if (card.title === "Phones") {
                                navigate("/manage-phones");
                            } else if (card.title === "Services") {
                                navigate("/services");
                            }
                        }}
                    >
                        <div style={styles.icon}>{card.icon}</div>
                        <div>
                            <h3 style={styles.cardTitle}>{card.title}</h3>
                            <p style={styles.cardCount}>{card.count}</p>
                            <p style={styles.cardDesc}>{card.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Line chart section */}
            {/* <LineChart /> */}
            <AllProperties/>

            <PropertyDialog
                open={showPropertyDialog}
                onClose={() => setShowPropertyDialog(false)}
            />

        </div>
    );
};


const styles = {
    container: {
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingBottom: "20px",
        fontFamily: "Poppins, sans-serif",
        width: "100%",
        boxSizing: "border-box",
    },
    heading: {
        fontSize: "26px",
        fontWeight: "600",
        marginBottom: "8px",
        color: "#333",
    },
    subheading: {
        color: "#777",
        marginBottom: "25px",
        fontSize: "15px",
    },
    cardGrid: {
        display: "flex", // Changed from 'grid' to 'flex'
        flexWrap: "nowrap", // Prevent cards from wrapping to the next line
        overflowX: "auto", // Enable horizontal scrolling
        gap: "20px", // Maintains gap between cards
        paddingTop: "10px",// Add some padding for the scrollbar, if visible
        // Optional: Hide scrollbar for a cleaner look, but ensure usability
        WebkitOverflowScrolling: "touch", // For smoother scrolling on iOS
        MsOverflowStyle: "none",  // IE and Edge
        scrollbarWidth: "none",   // Firefox
        "&::-webkit-scrollbar": { // Chrome, Safari, Opera
            display: "none",
        },
    },
    card: {
        display: "flex",
        alignItems: "center",
        padding: "20px",
        color: "#fff",
        width: "300px",
        borderRadius: "16px",
        // boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        minHeight: "120px",
        // flexShrink: 0, // Ensure cards don't shrink
    },

    cardDesc: {
        marginTop: "6px",
        fontSize: "12px",
        fontWeight: "300",
        color: "#eee",
    },

    cardHover: {
        transform: "translateY(-5px) scale(1.03)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        filter: "brightness(1.1)",
    },
    icon: {
        fontSize: "34px",
        marginRight: "18px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: "12px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "60px",
        minHeight: "60px",
    },

    cardTitle: {
        margin: 0,
        fontSize: "17px",
        fontWeight: "600",
    },
    cardCount: {
        margin: 0,
        fontSize: "13px",
        fontWeight: "400",
    },
};

export default Dashboard;