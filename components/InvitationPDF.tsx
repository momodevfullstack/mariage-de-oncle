import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Enregistrement d'une police plus élégante si nécessaire
Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v21/nuFvD7K8cnEiHejo2VvclUXWPMcv-y7f67M.ttf'
});

const styles = StyleSheet.create({
  page: { backgroundColor: '#FDFBF9', padding: 40, fontFamily: 'Times-Roman' },
  container: { border: '1pt solid #EBE8E3', height: '100%', padding: 20 },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 24, marginBottom: 10, color: '#2C2C2C' },
  subtitle: { fontSize: 10, letterSpacing: 2, color: '#A69382', textTransform: 'uppercase' },
  section: { marginVertical: 15, borderBottom: '0.5pt solid #EBE8E3', paddingBottom: 10 },
  label: { fontSize: 8, color: '#A69382', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 16, color: '#2C2C2C' },
  qrCode: { width: 80, height: 80, marginTop: 20, alignSelf: 'center' },
  footer: { marginTop: 30, textAlign: 'center', fontSize: 9, color: '#A69382' }
});

export const InvitationPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A5" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>The Marriage Of</Text>
          <Text style={styles.title}>Guy-Morel & Olive</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Invité(e)</Text>
          <Text style={styles.value}>{data.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Accompagnement</Text>
          <Text style={styles.value}>{data.plusOne ? 'Valable pour 2 personnes' : 'Invitation Personnelle'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date & Lieu</Text>
          <Text style={styles.value}>13 Février 2026 • Abidjan</Text>
          <Text style={{ fontSize: 10, marginTop: 5 }}>Résidence Hôtel HELMA, Angré château</Text>
        </View>

        {/* QR Code dynamique */}
        <Image 
          style={styles.qrCode} 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.id}`} 
        />
        
        <Text style={styles.footer}>Ticket ID: {data.id}</Text>
      </View>
    </Page>
  </Document>
);