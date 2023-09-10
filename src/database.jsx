import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);"
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    menuItems.forEach((ele) => {
      const query =
        "INSERT INTO menuitems (id, uuid, title, price, category) VALUES (?, ?, ?, ?, ?)";
      tx.executeSql(
        query,
        [ele?.id, ele?.id, ele?.title, ele?.price, ele?.category?.title],
        (_, { rows }) => {
                   console.log('inserted', JSON.stringify({ ...ele }));
                   



        },
        (err) => {
          console.log(err);
          
        }
      );
    });

  });
}


export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const result = [];
      let qStr = "?";
      activeCategories.forEach((ele) => {
        qStr += ", ?";
      });
      tx.executeSql(
        "select * from menuitems where category IN (" + qStr + ")",
        [...activeCategories],
        (_, { rows }) => {
          rows._array.forEach((ele) => {
            if (ele.title.toLowerCase().includes(query.toLowerCase())) {
              result.push(ele);
            }
          });
          resolve(result);
        }
      );
    });
  });
}
