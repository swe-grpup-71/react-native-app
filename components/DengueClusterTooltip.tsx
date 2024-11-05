import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface DengueClusterData {
  LOCALITY: string;
  CASE_SIZE: string;
  NAME: string;
  HYPERLINK: string;
  HOMES: string;
  PUBLIC_PLACES: string;
  CONSTRUCTION_SITES: string;
  INC_CRC: string;
  FMEL_UPD_D: string;
}

interface TooltipProps {
  data: DengueClusterData;
}

const DengueClusterTooltip: React.FC<TooltipProps> = ({ data }) => {
  // Function to format the date string
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Convert "20230829152402" to "29 Aug 2023, 15:24:02"
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);

    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Function to render a row of information
  const InfoRow = ({ label, value }: { label: string; value: string }) => {
    if (!value) return null; // Don't render empty rows

    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tooltip}>
        <View style={styles.header}>
          <Text style={styles.title}>{data.NAME}</Text>
          <Text style={styles.caseSize}>Cases: {data.CASE_SIZE}</Text>
        </View>

        <ScrollView style={styles.scrollContent}>
          <InfoRow label="Location" value={data.LOCALITY} />
          {data.HOMES && <InfoRow label="Homes" value={data.HOMES} />}
          {data.PUBLIC_PLACES && (
            <InfoRow label="Public Places" value={data.PUBLIC_PLACES} />
          )}
          {data.CONSTRUCTION_SITES && (
            <InfoRow
              label="Construction Sites"
              value={data.CONSTRUCTION_SITES}
            />
          )}
          <InfoRow label="Last Updated" value={formatDate(data.FMEL_UPD_D)} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  tooltip: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: 300,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  caseSize: {
    fontSize: 14,
    color: "#E63946",
    fontWeight: "600",
    marginTop: 4,
  },
  scrollContent: {
    maxHeight: 300,
  },
  row: {
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#333",
  },
});

export default DengueClusterTooltip;
