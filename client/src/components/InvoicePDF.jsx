import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  pdf,
  Image,
} from "@react-pdf/renderer"
import { useEffect, useState } from "react"
import DownloadIcon from "@mui/icons-material/Download"
import EmailIcon from "@mui/icons-material/Email"
import "./InvoicePDF.css"

// Function to generate map URL for PDF
// const generateMapUrl = (address, city, country) => {
//   if (!address || !city || !country) return null;

//   try {
//     // Clean and encode the address components
//     const cleanAddress = address.trim().replace(/\s+/g, ' ');
//     const cleanCity = city.trim();
//     const cleanCountry = country.trim();

//     const fullAddress = encodeURIComponent(`${cleanAddress}, ${cleanCity}, ${cleanCountry}`);

//     // Try multiple map services for better reliability
//     const mapServices = [
//       // Primary: OpenStreetMap static image service
//       `https://staticmap.openstreetmap.de/staticmap.php?center=${fullAddress}&zoom=13&size=400x200&markers=${fullAddress},red&format=png`,
//       // Fallback: Alternative OpenStreetMap service
//       `https://maps.googleapis.com/maps/api/staticmap?center=${fullAddress}&zoom=13&size=400x200&maptype=roadmap&markers=color:red%7C${fullAddress}`,
//       // Secondary fallback: City-level map
//       `https://staticmap.openstreetmap.de/staticmap.php?center=${cleanCity},${cleanCountry}&zoom=10&size=400x200&markers=${cleanCity},${cleanCountry},red&format=png`
//     ];

//     const mapUrl = mapServices[0]; // Use the first (most reliable) option
//     console.log('Generated map URL:', mapUrl);
//     return mapUrl;
//   } catch (error) {
//     console.error('Error generating map URL:', error);
//     return null;
//   }
// };

const sanitizeAddress = (value = "") =>
  value.replace(/[/.]/g, " ").replace(/\s+/g, " ").trim()

// const getStaticMapBase64 = async (address, city, country) => {
//   const cleanAddress = sanitizeAddress(address);
//   const cleanCity = sanitizeAddress(city);
//   const cleanCountry = sanitizeAddress(country);

//   const fullAddress = encodeURIComponent(`${cleanAddress}, ${cleanCity}, ${cleanCountry}`);
//   const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${fullAddress}&zoom=13&size=400x200&markers=${fullAddress},red&format=png`;

//   console.log("Final map URL:", mapUrl);

//   try {
//     const response = await fetch(mapUrl);
//     const blob = await response.blob();

//     // Ensure it's actually an image
//     if (!blob.type.startsWith("image")) {
//       console.warn("Fetched content is not an image:", blob.type);
//       return null;
//     }

//     return await new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result); // data:image/png;base64,...
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error("Error fetching map image:", error);
//     return null;
//   }
// };

const getStaticMapBase64 = async (address, city, country) => {
  try {
    const cleanAddress = sanitizeAddress(address)
    const cleanCity = sanitizeAddress(city)
    const cleanCountry = sanitizeAddress(country)

    const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY
    const searchQuery = encodeURIComponent(
      `${cleanAddress}, ${cleanCity}, ${cleanCountry}`
    )
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${searchQuery}&apiKey=${GEOAPIFY_API_KEY}`

    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()

    if (
      !geocodeResponse.ok ||
      !geocodeData.features ||
      geocodeData.features.length === 0
    ) {
      console.warn("Geocoding failed, using fallback UI")
      return null
    }
    const coordinates = geocodeData.features[0].geometry.coordinates
    const lon = coordinates[0]
    const lat = coordinates[1]

    const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=400&height=200&center=lonlat:${lon},${lat}&zoom=15&apiKey=${GEOAPIFY_API_KEY}&marker=lonlat:${lon},${lat};type:material;color:%23ff3421`

    console.log(`Map URL generated: ${mapUrl}`)

    const response = await fetch(mapUrl)

    if (!response.ok) {
      console.warn(`Map service returned status: ${response.status}`)
      return null
    }

    const blob = await response.blob()

    if (!blob.type.startsWith("image")) {
      console.warn("Fetched content is not an image:", blob.type)
      return null
    }

    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Error fetching map image:", error)
    return null
  }
}

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
  }
}

// Function to validate map URL
const validateMapUrl = async url => {
  if (!url) return false

  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.error("Map URL validation failed:", error)
    return false
  }
}

// Test function to verify map URL generation
const testMapUrlGeneration = (address, city, country) => {
  console.log("Testing map URL generation with:", { address, city, country })
  const mapUrl = generateMapUrl(address, city, country)
  console.log("Generated map URL:", mapUrl)

  if (mapUrl) {
    // Create a test image element to check if the URL loads
    const testImg = new Image()
    testImg.onload = () => {
      console.log("✅ Map URL loads successfully")
    }
    testImg.onerror = () => {
      console.log("❌ Map URL failed to load")
    }
    testImg.src = mapUrl
  }

  return mapUrl
}

