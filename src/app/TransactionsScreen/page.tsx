import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text as RNText, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Text } from 'react-native-web';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TransactionsScreen = () => {
  const navigation = useNavigation();
  // Retrieve the bankName passed via query parameter
  const { bankName } = useLocalSearchParams();

  // State to hold filter selection and custom dates
  const [filter, setFilter] = useState('last7days'); // Options: last7days, lastMonth, last3Months, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // State to manage visibility of date pickers
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  // State for transactions and loading flag
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch transactions from the API based on selected filter
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      let url = `http://15.207.48.53:3000/api/transactions?bankName=${encodeURIComponent(bankName)}`;
      
      if (filter === 'custom') {
        if (!customStartDate || !customEndDate) {
          Alert.alert('Validation Error', 'Please select both start and end dates for custom filter.');
          setIsLoading(false);
          return;
        }
        url += `&filter=custom&start_date=${encodeURIComponent(customStartDate)}&end_date=${encodeURIComponent(customEndDate)}`;
      } else {
        url += `&filter=${filter}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Something went wrong fetching transactions.');
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Unable to fetch transactions.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch transactions when the component mounts or when filter/custom dates change
  useEffect(() => {
    fetchTransactions();
  }, [filter, customStartDate, customEndDate]);

  // Helper function to format a Date object to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <SafeAreaView style={styles.container}>
    <h1 style={styles.header}>Transactions for {bankName}</h1></Text>
      
      {/* Filter Options */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'last7days' && styles.selectedFilter]}
          onPress={() => setFilter('last7days')}
        >
          <Text style={styles.filterText}>Last 7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'lastMonth' && styles.selectedFilter]}
          onPress={() => setFilter('lastMonth')}
        >
          <Text style={styles.filterText}>Last Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'last3Months' && styles.selectedFilter]}
          onPress={() => setFilter('last3Months')}
        >
          <Text style={styles.filterText}>Last 3 Months</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'custom' && styles.selectedFilter]}
          onPress={() => setFilter('custom')}
        >
          <Text style={styles.filterText}>Custom</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Date Inputs with Date Pickers */}
      {filter === 'custom' && (
        <View style={styles.customDatesContainer}>
          <TouchableOpacity 
            style={styles.datePickerButton} 
            onPress={() => setStartDatePickerVisibility(true)}
          >
            <Text style={styles.datePickerText}>
              {customStartDate ? customStartDate : "Select Start Date"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.datePickerButton} 
            onPress={() => setEndDatePickerVisibility(true)}
          >
            <Text style={styles.datePickerText}>
              {customEndDate ? customEndDate : "Select End Date"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchTransactions}>
        <Text style={styles.refreshText}>
          {isLoading ? 'Loading...' : 'Refresh Transactions'}
        </Text>
      </TouchableOpacity>

      {/* Transactions Table in a Horizontally Scrollable Container */}
      <ScrollView horizontal={true}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { minWidth: 100 }]}>Date</Text>
            <Text style={[styles.headerCell, { minWidth: 80 }]}>Type</Text>
            <Text style={[styles.headerCell, { minWidth: 80 }]}>Amount</Text>
            <Text style={[styles.headerCell, { minWidth: 200 }]}>Description</Text>
          </View>
          {/* Table Rows */}
          {transactions.length === 0 ? (
            <Text style={styles.noTransactions}>No transactions available for selected period.</Text>
          ) : (
            transactions.map((tx) => (
              <View key={tx.id} style={styles.tableRow}>
                <Text style={[styles.cell, { minWidth: 100 }]}>{new Date(tx.transaction_date).toLocaleDateString()}</Text>
                <Text style={[styles.cell, { minWidth: 80 }]}>{tx.transaction_type}</Text>
                <Text style={[styles.cell, { minWidth: 80 }]}>Rs. {tx.amount}</Text>
                <Text style={[styles.cell, { minWidth: 200 }]}>{tx.description}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Date Picker for Start Date */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setCustomStartDate(formatDate(date));
          setStartDatePickerVisibility(false);
        }}
        onCancel={() => setStartDatePickerVisibility(false)}
      />

      {/* Date Picker for End Date */}
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setCustomEndDate(formatDate(date));
          setEndDatePickerVisibility(false);
        }}
        onCancel={() => setEndDatePickerVisibility(false)}
      />
    </SafeAreaView>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  filterButton: { padding: 10, backgroundColor: '#ccc', borderRadius: 5 },
  selectedFilter: { backgroundColor: '#007BFF' },
  filterText: { color: '#fff', fontWeight: 'bold' },
  customDatesContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  datePickerButton: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 10, 
    marginHorizontal: 5, 
    alignItems: 'center' 
  },
  datePickerText: { fontSize: 16 },
  refreshButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  refreshText: { color: '#fff', fontWeight: 'bold' },
  table: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderColor: '#ddd' },
  headerCell: { flex: 1, padding: 10, fontWeight: 'bold', textAlign: 'center' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
  cell: { flex: 1, padding: 10, textAlign: 'center' },
  noTransactions: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});
