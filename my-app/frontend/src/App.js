import { useEffect, useState } from "react";
import numberService from "./services/numberservices";
import "./App.css";

/* Komponentti joka ilmoittaa kun uusi henkilö on
lisätty onnistuneesti. */
const Notification = (props) => {
  if (props.message === null) {
    return null;
  } else {
    return <div className={props.style}>{props.message}</div>;
  }
};

/* Funktio filtteröinti-lomakkeen näyttämiseen. */
const FilterForm = (props) => {
  return (
    <form>
      <div>
        filter with:{" "}
        <input value={props.filter} onChange={props.filterchange} />
      </div>
    </form>
  );
};

/* Funktio henkilön lisäämiseen tarvittavien lomakkeiden
ja napin näyttämiseen. */
const AddPersonForm = (props) => {
  return (
    <form onSubmit={props.add}>
      <div>
        name: <input value={props.name} onChange={props.namechange} />
      </div>
      <div>
        number: <input value={props.number} onChange={props.numberchange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

/* Funktio (filtteröidyn) puhelinluettelon näyttämiseen. */
const ShowPhonebook = (props) => {
  return (
    <div>
      {props.persons.map((person) => (
        <ShowNameNumber
          id={person.id}
          key={person.name}
          name={person.name}
          number={person.number}
          deletePerson={props.deletePerson}
        />
      ))}
    </div>
  );
};

/* Funktio nimen ja numeron näyttämiseen. */
const ShowNameNumber = (props) => {
  return (
    <div>
      {props.name} {props.number}{" "}
      <button onClick={() => props.deletePerson(props.id)}>Delete</button>
    </div>
  );
};

/* Itse appi. */
const App = () => {
  /* Muuttujien ja listojen määrittely Reactin useStaten avulla.
  Event loopin takia näitä ei voi määritellä samalla tapaa kuin Pythonissa.
  Siinä tapauksessa tiedot nollautuisivat jokaisen loopin alussa. */
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterWith, setFilterWith] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationStyle, setNotificationStyle] = useState(null);

  /* Käytetään useEffect:ia ja numberService:a hakemaan tiedot 
  palvelimelta, ja asetetaan tiedot muuttujaan persons setPersons:in
  avulla ohjelman käynnistyessä. */
  useEffect(() => {
    numberService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  /* Funktio uuden henkilön lisäämiseen. Estetään default-toiminta,
  tarkastetaan (hieman kömpelösti) jos henkilön nimi löytyy listasta,
  ja jos ei löydy, lähetetään tiedot palvelimelle ja 
  lisätään palvelimelta palautettu numero-olio
  useStatessa määriteltyjen apuvälineiden avulla näytettävään listaan. */
  const addPerson = (event) => {
    event.preventDefault();
    const found = persons.filter((person) => person.name === newName);
    if (found.length === 0) {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      numberService
        .createNew(personObject)
        .then((addedPerson) => {
          setPersons(persons.concat(addedPerson));
          setNewName("");
          setNewNumber("");
          setNotificationStyle("succes");
          setNotificationMessage(`${newName} added succesfully!`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error.response.data);
          setNotificationStyle("error");
          setNotificationMessage(`${error.response.data.error}`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        });
    } else {
      if (
        window.confirm(`${newName} is already added to phonebook,
        replace the old number with a new one?`) === true
      ) {
        const updatePerson = persons.find((person) => person.name === newName);
        const oldNumber = updatePerson.number;
        console.log(oldNumber);
        updatePerson.number = newNumber;
        console.log(oldNumber);

        numberService
          .changeNumber(updatePerson.id, updatePerson)
          .then((response) => {
            console.log(response);
            setNotificationStyle("succes");
            setNotificationMessage(`${newName} number changed!`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.log(error);
            updatePerson.number = oldNumber;
            setNotificationStyle("error");
            setNotificationMessage(
              `Number must be format 12-123456 or 123-12345.`
            );
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          });
      }
    }
  };

  /* Tapahtumankäsittellijä nimen input-kentälle. Tällä pidetään huolta,
  että input kenttään voi kirjoittaa. */
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  /* Tapahtumankäsittelijä. */
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  /* Tapahtumankäsittelijä. */
  const handleFilterWith = (event) => {
    setFilterWith(event.target.value);
  };

  /* Funktio jonka avulla filtteröidään hebkilöitä. */
  const filterPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterWith)
  );

  /* Funktio jonka avulla poistetaan henkilö puhelinluettelosta. */
  const deletePersonId = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`) === true) {
      numberService.deleteEntry(id).then((response) => {
        console.log(response);
        setNotificationStyle("succes");
        setNotificationMessage(`${person.name} deleted!`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
        setPersons(persons.filter((person) => person.id !== id));
      });
    } else {
      console.log("canceled");
    }
  };

  return (
    <div className="App">
      <h1>The Phonebook App</h1>
      <Notification message={notificationMessage} style={notificationStyle} />
      <FilterForm filter={filterWith} filterchange={handleFilterWith} />
      <h2>Add new number</h2>
      <AddPersonForm
        add={addPerson}
        name={newName}
        namechange={handleNameChange}
        number={newNumber}
        numberchange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <ShowPhonebook persons={filterPersons} deletePerson={deletePersonId} />
    </div>
  );
};

export default App;
