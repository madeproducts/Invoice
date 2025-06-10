import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import { format } from "date-fns"


// Format RS in Indian Rupees
  const RS = (amount: number) => {
  return 'Rs. ' + amount.toFixed(2); // manually prefix
}

// Define types
interface OrderItem {
  id: string
  name: string
  quantity: number
  rate: number
}

interface InvoiceData {
  customerName: string
  date: Date
  items: OrderItem[]
  discount: number
  subtotal: number
  discountAmount: number
  total: number
}

// Create enhanced styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
    position: "relative",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    opacity: 0.005,
    width: 300,
    height: 300,
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    borderBottom: "2 solid #2D3748",
    paddingBottom: 20,
  },
  logo: {
    width: 82,
    height: 90,
  },
  companyInfo: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#4A5568",
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E53E3E",
    backgroundColor: "#FED7D7",
    padding: "5 10",
    borderRadius: 3,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    backgroundColor: "#F7FAFC",
    padding: 20,
    borderRadius: 5,
  },
  infoColumn: {
    flexDirection: "column",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: "#718096",
    marginBottom: 3,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 12,
    color: "#2D3748",
    marginBottom: 8,
  },
  table: {
    flexDirection: "column",
    marginBottom: 30,
    border: "1 solid #E2E8F0",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2D3748",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E2E8F0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "1 solid #E2E8F0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#F8F9FA",
  },
  tableText: {
    fontSize: 10,
    color: "#2D3748",
  },
  tableColName: {
    flex: 3,
    paddingRight: 10,
  },
  tableColQty: {
    flex: 1,
    textAlign: "center",
  },
  tableColRate: {
    flex: 1.5,
    textAlign: "right",
    paddingRight: 10,
  },
  tableColTotal: {
    flex: 1.5,
    textAlign: "right",
    fontWeight: "bold",
  },
  summarySection: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 20,
  },
  summaryContainer: {
    width: 250,
    backgroundColor: "#F7FAFC",
    padding: 20,
    borderRadius: 5,
    border: "1 solid #E2E8F0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#4A5568",
  },
  summaryValue: {
    fontSize: 11,
    color: "#2D3748",
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTop: "2 solid #2D3748",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2D3748",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E53E3E",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "column",
    alignItems: "center",
    borderTop: "1 solid #E2E8F0",
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: "#718096",
    textAlign: "center",
    marginBottom: 5,
  },
  thankYou: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 10,
  },
})



// Validate and sanitize invoice data
const validateInvoiceData = (data: InvoiceData) => {
  return {
    customerName: data?.customerName || "Customer Name",
    date: data?.date || new Date(),
    items: Array.isArray(data?.items) ? data.items.filter((item) => item && typeof item === "object") : [],
    discount: typeof data?.discount === "number" ? data.discount : 0,
    subtotal: typeof data?.subtotal === "number" ? data.subtotal : 0,
    discountAmount: typeof data?.discountAmount === "number" ? data.discountAmount : 0,
    total: typeof data?.total === "number" ? data.total : 0,
  }
}

// Create PDF Document
export const InvoicePDF = ({ data }: { data: InvoiceData }) => {
  const validatedData = validateInvoiceData(data)
  const invoiceNumber = `INV-${format(validatedData.date, "yyyyMMdd")}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Image style={styles.watermark} src="/madelogo.png" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Image style={styles.logo} src="/madelogo.png" />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtitle}>Invoice no :</Text>
            <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
          </View>
        </View>

        {/* Invoice Information */}
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.infoLabel}>Customer Name</Text>
            <Text style={styles.infoValue}>{validatedData.customerName}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <Text style={styles.infoLabel}>Invoice Date</Text>
            <Text style={styles.infoValue}>{format(validatedData.date, "dd MMMM yyyy")}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.tableColName]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.tableColQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.tableColRate]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.tableColTotal]}>Amount</Text>
          </View>

          {validatedData.items.length > 0 ? (
            validatedData.items.map((item, index) => (
              <View key={item?.id || index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableText, styles.tableColName]}>{item?.name || "Unnamed Item"}</Text>
                <Text style={[styles.tableText, styles.tableColQty]}>{item?.quantity || 0}</Text>
                <Text style={[styles.tableText, styles.tableColRate]}>{(item?.rate || 0)}</Text>
                <Text style={[styles.tableText, styles.tableColTotal]}>
                  {RS((item?.quantity || 0) * (item?.rate || 0))}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableText, styles.tableColName]}>No items</Text>
              <Text style={[styles.tableText, styles.tableColQty]}>0</Text>
              <Text style={[styles.tableText, styles.tableColRate]}>₹0.00</Text>
              <Text style={[styles.tableText, styles.tableColTotal]}>₹0.00</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{RS(validatedData.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount ({validatedData.discount}%)</Text>
              <Text style={styles.summaryValue}>- {RS(validatedData.discountAmount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{RS(validatedData.total)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>Thank you for your order!</Text>
          <Text style={styles.footerText}>This is a computer-generated invoice and does not require a signature.</Text>
          <Text style={styles.footerText}>
            For any queries, please contact us at www.madeproducts.in | +91 85899 07591
          </Text>
        </View>
      </Page>
    </Document>
  )
}
