/* eslint-disable @typescript-eslint/prefer-as-const */

"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface Transaction {
  id: string;
  transaction_date: string;
  transaction_type: string;
  amount: number;
  description: string;
}

function TransactionsScreenContent() {
  const searchParams = useSearchParams();
  const bankName = searchParams.get("bankName");

  // State for filter and custom dates
  const [filter, setFilter] = useState("last7days"); // Options: last7days, lastMonth, last3Months, custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Transactions state and loading flag
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Wrap fetchTransactions in useCallback so it can be added to dependencies.
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `http://15.207.48.53:3000/api/transactions?bankName=${encodeURIComponent(
        bankName || ""
      )}`;

      if (filter === "custom") {
        if (!customStartDate || !customEndDate) {
          window.alert(
            "Validation Error: Please select both start and end dates for custom filter."
          );
          setIsLoading(false);
          return;
        }
        url += `&filter=custom&start_date=${encodeURIComponent(
          customStartDate
        )}&end_date=${encodeURIComponent(customEndDate)}`;
      } else {
        url += `&filter=${filter}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        window.alert(
          errorData.message ||
            "Something went wrong fetching transactions."
        );
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      window.alert("Unable to fetch transactions.");
    } finally {
      setIsLoading(false);
    }
  }, [bankName, filter, customStartDate, customEndDate]);

  // Fetch transactions when the component mounts or when filter/dates change
  useEffect(() => {
    if (bankName) {
      fetchTransactions();
    }
  }, [bankName, filter, customStartDate, customEndDate, fetchTransactions]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        Transactions for {bankName || "Unknown Bank"}
      </h1>

      {/* Filter Options */}
      <div style={styles.filterContainer}>
        {["last7days", "lastMonth", "last3Months", "custom"].map((opt) => (
          <button
            key={opt}
            style={{
              ...styles.filterButton,
              ...(filter === opt ? styles.selectedFilter : {}),
            }}
            onClick={() => setFilter(opt)}
          >
            {opt === "last7days"
              ? "Last 7 Days"
              : opt === "lastMonth"
              ? "Last Month"
              : opt === "last3Months"
              ? "Last 3 Months"
              : "Custom"}
          </button>
        ))}
      </div>

      {/* Custom Date Inputs */}
      {filter === "custom" && (
        <div style={styles.customDatesContainer}>
          <div style={styles.datePickerContainer}>
            <label style={styles.dateLabel}>Start Date:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              style={styles.datePickerInput}
            />
          </div>
          <div style={styles.datePickerContainer}>
            <label style={styles.dateLabel}>End Date:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              style={styles.datePickerInput}
            />
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button style={styles.refreshButton} onClick={fetchTransactions}>
        {isLoading ? "Loading..." : "Refresh Transactions"}
      </button>

      {/* Transactions Table */}
      <div style={styles.tableContainer}>
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <div style={{ ...styles.headerCell, minWidth: 100 }}>Date</div>
            <div style={{ ...styles.headerCell, minWidth: 80 }}>Type</div>
            <div style={{ ...styles.headerCell, minWidth: 80 }}>Amount</div>
            <div style={{ ...styles.headerCell, minWidth: 200 }}>Description</div>
          </div>
          {transactions.length === 0 ? (
            <p style={{ ...styles.noTransactions, textAlign: "center" }}>
              No transactions available for selected period.
            </p>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} style={styles.tableRow}>
                <div
                  style={{
                    ...styles.cell,
                    minWidth: 100,
                    textAlign: "center",
                  }}
                >
                  {new Date(tx.transaction_date).toLocaleDateString()}
                </div>
                <div
                  style={{
                    ...styles.cell,
                    minWidth: 80,
                    textAlign: "center",
                  }}
                >
                  {tx.transaction_type}
                </div>
                <div
                  style={{
                    ...styles.cell,
                    minWidth: 80,
                    textAlign: "center",
                  }}
                >
                  Rs. {tx.amount}
                </div>
                <div
                  style={{
                    ...styles.cell,
                    minWidth: 200,
                    textAlign: "center",
                  }}
                >
                  {tx.description}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- Wrapper Component with Suspense ---
export default function TransactionsScreen() {
  return (
    <Suspense fallback={<div>Loading Transactions...</div>}>
      <TransactionsScreenContent />
    </Suspense>
  );
}

// --- Styles Object ---
const styles = {
  container: {
    padding: 20,
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 10,
    flexWrap: "wrap" as "wrap",
    gap: "10px",
  },
  filterButton: {
    padding: "10px 15px",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  selectedFilter: {
    backgroundColor: "#007BFF",
  },
  customDatesContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 10,
    flexWrap: "wrap" as "wrap",
    gap: "10px",
  },
  datePickerContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
  },
  dateLabel: {
    marginBottom: 5,
  },
  datePickerInput: {
    padding: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  refreshButton: {
    backgroundColor: "#007BFF",
    padding: "10px 15px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  tableContainer: {
    overflowX: "auto" as "auto",
  },
  table: {
    minWidth: 500,
    border: "1px solid #ddd",
    borderRadius: 5,
  },
  tableHeader: {
    display: "flex",
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #ddd",
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: "bold",
    textAlign: "center" as "center",
  },
  tableRow: {
    display: "flex",
    borderBottom: "1px solid #ddd",
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center" as "center",
  },
  noTransactions: {
    textAlign: "center" as "center",
    margin: 20,
    fontSize: 16,
  },
};
