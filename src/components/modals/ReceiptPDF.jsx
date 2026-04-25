import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Definimos los estilos para el PDF (Estilo Studio Slate)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 20,
  },
  brand: {
    fontSize: 24,
    fontWeight: 'black',
    color: '#0F172A',
  },
  brandTeal: {
    color: '#0D9488',
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoBox: {
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 8,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    paddingVertical: 12,
    alignItems: 'center',
  },
  colDesc: { flex: 3, fontSize: 10, color: '#1E293B' },
  colQty: { flex: 1, fontSize: 10, textAlign: 'center', color: '#1E293B' },
  colPrice: { flex: 1, fontSize: 10, textAlign: 'right', color: '#1E293B' },
  totalSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalBox: {
    width: 150,
    borderTopWidth: 2,
    borderTopColor: '#0D9488',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 20,
  }
});

export default function ReceiptPDF({ order }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con Logo */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>A<Text style={styles.brandTeal}>&</Text>B</Text>
            <Text style={{ fontSize: 8, color: '#64748B', letterSpacing: 3, textTransform: 'uppercase' }}>Studio</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={styles.title}>Boleta de Venta</Text>
            <Text style={{ fontSize: 9, color: '#94A3B8', marginTop: 4 }}>Digital Receipt</Text>
          </View>
        </View>

        {/* Info del Pedido */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.label}>ID Pedido</Text>
            <Text style={styles.value}>#{order.id.toUpperCase()}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Fecha de Emisión</Text>
            <Text style={styles.value}>{new Date(order.created_at).toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Estado</Text>
            <Text style={styles.value}>Pagado</Text>
          </View>
        </View>

        {/* Tabla de Contenido */}
        <View style={styles.tableHeader}>
          <Text style={[styles.label, { flex: 3, paddingLeft: 10 }]}>Descripción del Recurso</Text>
          <Text style={[styles.label, { flex: 1, textAlign: 'center' }]}>Cant.</Text>
          <Text style={[styles.label, { flex: 1, textAlign: 'right', paddingRight: 10 }]}>Precio</Text>
        </View>

        {order.order_items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.colDesc, { paddingLeft: 10 }]}>{item.products.name}</Text>
            <Text style={styles.colQty}>x{item.quantity}</Text>
            <Text style={[styles.colPrice, { paddingRight: 10 }]}>
              ${(item.price_at_purchase * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Resumen Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Final</Text>
            <Text style={styles.totalValue}>${order.total_amount.toFixed(2)} USD</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gracias por confiar en A&B Studio. Este documento es un comprobante de tu compra.</Text>
          <Text style={{ marginTop: 4 }}>www.aybstudio.dev</Text>
        </View>
      </Page>
    </Document>
  );
}