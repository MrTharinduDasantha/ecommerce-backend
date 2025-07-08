import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  pdf,
  Image,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import OrderDetails from "./OrderDetails";
import "./InvoicePDF.css";

// Function to generate map URL for PDF
const generateMapUrl = (address, city, country) => {
  if (!address || !city || !country) return null;

  try {
    // Clean and encode the address components
    const cleanAddress = address.trim().replace(/\s+/g, " ");
    const cleanCity = city.trim();
    const cleanCountry = country.trim();

    const fullAddress = encodeURIComponent(
      `${cleanAddress}, ${cleanCity}, ${cleanCountry}`
    );

    // Try multiple map services for better reliability
    const mapServices = [
      // Primary: OpenStreetMap static image service
      `https://staticmap.openstreetmap.de/staticmap.php?center=${fullAddress}&zoom=13&size=400x200&markers=${fullAddress},red&format=png`,
      // Fallback: Alternative OpenStreetMap service
      `https://maps.googleapis.com/maps/api/staticmap?center=${fullAddress}&zoom=13&size=400x200&maptype=roadmap&markers=color:red%7C${fullAddress}`,
      // Secondary fallback: City-level map
      `https://staticmap.openstreetmap.de/staticmap.php?center=${cleanCity},${cleanCountry}&zoom=10&size=400x200&markers=${cleanCity},${cleanCountry},red&format=png`,
    ];

    const mapUrl = mapServices[0]; // Use the first (most reliable) option
    console.log("Generated map URL:", mapUrl);
    return mapUrl;
  } catch (error) {
    console.error("Error generating map URL:", error);
    return null;
  }
};
const sanitizeAddress = (value = "") =>
  value.replace(/[/.]/g, " ").replace(/\s+/g, " ").trim();

