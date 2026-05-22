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
  invoiceNumber?: string // Add optional invoice number
  advancePayment?: number
  balanceDue?: number
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
    opacity: 0.05,
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
  logoSection: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logo: {
    width: 100,
    height: 60,
    marginRight: 15,
    marginBottom: 8,
  },
  companyInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: 200,
  },
  companyInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  companyInfoIcon: {
    fontSize: 10,
    color: "#4A5568",
    marginRight: 6,
    width: 12,
    textAlign: "center",
  },
  companyInfoText: {
    fontSize: 9,
    color: "#4A5568",
    lineHeight: 1.3,
  },
  invoiceSection: {
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
    color: "#000000",
    backgroundColor: "#a68033",
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
    color: "#000000",
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
  const totalVal = typeof data?.total === "number" ? data.total : 0
  return {
    customerName: data?.customerName || "Customer Name",
    date: data?.date || new Date(),
    items: Array.isArray(data?.items) ? data.items.filter((item) => item && typeof item === "object") : [],
    discount: typeof data?.discount === "number" ? data.discount : 0,
    subtotal: typeof data?.subtotal === "number" ? data.subtotal : 0,
    discountAmount: typeof data?.discountAmount === "number" ? data.discountAmount : 0,
    total: totalVal,
    invoiceNumber: data?.invoiceNumber || "INV-0001",
    advancePayment: typeof data?.advancePayment === "number" ? data.advancePayment : 0,
    balanceDue: typeof data?.balanceDue === "number" ? data.balanceDue : totalVal,
  }
}

// Create PDF Document
export const InvoicePDF = ({ data }: { data: InvoiceData }) => {
  const validatedData = validateInvoiceData(data)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Image style={styles.watermark} src="/images/coverimage.png" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image style={styles.logo} src="/images/logo.png" />
            <View style={styles.companyInfo}>
              <View style={styles.companyInfoRow}>
                <Text style={styles.companyInfoIcon}></Text>
                <Text style={styles.companyInfoText}>Chelari, Kerala. 676317</Text>
              </View>

              <View style={styles.companyInfoRow}>
                <Text style={styles.companyInfoIcon}></Text>
                <Text style={styles.companyInfoText}>+91 8589907591</Text>
              </View>

              <View style={styles.companyInfoRow}>
                <Text style={styles.companyInfoIcon}></Text>
                <Text style={styles.companyInfoText}>www.madeproducts.in</Text>
              </View>
            </View>
          </View>
          <View style={styles.invoiceSection}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtitle}>Invoice no :</Text>
            <Text style={styles.invoiceNumber}>{validatedData.invoiceNumber}</Text>
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
                <Text style={[styles.tableText, styles.tableColRate]}>{RS(item?.rate || 0)}</Text>
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
            {validatedData.discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount ({validatedData.discount}%)</Text>
                <Text style={styles.summaryValue}>- {RS(validatedData.discountAmount)}</Text>
              </View>
            )}
            <View style={validatedData.advancePayment > 0 ? styles.summaryRow : styles.totalRow}>
              <Text style={validatedData.advancePayment > 0 ? styles.summaryLabel : styles.totalLabel}>Total Amount</Text>
              <Text style={validatedData.advancePayment > 0 ? styles.summaryValue : styles.totalValue}>{RS(validatedData.total)}</Text>
            </View>
            {validatedData.advancePayment > 0 && (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Advance Paid</Text>
                  <Text style={styles.summaryValue}>- {RS(validatedData.advancePayment)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Balance Due</Text>
                  <Text style={styles.totalValue}>{RS(validatedData.balanceDue)}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>Thank you for your Purchase!</Text>
          <Text style={styles.footerText}>This is a computer-generated invoice and does not require a signature.</Text>
          <Text style={styles.footerText}>
            For any queries, please contact us at www.madeproducts.in | +91 8589907591
          </Text>
        </View>
      </Page>
    </Document>
  )
}
