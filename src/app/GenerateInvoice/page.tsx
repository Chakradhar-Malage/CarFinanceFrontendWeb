"use client";

import { useState, useEffect } from "react";
import axios from "axios";
// import { AxiosError } from "axios";

const GenerateInvoice = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    mobile: "",
    address: "",
    gstin: "",
  });
  interface Customer {
    name: string;
    mobile: string;
    address: string;
    gstin: string;
  }
  
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([
    { name: "", quantity: "", rate: "", gst: "18", hsn: "998717" },
  ]);

  useEffect(() => {
    axios
      .get("http://15.207.48.53:3000/customers")
      .then((response) => {
        setCustomersList(response.data as Customer[]);
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  const handleCustomerChange = (key: string, value: string) => {
    setCustomerDetails({ ...customerDetails, [key]: value });
  };

  const handleExistingCustomerSearch = () => {
    const matchedCustomer = customersList.find(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.mobile.includes(searchQuery)
    );
    if (matchedCustomer) {
      setSelectedCustomer(matchedCustomer);
      setCustomerDetails(matchedCustomer);
    } else {
      window.alert("No customer matches your search.");
    }
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { name: "", quantity: "", rate: "", gst: "18", hsn: "998717" },
    ]);
  };

  const deleteProduct = (index: number) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const generateInvoice = async () => {
    try {
      const response = await axios.post("http://15.207.48.53:3000/generate-bill", {
        customerName: customerDetails.name,
        customerMobile: customerDetails.mobile,
        customerAddress: customerDetails.address,
        customerGstin: customerDetails.gstin,
        products: products.map((product) => ({
          name: product.name,
          quantity: parseFloat(product.quantity),
          rate: parseFloat(product.rate),
          gst: parseFloat(product.gst),
          hsn: product.hsn,
        })),
      });

      if (response.status === 200) {
        window.alert("Invoice generated successfully!");
      }
    } catch (error) {
      if (error) {
        // if (error instanceof AxiosError) {
          // console.error("Error generating invoice:", error.response || error.message);
        // } else {
          console.error("Error generating invoice:", error);
        // }
      } else {
        console.error("Error generating invoice:", error);
      }
      window.alert("Failed to generate invoice.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ flexDirection: "row", display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={() => setIsNewCustomer(true)} style={{ flex: 1, margin: "0 5px" }}>
          New Customer
        </button>
        <button onClick={() => setIsNewCustomer(false)} style={{ flex: 1, margin: "0 5px" }}>
          Existing Customer
        </button>
      </div>

      {isNewCustomer ? (
        <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10 }}>
          <h3>New Customer Details</h3>
          {["name", "mobile", "address", "gstin"].map((field, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <label>{`Customer ${field.charAt(0).toUpperCase() + field.slice(1)}`}</label>
              <input
                value={customerDetails[field as keyof typeof customerDetails]}
                onChange={(e) => handleCustomerChange(field, e.target.value)}
                style={{ width: "100%", marginBottom: 5 }}
                type={field === "mobile" ? "number" : "text"}
                autoCapitalize={field === "gstin" ? "characters" : "none"}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10 }}>
            <h3>Search Existing Customer</h3>
            <input
              placeholder="Search by name or mobile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", marginBottom: 5 }}
            />
            <button onClick={handleExistingCustomerSearch}>Search</button>
          </div>

          {selectedCustomer && (
            <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10 }}>
              <h3>Customer Details</h3>
              {["name", "mobile", "address", "gstin"].map((field, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <label>{`Customer ${field.charAt(0).toUpperCase() + field.slice(1)}`}</label>
                  <input
                    value={customerDetails[field as keyof typeof customerDetails]}
                    onChange={(e) => handleCustomerChange(field, e.target.value)}
                    style={{ width: "100%", marginBottom: 5 }}
                    type="text"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10 }}>
        <h3>Products</h3>
        {products.map((product, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <h4>{`Product ${index + 1}`}</h4>
            <div style={{ marginBottom: 5 }}>
              <label>Product Name</label>
              <input
                value={product.name}
                onChange={(e) => {
                  const updatedProducts = [...products];
                  updatedProducts[index].name = e.target.value;
                  setProducts(updatedProducts);
                }}
                style={{ width: "100%", marginBottom: 5 }}
                type="text"
              />
            </div>
            <div style={{ marginBottom: 5 }}>
              <label>Quantity</label>
              <input
                value={product.quantity}
                onChange={(e) => {
                  const updatedProducts = [...products];
                  updatedProducts[index].quantity = e.target.value;
                  setProducts(updatedProducts);
                }}
                style={{ width: "100%", marginBottom: 5 }}
                type="number"
              />
            </div>
            <div style={{ marginBottom: 5 }}>
              <label>Rate</label>
              <input
                value={product.rate}
                onChange={(e) => {
                  const updatedProducts = [...products];
                  updatedProducts[index].rate = e.target.value;
                  setProducts(updatedProducts);
                }}
                style={{ width: "100%", marginBottom: 5 }}
                type="number"
              />
            </div>
            <div style={{ marginBottom: 5 }}>
              <label>GST (%)</label>
              <input
                value={product.gst}
                onChange={(e) => {
                  const updatedProducts = [...products];
                  updatedProducts[index].gst = e.target.value;
                  setProducts(updatedProducts);
                }}
                style={{ width: "100%", marginBottom: 5 }}
                type="number"
              />
            </div>
            <div style={{ marginBottom: 5 }}>
              <label>HSN Code</label>
              <input
                value={product.hsn}
                onChange={(e) => {
                  const updatedProducts = [...products];
                  updatedProducts[index].hsn = e.target.value;
                  setProducts(updatedProducts);
                }}
                style={{ width: "100%", marginBottom: 5 }}
                type="number"
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button onClick={() => deleteProduct(index)} style={{ color: "red" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
        <button onClick={addProduct}>Add Product</button>
      </div>

      <button
        onClick={generateInvoice}
        style={{ backgroundColor: "#841584", color: "#fff", padding: 10, borderRadius: 5, width: "100%" }}
      >
        Generate Invoice
      </button>
    </div>
  );
};

export default GenerateInvoice;
