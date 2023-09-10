import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: "center",
            alignItems: "center",
            padding: 15,
            borderWidth: 20,
            borderRadius: 8,
            backgroundColor: selections[index] ? "#EE9" : "#495E57",
            marginHorizontal: 4,
            borderWidth: 1,
            borderColor: "white",
          }}
        >
          <View>
            <Text style={{ color: selections[index] ? "black" : "white" }}>
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#364A44",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: "0%",
    paddingBottom: "0%",

    alignItems: "center",
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 0,
  },
});

export default Filters;
