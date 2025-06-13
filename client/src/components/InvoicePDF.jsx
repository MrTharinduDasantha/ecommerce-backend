import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf, Image } from '@react-pdf/renderer'
import { useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import './InvoicePDF.css'

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000000',
    margin: 10,
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: '30%',
    fontSize: 12,
    color: '#666666',
  },
  value: {
    width: '70%',
    fontSize: 12,
    color: '#333333',
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  col1: { width: '15%' },
  col2: { width: '25%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  col5: { width: '20%' },
  total: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 8,
  },
  thankYouSection: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    alignItems: 'center',
    display: 'flex',
  },
  thankYouText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4B5563',
    fontStyle: 'italic',
  },
  mapImage: {
    width: 400,
    height: 200,
    objectFit: 'cover',
    margin: '0 auto',
    marginBottom: 10,
  },
  orderDetailsSection: {
    marginTop: 32,
  },
})

// PDF Document component
const InvoicePDF = ({ data }) => (
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
          <Text style={styles.value}>{data.orderId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{data.orderDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{data.paymentMethod}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Status:</Text>
          <Text style={styles.value}>{data.paymentStatus}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Type:</Text>
          <Text style={styles.value}>{data.deliveryType ? data.deliveryType : 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Status:</Text>
          <Text style={styles.value}>{data.deliveryStatus}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>${data.subtotal.toFixed(2)}</Text>
        </View>
        {data.discount > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Discount:</Text>
            <Text style={styles.value}>-${data.discount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee:</Text>
          <Text style={styles.value}>${data.deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.value}>${data.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Delivery Address Section */}
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data.customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{data.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{data.city}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Country:</Text>
          <Text style={styles.value}>{data.country}</Text>
        </View>
      </View>

      {/* Map Image Section */}
      <Text style={styles.sectionTitle}>Delivery Location</Text>
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        {data.mapImage && (
          <Image src={data.mapImage} style={styles.mapImage} />
        )}
      </View>

      {/* Order Status Section */}
      <Text style={styles.sectionTitle}>Order Status</Text>
      <View style={styles.section}>
        {data.statusHistory && data.statusHistory.length > 0 ? (
          data.statusHistory.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={{ ...styles.label, width: '50%' }}>{item.status}</Text>
              <Text style={{ ...styles.value, width: '50%' }}>{item.date}</Text>
            </View>
          ))
        ) : (
          <Text>No status history available.</Text>
        )}
        {/* Estimated Delivery Details */}
        <View style={[styles.row, { marginTop: 10 }]}> 
          <Text style={{ ...styles.label, width: '50%', fontWeight: 'bold' }}>Estimated Delivery:</Text>
          <Text style={{ ...styles.value, width: '50%' }}>
            {data.estimatedDeliveryDate
              ? data.estimatedDeliveryDate
              : 'Date not available'}
          </Text>
        </View>
      </View>

      {/* Thank You Message */}
      <View style={styles.thankYouSection} fixed={false} wrap={false}>
        <Text style={styles.thankYouText}>
          Thanks For Using Asipiya Services
        </Text>
      </View>
    </Page>
  </Document>
)

// Invoice Download Button Component
const InvoiceDownloadButton = ({ orderData }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    try {
      setIsGenerating(true)
      const blob = await pdf(<InvoicePDF data={orderData} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Order-${orderData.orderId}-Invoice.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button 
      onClick={handleDownload}
      disabled={isGenerating}
      className="invoice-button"
    >
      <DownloadIcon className="invoice-icon" />
      <span className="invoice-text">
        {isGenerating ? 'Generating PDF...' : 'Download PDF'}
      </span>
    </button>
  )
}

export default InvoiceDownloadButton;