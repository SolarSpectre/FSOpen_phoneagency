import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personAPI from "./services/personAPI";
import Notification from "./components/notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const data = await personAPI.getAll();
        setPersons(data);
      } catch (error) {
        console.error("Failed to fetch persons:", error);
        alert("Failed to fetch persons. Please try again.");
      }
    };
    fetchPersons();
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const addPerson = async (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString() 
    };

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        try {
          const updatedPerson = await personAPI.update(existingPerson.id, { ...existingPerson, number: newNumber });
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson));
          setNewName("");
          setNewNumber("");
          setMessageType("success");
          setMessage(`Updated '${updatedPerson.name}'`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        } catch (error) {
          setMessageType("error");
          setMessage(`Failed to update '${existingPerson.name}'`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        }
      }
    } else if (persons.some((person) => person.number === newNumber)) {
      alert(`${personObject.number} is already added to phonebook`);
    } else {
      try {
        const returnedPerson = await personAPI.create(personObject);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setMessageType("success");
        setMessage(`Added '${returnedPerson.name}'`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      } catch (error) {
        setMessageType("error");
        setMessage("Failed to add person. Please try again.");
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      }
    }
  };

  const deletePerson = async (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      try {
        await personAPI.remove(id);
        setPersons(persons.filter(p => p.id !== id));
        setMessageType("success");
        setMessage(`Deleted '${person.name}'`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      } catch (error) {
        setMessageType("error");
        setMessage(`Information of '${person.name}' has already been removed from server`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      }
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType} />
      <Filter searchTerm={searchTerm} handleSearch={handleSearch} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;