// Test function to verify PDF generation
const testPDFGeneration = async () => {
  try {
    console.log("Testing PDF generation with minimal data...")
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
    }

    const blob = await pdf(<InvoicePDF data={testData} />).toBlob()
    return true
  } catch (error) {
    console.error("❌ PDF generation test failed:", error)
    return false
  }
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000000",
    margin: 10,
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "flex-start",
    position: "relative",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    color: "#1a1a1a",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    color: "#666666",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333333",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 3,
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: "30%",
    fontSize: 12,
    color: "#666666",
  },
  value: {
    width: "70%",
    fontSize: 12,
    color: "#333333",
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 6,
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  col1: { width: "15%" },
  col2: { width: "25%" },
  col3: { width: "20%" },
  col4: { width: "20%" },
  col5: { width: "20%" },
  total: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    fontSize: 14,
    fontWeight: "bold",
    paddingRight: 8,
  },
  thankYouSection: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
    alignItems: "center",
    display: "flex",
    marginTop: "50px !important",
  },
  thankYouText: {
    fontSize: 14,
    textAlign: "center",
    color: "#4B5563",
    fontStyle: "italic",
  },
  mapImage: {
    width: 400,
    height: 200,
    objectFit: "cover",
    margin: "0 auto",
    marginBottom: 10,
  },
  orderDetailsSection: {
    marginTop: 32,
  },
  statusItem: {
    flexDirection: "row",
    marginBottom: 4,
    padding: 4,
    backgroundColor: "#f9f9f9",
  },
  statusText: {
    fontSize: 11,
    color: "#333333",
    flex: 1,
  },
  statusDate: {
    fontSize: 10,
    color: "#666666",
    width: "30%",
  },
  statusCompleted: {
    fontSize: 10,
    color: "#5CAF90",
    fontWeight: "bold",
    width: "15%",
  },
})

// PDF Document component
const InvoicePDF = ({ data }) => {
  // Ensure data has required fields with fallbacks
  const safeData = {
    orderId: data?.orderId || "N/A",
    orderDate: data?.orderDate || "N/A",
    paymentMethod: data?.paymentMethod || "N/A",
    paymentStatus: data?.paymentStatus || "N/A",
    deliveryType: data?.deliveryType || "N/A",
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
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Main Invoice Title */}
        <Text style={styles.title}>Asipiya Order Invoice</Text>
        {/* Order Details Section */}
        <View style={styles.orderDetailsSection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Order #:</Text>
            <Text style={styles.value}>{safeData.orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{safeData.orderDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>{safeData.paymentMethod}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.value}>{safeData.paymentStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Type:</Text>
            <Text style={styles.value}>
              {safeData.deliveryType ? safeData.deliveryType : "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Status:</Text>
            <Text style={styles.value}>{safeData.deliveryStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.value}>${safeData.subtotal.toFixed(2)}</Text>
          </View>
          {safeData.discount > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Discount:</Text>
              <Text style={styles.value}>-${safeData.discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Fee:</Text>
            <Text style={styles.value}>${safeData.deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.value}>${safeData.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Delivery Address Section */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{safeData.customerName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{safeData.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{safeData.city}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Country:</Text>
            <Text style={styles.value}>{safeData.country}</Text>
          </View>
        </View>

        {/* Map Image Section */}
        <Text style={styles.sectionTitle}>Delivery Location</Text>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          {safeData.mapUrl ? (
            <View style={{ position: "relative" }}>
              <Image
                src={safeData.mapUrl}
                style={styles.mapImage}
                cache={false}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: "2px 6px",
                  borderRadius: 3,
                }}
              >
                <Text style={{ fontSize: 8, color: "#ffffff" }}>
                  📍 {safeData.address}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                width: 400,
                height: 200,
                backgroundColor: "#f8f9fa",
                border: "2px solid #5CAF90",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#5CAF90",
                  marginBottom: 12,
                  fontWeight: "bold",
                }}
              >
                📍 Delivery Location
              </Text>
              <View
                style={{
                  backgroundColor: "#ffffff",
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #e0e0e0",
                  width: "100%",
                  maxWidth: 350,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#333333",
                    fontWeight: "bold",
                    marginBottom: 4,
                  }}
                >
                  Customer Address:
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: "#666666",
                    lineHeight: 1.4,
                    textAlign: "center",
                  }}
                >
                  {safeData.address}
                  {"\n"}
                  {safeData.city}, {safeData.country}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 9,
                  color: "#999999",
                  marginTop: 8,
                  fontStyle: "italic",
                }}
              >
                Interactive map view not available
              </Text>
            </View>
          )}
        </View>

        {/* Order Status Section */}
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.section}>
          {safeData.statusHistory && safeData.statusHistory.length > 0 ? (
            safeData.statusHistory.map((item, idx) => (
              <View key={idx} style={styles.statusItem}>
                <Text style={styles.statusText}>{item.status}</Text>
                <Text style={styles.statusDate}>{item.date}</Text>
                <Text style={styles.statusCompleted}>✓</Text>
              </View>
            ))
          ) : (
            <View style={styles.statusItem}>
              <Text style={styles.statusText}>Order Confirmed</Text>
              <Text style={styles.statusDate}>{safeData.orderDate}</Text>
              <Text style={styles.statusCompleted}>✓</Text>
            </View>
          )}

          {/* Current Status */}
          <View
            style={[
              styles.statusItem,
              { backgroundColor: "#e8f5e8", marginTop: 8 },
            ]}
          >
            <Text style={[styles.statusText, { fontWeight: "bold" }]}>
              Current Status:{" "}
              {safeData.currentStatus?.delivery_status ||
                safeData.deliveryStatus}
            </Text>
            <Text style={styles.statusDate}>
              {safeData.currentStatus?.delivery_date
                ? new Date(
                    safeData.currentStatus.delivery_date
                  ).toLocaleDateString()
                : "Pending"}
            </Text>
            <Text style={styles.statusCompleted}>Active</Text>
          </View>

          {/* Estimated Delivery Details */}
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={{ ...styles.label, width: "50%", fontWeight: "bold" }}>
              Estimated Delivery:
            </Text>
            <Text style={{ ...styles.value, width: "50%" }}>
              {safeData.estimatedDeliveryDate
                ? safeData.estimatedDeliveryDate
                : "Date not available"}
            </Text>
          </View>
        </View>
        {/* Thank You Message */}
        <Text style={styles.thankYouText}>
          Thanks For Using Asipiya Services
        </Text>
      </Page>
    </Document>
  )
}

