/* eslint-disable @typescript-eslint/no-explicit-any */


"use client"; // Ensures it runs in the browser

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Typography,
} from "@mui/material";

const GenerateQuotation = () => {
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(true);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    mobile: "",
    address: "",
    gstin: "",
    termsConditions: "",
  });
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [products, setProducts] = useState<{ name: string; quantity: string; rate: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://15.207.48.53:3000/generator-quotation-customers")
      .then((response) => setCustomersList(response.data as any[]))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  const handleCustomerChange = (key: string, value: string) => {
    setCustomerDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleExistingCustomerSearch = () => {
    const matchedCustomer = customersList.find(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.mobile.includes(searchQuery)
    );

    if (matchedCustomer) {
      setSelectedCustomer(matchedCustomer);
      setCustomerDetails({
        name: matchedCustomer.name,
        mobile: matchedCustomer.mobile,
        address: matchedCustomer.address,
        gstin: matchedCustomer.gstin || "N/A",
        termsConditions: matchedCustomer.terms_conditions || "",
      });
    } else {
      alert("No customer matches your search.");
    }
  };

  const addProduct = () => {
    setProducts([...products, { name: "", quantity: "", rate: "" }]);
  };

  const deleteProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const generateInvoice = async () => {
    try {
      const response = await axios.post("http://15.207.48.53:3000/generate-generator-quotation", {
        customerName: customerDetails.name,
        customerMobile: customerDetails.mobile,
        customerAddress: customerDetails.address,
        customerGstin: customerDetails.gstin || "N/A",
        termsConditions: customerDetails.termsConditions || "N/A",
        products: products.map((product) => ({
          name: product.name,
          quantity: parseInt(product.quantity),
          rate: parseInt(product.rate),
        })),
      });

      if (response.status === 200) {
        alert("Quotation generated successfully!");
      }
    } catch (error) {
      console.error("Error generating quotation:", error);
      alert("Failed to generate quotation.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <Button variant="contained" onClick={() => setIsNewCustomer(true)}>
          New Customer
        </Button>
        <Button variant="contained" onClick={() => setIsNewCustomer(false)}>
          Existing Customer
        </Button>
      </div>

      {isNewCustomer ? (
        <Card className="mb-6 p-4">
          <CardContent>
            <Typography variant="h6">New Customer Details</Typography>
            {["name", "mobile", "address"].map((field) => (
              <TextField
                key={field}
                label={`Customer ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                value={customerDetails[field as keyof typeof customerDetails]}
                onChange={(e) => handleCustomerChange(field, e.target.value)}
                fullWidth
                margin="dense"
              />
            ))}
            <TextField
              label="Terms & Conditions"
              value={customerDetails.termsConditions}
              onChange={(e) => handleCustomerChange("termsConditions", e.target.value)}
              fullWidth
              margin="dense"
              multiline
              rows={4}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6 p-4">
            <CardContent>
              <Typography variant="h6">Search Existing Customer</Typography>
              <TextField
                label="Search Customer"
                placeholder="Search by name or mobile"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                margin="dense"
              />
              <Button variant="outlined" onClick={handleExistingCustomerSearch}>
                Search
              </Button>
            </CardContent>
          </Card>

          {selectedCustomer && (
            <Card className="mb-6 p-4">
              <CardContent>
                <Typography variant="h6">Customer Details</Typography>
                {["name", "mobile", "address", "termsConditions"].map((field) => (
                  <TextField
                    key={field}
                    label={`Customer ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                    value={customerDetails[field as keyof typeof customerDetails]}
                    onChange={(e) => handleCustomerChange(field, e.target.value)}
                    fullWidth
                    margin="dense"
                    multiline={field === "termsConditions"}
                    rows={field === "termsConditions" ? 4 : 1}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Card className="mb-6 p-4">
        <CardContent>
          <Typography variant="h6">Products</Typography>
          {products.map((product, index) => (
            <Card key={index} className="mb-4 p-2">
              <CardContent>
                <Typography variant="subtitle1">Product {index + 1}</Typography>
                <TextField
                  label="Product Name"
                  value={product.name}
                  onChange={(e) => {
                    const updatedProducts = [...products];
                    updatedProducts[index].name = e.target.value;
                    setProducts(updatedProducts);
                  }}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Quantity"
                  value={product.quantity}
                  onChange={(e) => {
                    const updatedProducts = [...products];
                    updatedProducts[index].quantity = e.target.value;
                    setProducts(updatedProducts);
                  }}
                  fullWidth
                  margin="dense"
                  type="number"
                />
                <TextField
                  label="Rate"
                  value={product.rate}
                  onChange={(e) => {
                    const updatedProducts = [...products];
                    updatedProducts[index].rate = e.target.value;
                    setProducts(updatedProducts);
                  }}
                  fullWidth
                  margin="dense"
                  type="number"
                />
              </CardContent>
              <CardActions>
                <Button variant="outlined" color="error" onClick={() => deleteProduct(index)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
          <Button variant="outlined" onClick={addProduct}>
            Add Product
          </Button>
        </CardContent>
      </Card>

      <Button variant="contained" onClick={generateInvoice}>
        Generate Quotation
      </Button>
    </div>
  );
};

export default GenerateQuotation;
