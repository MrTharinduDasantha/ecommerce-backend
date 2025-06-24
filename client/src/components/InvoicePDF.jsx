import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf, Image } from '@react-pdf/renderer'
import { useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import EmailIcon from '@mui/icons-material/Email'
import './InvoicePDF.css'
import axios from "axios";

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
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [emailStatus, setEmailStatus] = useState('') // 'success', 'error', or ''
  const [emailMessage, setEmailMessage] = useState('')

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

  const handleEmailShare = async () => {
    try {
      setIsGenerating(true)
      setEmailStatus('')
      setEmailMessage('')
      
      // Generate PDF blob
      const blob = await pdf(<InvoicePDF data={orderData} />).toBlob()
      
      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1] // Remove data:application/pdf;base64, prefix
        
        // Send to backend API
        const response = await fetch(`http://localhost:9000/api/orders/${orderData.customerId}/${orderData.orderId}/send-invoice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add authentication token
          },
          body: JSON.stringify({
            emailAddress: emailAddress,
            pdfBase64: base64data
          })
        })
        
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to send invoice email')
        }
        
        // Show success message
        setEmailStatus('success')
        setEmailMessage(`Invoice sent successfully to ${emailAddress}`)
        
        // Clear form after 3 seconds
        setTimeout(() => {
          setShowEmailModal(false)
          setEmailAddress('')
          setEmailStatus('')
          setEmailMessage('')
        }, 3000)
      }
      
    } catch (error) {
      console.error('Error sharing via email:', error)
      setEmailStatus('error')
      setEmailMessage('Failed to send invoice email: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
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
      
      <button 
        onClick={() => setShowEmailModal(true)}
        disabled={isGenerating}
        className="invoice-button email-button"
      >
        <EmailIcon className="invoice-icon" />
        <span className="invoice-text">
          Share via Email
        </span>
      </button>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share Invoice via Email</h3>
            
            {/* Status Messages */}
            {emailStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {emailMessage}
              </div>
            )}
            
            {emailStatus === 'error' && (
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
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Enter email address"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              disabled={emailStatus === 'success'}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEmailShare}
                disabled={!emailAddress || isGenerating || emailStatus === 'success'}
                className="flex-1 bg-[#5CAF90] text-white py-2 px-4 rounded hover:bg-[#4a9a7d] disabled:bg-gray-300"
              >
                {isGenerating ? 'Sending...' : emailStatus === 'success' ? 'Sent!' : 'Send Email'}
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setEmailAddress('')
                  setEmailStatus('')
                  setEmailMessage('')
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                {emailStatus === 'success' ? 'Close' : 'Cancel'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: The PDF will be sent as an attachment to the specified email address.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceDownloadButton;