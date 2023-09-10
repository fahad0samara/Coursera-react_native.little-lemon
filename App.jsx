import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "./src/database";
import Filters from "./src/components/Filters";
import { getSectionListData, useUpdateEffect } from "./src/utils";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu-items-by-category.json";
const sections = ["Appetizers", "Salads", "Beverages"];

const Item = ({ title, price }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.title}>${price}</Text>
  </View>
);

export default function App() {
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  const fetchData = async () => {

    let data = [];
    try {
      const jsonData = await fetch(API_URL);
      data = await jsonData?.json();
    } catch (err) {
      console.log(err);
      alert("Error fetching menu items");
    }

    return [...data?.menu];
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
        }

        if (!menuItems.length) {
          menuItems = await getMenuItems();
        }

        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        // Handle error
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="
        Search for menu items
        "
        placeholderTextColor="white"
        onChangeText={handleSearchChange}
        value={searchBarText}
        style={styles.searchBar}
        inputStyle={{ color: "white" }}
              onClear={() => {
                  setSearchBarText("");
                  setQuery("");
              }}

               iconColor="white"
   

      />
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <SectionList
        style={styles.sectionList}
        sections={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item title={item.title} price={item.price} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#495E57",
  },
  sectionList: {
    paddingHorizontal: 14,
  },
  searchBar: {
    backgroundColor: "#364A44",
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 14,
    elevation: 0,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#364A44",
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  header: {
    color: "#FBDABB",
    backgroundColor: "#495E57",
    fontSize: 20,
    fontWeight: "bold",
    padding: 18,
    marginVertical: 8,
  },
  title: {
    color: "#FFF",

    fontSize: 16,
    fontWeight: "normal",
  },
});