// Invoice Download Button Component
const InvoiceDownloadButton = ({ orderData }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [emailStatus, setEmailStatus] = useState("") // 'success', 'error', or ''
  const [emailMessage, setEmailMessage] = useState("")

  const handleDownload = async () => {
    try {
      setIsGenerating(true)

      // Test PDF generation first
      const testResult = await testPDFGeneration()
      if (!testResult) {
        throw new Error("PDF generation test failed")
      }

      // Prepare data synchronously to avoid async issues
      const pdfData = {
        ...orderData,
        mapUrl: await getStaticMapBase64(
          orderData.address,
          orderData.city,
          orderData.country
        ),
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
      }

      const blob = await pdf(<InvoicePDF data={pdfData} />).toBlob()

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Order-${orderData.orderId}-Invoice.pdf`
      link.style.display = "none"

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again. Error: " + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEmailShare = async () => {
    try {
      setIsGenerating(true)
      setEmailStatus("")
      setEmailMessage("")

      // Prepare data synchronously (same as download function)
      const pdfData = {
        ...orderData,
        mapUrl: await getStaticMapBase64(
          orderData.address,
          orderData.city,
          orderData.country
        ),
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
      }

      // Generate PDF blob
      const blob = await pdf(<InvoicePDF data={pdfData} />).toBlob()

      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = async () => {
        const base64data = reader.result.split(",")[1] // Remove data:application/pdf;base64, prefix

        // Send to backend API
        const response = await fetch(
          `http://localhost:9000/api/orders/${orderData.customerId}/${orderData.orderId}/send-invoice`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication token
            },
            body: JSON.stringify({
              emailAddress: emailAddress,
              pdfBase64: base64data,
            }),
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to send invoice email")
        }

        // Show success message
        setEmailStatus("success")
        setEmailMessage(`Invoice sent successfully to ${emailAddress}`)

        // Clear form after 3 seconds
        setTimeout(() => {
          setShowEmailModal(false)
          setEmailAddress("")
          setEmailStatus("")
          setEmailMessage("")
        }, 3000)
      }
    } catch (error) {
      console.error("Error sharing via email:", error)
      setEmailStatus("error")
      setEmailMessage("Failed to send invoice email: " + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  // Hide scrollbar when modal is open
  useEffect(() => {
    if (showEmailModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [showEmailModal])

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
        onClick={() => setShowEmailModal(true)}
        disabled={isGenerating}
        className="invoice-button email-button"
      >
        <EmailIcon className="invoice-icon" />
        <span className="invoice-text">Share via Email</span>
      </button>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Share Invoice via Email
            </h3>

            {/* Status Messages */}
            {emailStatus === "success" && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {emailMessage}
              </div>
            )}

            {emailStatus === "error" && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {emailMessage}
              </div>
            )}

            <p className="text-gray-600 mb-4">
              Enter the email address where you'd like to send the invoice:
            </p>
            <input
              type="email"
              value={emailAddress}
              onChange={e => setEmailAddress(e.target.value)}
              placeholder="Enter email address"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              disabled={emailStatus === "success"}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEmailShare}
                disabled={
                  !emailAddress || isGenerating || emailStatus === "success"
                }
                className="flex-1 bg-[#5CAF90] text-white py-2 px-4 rounded hover:bg-[#4a9a7d] disabled:bg-gray-300"
              >
                {isGenerating
                  ? "Sending..."
                  : emailStatus === "success"
                  ? "Sent!"
                  : "Send Email"}
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setEmailAddress("")
                  setEmailStatus("")
                  setEmailMessage("")
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                {emailStatus === "success" ? "Close" : "Cancel"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: The PDF will be sent as an attachment to the specified email
              address.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceDownloadButton
