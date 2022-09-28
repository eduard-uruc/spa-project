import { useState, useEffect } from "react";
import { TableRow } from "./TableRow";
import "./App.css";

function App() {
  const [collection, setCollection] = useState(["A", "B", "C", "D", "E"]);
  const [newCollection, setNewCollection] = useState([]);

  const handleKeyUp = (e) => {
    fetchData(e.target.value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (newCollection.length) {
        updateCollection();
      } else {
        setCollection(collection.slice(1).concat(collection[0]));
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  const fetchData = async (key) => {
    const data = await fetch(`https://itunes.apple.com/search?term=${key}`);
    const text = await data.text();
    const json = await JSON.parse(text);
    const result = json.results;

    const sortedArray = result.sort((a, b) =>
      a ? a.collectionName.localeCompare(b.collectionName) : 0
    );

    const filteredItems = sortedArray.slice(0, 5);

    const collectionNames = filteredItems.map((item) => {
      return item.collectionName;
    });

    setNewCollection(collectionNames);
  };

  const updateCollection = () => {
    setCollection((prevState) => [...prevState.slice(1), newCollection[0]]);
    setNewCollection((prevState) => prevState.slice(1));
  };

  return (
    <div className="App">
      <input
        onKeyUp={handleKeyUp}
        placeholder="Search Band"
        style={{ marginBottom: "0.5em" }}
      />

      <table border="1" style={{ marginLeft: "auto", marginRight: "auto" }}>
        <tbody>
          {collection.map((val, i) => (
            <TableRow key={i} item={val} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