const getStaticMapBase64 = async (address, city, country) => {
  const cleanAddress = sanitizeAddress(address);
  const cleanCity = sanitizeAddress(city);
  const cleanCountry = sanitizeAddress(country);

  const fullAddress = encodeURIComponent(
    `${cleanAddress}, ${cleanCity}, ${cleanCountry}`
  );
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${fullAddress}&zoom=13&size=400x200&markers=${fullAddress},red&format=png`;

  console.log("Final map URL:", mapUrl);

  try {
    const response = await fetch(mapUrl);
    const blob = await response.blob();

    // Ensure it's actually an image
    if (!blob.type.startsWith("image")) {
      console.warn("Fetched content is not an image:", blob.type);
      return null;
    }

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // data:image/png;base64,...
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching map image:", error);
    return null;
  }
};

// Function to create a simple map placeholder
const createMapPlaceholder = (address, city, country) => {
  return {
    width: 400,
    height: 200,
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };
};

// Function to validate map URL
const validateMapUrl = async (url) => {
  if (!url) return false;

  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error("Map URL validation failed:", error);
    return false;
  }
};

// Test function to verify map URL generation
const testMapUrlGeneration = (address, city, country) => {
  console.log("Testing map URL generation with:", { address, city, country });
  const mapUrl = generateMapUrl(address, city, country);
  console.log("Generated map URL:", mapUrl);

  if (mapUrl) {
    // Create a test image element to check if the URL loads
    const testImg = new Image();
    testImg.onload = () => {
      console.log("✅ Map URL loads successfully");
    };
    testImg.onerror = () => {
      console.log("❌ Map URL failed to load");
    };
    testImg.src = mapUrl;
  }

  return mapUrl;
};

// Test function to verify PDF generation
const testPDFGeneration = async () => {
  try {
    console.log("Testing PDF generation with minimal data...");
    const testData = {
      orderId: "TEST-001",
      orderDate: new Date().toLocaleString(),
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      deliveryType: "Standard",
      deliveryStatus: "Processing",
      customerName: "Test Customer",
      address: "123 Test Street",
      city: "Test City",
      country: "Test Country",
      subtotal: 100.0,
      discount: 0,
      deliveryFee: 10.0,
      total: 110.0,
      mapUrl: null,
      statusHistory: [
        { status: "Order Confirmed", date: new Date().toLocaleString() },
      ],
      estimatedDeliveryDate: "Date not available",
      currentStatus: {},
    };

    const blob = await pdf(<InvoicePDF data={testData} />).toBlob();
    return true;
  } catch (error) {
    console.error("❌ PDF generation test failed:", error);
    return false;
  }
};

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "flex-start",
    position: "relative",
    fontFamily: "Helvetica",
  },

  // Header Section
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#5CAF90",
  },

  headerLeft: {
    flex: 1,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D372E",
    marginBottom: 8,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  logoAsipiya: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D372E",
  },

  logoInvoice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5CAF90",
  },

  tagline: {
    fontSize: 12,
    color: "#666666",
    fontStyle: "italic",
  },

  invoiceTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1D372E",
    marginBottom: 8,
  },

  invoiceSubtitle: {
    fontSize: 14,
    color: "#5CAF90",
    fontWeight: "600",
  },

  // Order Info Section
  orderInfoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },

  orderInfoLeft: {
    flex: 1,
  },

  orderInfoRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  infoGroup: {
    marginBottom: 12,
    width: "100px",
  },

  infoLabel: {
    fontSize: 10,
    color: "#666666",
    fontWeight: "600",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    width: "100px",
  },

  infoValue: {
    fontSize: 12,
    color: "#1D372E",
    fontWeight: "600",
  },

  // Section Titles
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "#1D372E",
    fontWeight: "bold",
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#5CAF90",
  },

  sectionTitleContainer: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#5CAF90",
  },

  sectionTitleOrder: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "bold",
  },

  sectionTitleSummary: {
    fontSize: 18,
    color: "#5CAF90",
    fontWeight: "bold",
  },

  sectionTitleDelivery: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "bold",
  },

  sectionTitleAddress: {
    fontSize: 18,
    color: "#5CAF90",
    fontWeight: "bold",
  },

  sectionTitlePricing: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "bold",
  },

  sectionTitleSummaryPricing: {
    fontSize: 18,
    color: "#5CAF90",
    fontWeight: "bold",
  },

  sectionTitleOrderStatus: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "bold",
  },

  sectionTitleStatus: {
    fontSize: 18,
    color: "#5CAF90",
    fontWeight: "bold",
  },

  // Order Number Section
  orderNumberSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f0f8f0",
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#5CAF90",
  },

  orderNumberLabel: {
    fontSize: 14,
    color: "#1D372E",
    fontWeight: "600",
  },

  orderNumberValue: {
    fontSize: 16,
    color: "#5CAF90",
    fontWeight: "bold",
  },

  // Delivery Address Section
  addressSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },

  addressRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  addressLabel: {
    width: "25%",
    fontSize: 11,
    color: "#666666",
    fontWeight: "600",
  },

  addressValue: {
    width: "75%",
    fontSize: 11,
    color: "#000000",
    fontWeight: "bold",
  },

  // Order Items Section
  itemsSection: {
    marginBottom: 25,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },

  itemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  itemDetails: {
    flex: 1,
  },

  itemName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1D372E",
    marginBottom: 4,
  },

  itemAttributes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  attributeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  attributeLabel: {
    fontSize: 9,
    color: "#666666",
    marginRight: 4,
  },

  attributeValue: {
    fontSize: 9,
    fontWeight: "600",
    color: "#1D372E",
  },

  colorSwatch: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginLeft: 4,
  },

  itemPrice: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "right",
  },

  // Pricing Summary
  pricingSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },

  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  pricingLabel: {
    fontSize: 11,
    color: "#666666",
    fontWeight: "500",
  },

  pricingValue: {
    fontSize: 11,
    color: "#1D372E",
    fontWeight: "600",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#5CAF90",
  },

  totalLabel: {
    fontSize: 14,
    color: "#1D372E",
    fontWeight: "bold",
  },

  totalValue: {
    fontSize: 16,
    color: "#5CAF90",
    fontWeight: "bold",
  },

  // Order Status Section
  statusSection: {
    marginBottom: 25,
  },

  statusItem: {
    flexDirection: "row",
    marginBottom: 6,
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    alignItems: "center",
  },

  statusText: {
    fontSize: 10,
    color: "#1D372E",
    flex: 1,
    fontWeight: "500",
  },

  statusDate: {
    fontSize: 9,
    color: "#666666",
    width: "25%",
  },

  statusIcon: {
    fontSize: 10,
    color: "#5CAF90",
    fontWeight: "bold",
    width: "10%",
    textAlign: "center",
  },

  currentStatusItem: {
    flexDirection: "row",
    marginBottom: 6,
    padding: 10,
    backgroundColor: "#e8f5e8",
    borderRadius: 6,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#5CAF90",
  },

  currentStatusText: {
    fontSize: 11,
    color: "#1D372E",
    flex: 1,
    fontWeight: "bold",
  },

  currentStatusDate: {
    fontSize: 9,
    color: "#5CAF90",
    width: "25%",
    fontWeight: "600",
  },

  currentStatusIcon: {
    fontSize: 10,
    color: "#5CAF90",
    fontWeight: "bold",
    width: "10%",
    textAlign: "center",
  },

  estimatedDelivery: {
    flexDirection: "row",
    marginTop: 10,
    padding: 8,
    backgroundColor: "#fff3cd",
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },

  estimatedDeliveryLabel: {
    fontSize: 10,
    color: "#856404",
    fontWeight: "bold",
    width: "50%",
  },

  estimatedDeliveryValue: {
    fontSize: 10,
    color: "#856404",
    width: "50%",
    fontWeight: "500",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#5CAF90",
  },

  thankYouText: {
    fontSize: 14,
    textAlign: "center",
    color: "#5CAF90",
    fontWeight: "600",
    fontStyle: "italic",
    marginBottom: 8,
  },

  // Utility styles
  spacer: {
    height: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 15,
  },
});

// PDF Document component
const InvoicePDF = ({ data }) => {
  // Ensure data has required fields with fallbacks
  const safeData = {
    items: data?.preparedItems || [],
    orderId: data?.orderId || "N/A",
    orderDate: data?.orderDate || "N/A",
    paymentMethod: data?.paymentMethod || "N/A",
    paymentStatus: data?.paymentStatus || "N/A",
    deliveryType: data?.deliveryType || "Standard",
    deliveryStatus: data?.deliveryStatus || "N/A",
    customerName: data?.customerName || "N/A",
    address: data?.address || "N/A",
    city: data?.city || "N/A",
    country: data?.country || "N/A",
    subtotal: data?.subtotal || 0,
    discount: data?.discount || 0,
    deliveryFee: data?.deliveryFee || 0,
    total: data?.total || 0,
    mapUrl: data?.mapUrl || null,
    statusHistory: data?.statusHistory || [],
    estimatedDeliveryDate: data?.estimatedDeliveryDate || "Date not available",
    currentStatus: data?.currentStatus || {},
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerCenter}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoAsipiya}>ASIPIYA </Text>
              <Text style={styles.logoInvoice}>INVOICE</Text>
            </View>
          </View>
        </View>

        {/* Order Summary Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitleOrder}>Order</Text>
          <Text style={styles.sectionTitleSummary}> Summary</Text>
        </View>

        {/* Order Number */}
        <View style={styles.orderNumberSection}>
          <Text style={styles.orderNumberLabel}>Order : </Text>
          <Text style={styles.orderNumberValue}>#{safeData.orderId}</Text>
        </View>

        {/* Order Information Section */}
        <View style={styles.orderInfoSection}>
          <View style={styles.orderInfoLeft}>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Order Date</Text>
              <Text style={styles.infoValue}>{safeData.orderDate}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>{safeData.paymentMethod}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Payment Status</Text>
              <Text style={styles.infoValue}>{safeData.paymentStatus}</Text>
            </View>
          </View>
          <View style={styles.orderInfoRight}>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Delivery Type</Text>
              <Text style={styles.infoValue}>
                {safeData.deliveryType ? safeData.deliveryType : "Standard"}
              </Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Delivery Status</Text>
              <Text style={styles.infoValue}>{safeData.deliveryStatus}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.infoLabel}>Order Total</Text>
              <Text style={styles.infoValue}>
                LKR{" "}
                {safeData.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Address Section */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitleDelivery}>Delivery </Text>
          <Text style={styles.sectionTitleAddress}>Address</Text>
        </View>
        <View style={styles.addressSection}>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Name:</Text>
            <Text style={styles.addressValue}>{safeData.customerName}</Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Address:</Text>
            <Text style={styles.addressValue}>{safeData.address}</Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>City:</Text>
            <Text style={styles.addressValue}>{safeData.city}</Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Country:</Text>
            <Text style={styles.addressValue}>{safeData.country}</Text>
          </View>
        </View>

        {/* Order Items Section */}
        <View style={styles.itemsSection}>
          {safeData && safeData.items && safeData.items.length > 0 ? (
            safeData.items.map((item, index) => (
              <View
                key={`${item.id || index}-${item.color || ""}-${
                  item.size || ""
                }`}
                style={styles.itemCard}
              >
                {item.image ? (
                  <Image src={item.image} style={styles.itemImage} />
                ) : (
                  <View style={styles.itemImagePlaceholder}>
                    <Text style={{ fontSize: 8, color: "#9ca3af" }}>
                      No Image
                    </Text>
                  </View>
                )}

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>

                  <View style={styles.itemAttributes}>
                    {item.color && item.color !== "No color selected" && (
                      <View style={styles.attributeItem}>
                        <Text style={styles.attributeLabel}>Color:</Text>
                        <View
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: item.color },
                          ]}
                        />
                      </View>
                    )}
                    {item.size && (
                      <View style={styles.attributeItem}>
                        <Text style={styles.attributeLabel}>Size:</Text>
                        <Text style={styles.attributeValue}>{item.size}</Text>
                      </View>
                    )}
                    {item.quantity && (
                      <View style={styles.attributeItem}>
                        <Text style={styles.attributeLabel}>Qty:</Text>
                        <Text style={styles.attributeValue}>
                          {item.quantity}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {item.price && (
                  <Text style={styles.itemPrice}>
                    LKR{" "}
                    {item.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text
              style={{
                fontSize: 10,
                color: "#6b7280",
                textAlign: "center",
                padding: 20,
              }}
            >
              No item details available for this order.
            </Text>
          )}
        </View>

        {/* Pricing Summary Section */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitlePricing}>Pricing </Text>
          <Text style={styles.sectionTitleSummaryPricing}>Summary</Text>
        </View>
        <View style={styles.pricingSection}>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Subtotal:</Text>
            <Text style={styles.pricingValue}>
              LKR{" "}
              {safeData.subtotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          {safeData.discount > 0 && (
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Discount:</Text>
              <Text style={styles.pricingValue}>
                -LKR{" "}
                {safeData.discount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          )}
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Delivery Fee:</Text>
            <Text style={styles.pricingValue}>
              LKR{" "}
              {safeData.deliveryFee.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>
              LKR{" "}
              {safeData.total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {/* Order Status Section */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitleOrderStatus}>Order </Text>
          <Text style={styles.sectionTitleStatus}>Status</Text>
        </View>
        <View style={styles.statusSection}>
          {safeData.statusHistory && safeData.statusHistory.length > 0 ? (
            safeData.statusHistory.map((item, idx) => (
              <View key={idx} style={styles.statusItem}>
                <Text style={styles.statusText}>{item.status}</Text>
                <Text style={styles.statusDate}>{item.date}</Text>
                <Text style={styles.statusIcon}>✓</Text>
              </View>
            ))
          ) : (
            <View style={styles.statusItem}>
              <Text style={styles.statusText}>Order Confirmed</Text>
              <Text style={styles.statusDate}>{safeData.orderDate}</Text>
              <Text style={styles.statusIcon}>✓</Text>
            </View>
          )}

          {/* Current Status */}
          <View style={styles.currentStatusItem}>
            <Text style={styles.currentStatusText}>
              Current Status:{" "}
              {safeData.currentStatus?.delivery_status ||
                safeData.deliveryStatus}
            </Text>
            <Text style={styles.currentStatusDate}>
              {safeData.currentStatus?.delivery_date
                ? new Date(
                    safeData.currentStatus.delivery_date
                  ).toLocaleDateString()
                : "Pending"}
            </Text>
            <Text style={styles.currentStatusIcon}>●</Text>
          </View>

          {/* Estimated Delivery Details */}
          <View style={styles.estimatedDelivery}>
            <Text style={styles.estimatedDeliveryLabel}>
              Estimated Delivery:
            </Text>
            <Text style={styles.estimatedDeliveryValue}>
              {safeData.estimatedDeliveryDate
                ? safeData.estimatedDeliveryDate
                : "Date not available"}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thankYouText}>
            Thank You For Using Asipiya Services
          </Text>
          <Text style={styles.tagline}>Your Trusted Shopping Destination</Text>
        </View>
      </Page>
    </Document>
  );
};

// Invoice Download Button Component
const InvoiceDownloadButton = ({ orderData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailStatus, setEmailStatus] = useState(""); // 'success', 'error', or ''
  const [emailMessage, setEmailMessage] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    console.log(savedEmail);
    if (savedEmail) {
      setEmailAddress(savedEmail);
    }
  }, []);
  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Test PDF generation first
      const testResult = await testPDFGeneration();
      if (!testResult) {
        throw new Error("PDF generation test failed");
      }

      // Prepare data synchronously to avoid async issues
      const pdfData = {
        ...orderData,
        mapUrl: await getStaticMapBase64(
          orderData.address,
          orderData.city,
          orderData.country
        ),
        preparedItems: prepareOrderItems(orderData.orderItems), // ⬅ add this
        statusHistory:
          orderData.trackingInfo && orderData.trackingInfo.status_history
            ? orderData.trackingInfo.status_history.map((item, index) => ({
                status: item.status_to || "Status Update",
                date: item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "N/A",
              }))
            : [
                { status: "Order Confirmed", date: orderData.orderDate },
                { status: "Processing", date: "In Progress" },
                { status: "Shipped", date: "In Progress" },
                { status: "Delivered", date: "Pending" },
              ].slice(
                0,
                ["confirmed", "processing", "shipped", "delivered"].indexOf(
                  orderData.deliveryStatus?.toLowerCase()
                ) + 1 || 1
              ),
        estimatedDeliveryDate: orderData.currentStatus?.delivery_date
          ? new Date(orderData.currentStatus.delivery_date).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )
          : "Date not available",
      };

      const blob = await pdf(<InvoicePDF data={pdfData} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Order-${orderData.orderId}-Invoice.pdf`;
      link.style.display = "none";

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Failed to generate PDF. Please try again. Error: " + error.message
      );
    } finally {
      setIsGenerating(false);
    }
  };
  // Prepare order items for OrderDetails component
  const prepareOrderItems = (data) => {
    console.log(125698, data);
    if (!data) {
      return [];
    }

    return data.map((item, index) => {
      // Handle null Rate and Qty by calculating from totals
      let effectiveRate = item.Rate;
      let effectiveQty = item.Qty;

      if (!effectiveRate || !effectiveQty) {
        // If Rate or Qty is null, calculate from Total_Amount
        // Assume quantity 1 if not available and use Total_Amount as price
        effectiveQty = item.Qty || 1;
        effectiveRate = item.Total_Amount
          ? parseFloat(item.Total_Amount) / effectiveQty
          : 0;
      }

      return {
        id: item.Product_Variations_idProduct_Variations,
        productId: item.Product_Variations_idProduct_Variations,
        name: item.product_name || "Unknown Product",
        image: item.product_image || null,
        price: effectiveRate,
        quantity: effectiveQty,
        color: item.Colour,
        size: item.Size,
        marketPrice:
          item.Total && effectiveQty
            ? parseFloat(item.Total) / effectiveQty
            : effectiveRate, // Calculate market price from Total (before discount)
        total: item.Total_Amount || item.Total || 0,
      };
    });
  };
  const handleEmailShare = async () => {
    try {
      setIsGenerating(true);
      setEmailStatus("");
      setEmailMessage("");

      // Show success message immediately
      setEmailStatus("success");
      setEmailMessage("**From : Asipiya Team**");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setEmailStatus("");
        setEmailMessage("");
      }, 5000);

      // Handle email sending in the background
      const sendEmailInBackground = async () => {
        try {
          // Prepare data synchronously (same as download function)
          const pdfData = {
            ...orderData,
            mapUrl: await getStaticMapBase64(
              orderData.address,
              orderData.city,
              orderData.country
            ),
            preparedItems: prepareOrderItems(orderData.orderItems),
            statusHistory:
              orderData.trackingInfo && orderData.trackingInfo.status_history
                ? orderData.trackingInfo.status_history.map((item, index) => ({
                    status: item.status_to || "Status Update",
                    date: item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "N/A",
                  }))
                : [
                    { status: "Order Confirmed", date: orderData.orderDate },
                    { status: "Processing", date: "In Progress" },
                    { status: "Shipped", date: "In Progress" },
                    { status: "Delivered", date: "Pending" },
                  ].slice(
                    0,
                    ["confirmed", "processing", "shipped", "delivered"].indexOf(
                      orderData.deliveryStatus?.toLowerCase()
                    ) + 1 || 1
                  ),
            estimatedDeliveryDate: orderData.currentStatus?.delivery_date
              ? new Date(
                  orderData.currentStatus.delivery_date
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Date not available",
          };

          // Generate PDF blob
          const blob = await pdf(<InvoicePDF data={pdfData} />).toBlob();

          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64data = reader.result.split(",")[1]; // Remove data:application/pdf;base64, prefix

            // Send to backend API
            const response = await fetch(
              `http://localhost:9000/api/orders/${orderData.customerId}/${orderData.orderId}/send-invoice`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  emailAddress:
                    emailAddress ||
                    orderData.customerEmail ||
                    "customer@example.com",
                  pdfBase64: base64data,
                }),
              }
            );

            const result = await response.json();

            if (!response.ok) {
              console.error("Email sending failed:", result.message);
            } else {
              console.log("Email sent successfully");
            }
          };
        } catch (error) {
          console.error("Error sending email in background:", error);
        }
      };

      // Start email sending in background
      sendEmailInBackground();
    } catch (error) {
      console.error("Error sharing via email:", error);
      setEmailStatus("error");
      setEmailMessage("Failed to send invoice email: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Hide scrollbar when modal is open
  useEffect(() => {
    if (showEmailModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showEmailModal]);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="invoice-button"
      >
        <DownloadIcon className="invoice-icon" />
        <span className="invoice-text">
          {isGenerating ? "Generating PDF..." : "Download PDF"}
        </span>
      </button>

      <button
        onClick={() => handleEmailShare()}
        disabled={isGenerating}
        className="invoice-button email-button"
      >
        <EmailIcon className="invoice-icon" />
        <span className="invoice-text">
          {isGenerating ? "Sending..." : "Share via Email"}
        </span>
      </button>

      {/* Success/Error Popup */}
      {(emailStatus === "success" || emailStatus === "error") && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="text-center">
              {emailStatus === "success" ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Invoice Sent Successfully!
                  </h3>
                  <p
                    className="text-sm text-gray-600 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: emailMessage.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>"
                      ),
                    }}
                  ></p>
                </>
              ) : (
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Failed to Send Invoice
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{emailMessage}</p>
                </>
              )}
              <button
                onClick={() => {
                  setEmailStatus("");
                  setEmailMessage("");
                }}
                className="w-full bg-[#5CAF90] text-white py-2 px-4 rounded-md hover:bg-[#4a9a7d] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDownloadButton;
