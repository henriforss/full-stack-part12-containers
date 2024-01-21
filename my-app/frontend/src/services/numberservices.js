import axios from "axios";

/* Määritellään baseURL. */
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const baseURL = `${REACT_APP_BACKEND_URL}/api/persons`;

/* Luodaan funktio getAll, joka hakee palvelimella olevat tiedot.
Muutetaan vastausta siten, että fuktio palauttaa uuden
puhelinnumero-olion. */
const getAll = () => {
  const request = axios.get(baseURL);
  return request.then((response) => response.data);
};

/* Luodaan funktio createNew, joka lähettää uuden olion palvelimelle,
ja palauttaa palvelimelta samaisen olion. */
const createNew = (personObject) => {
  const request = axios.post(baseURL, personObject);
  return request.then((response) => response.data);
};

/* Funktio deleteEntry, joka poistaa olion palvelimelta. */
const deleteEntry = (id) => {
  const request = axios.delete(`${baseURL}/${id}`);
  return request.then((response) => response.data);
};

/* Funktio jonka avulla voidaan vaihtaa henkilön puhelinnumero. */
const changeNumber = (id, personObject) => {
  const request = axios.put(`${baseURL}/${id}`, personObject);
  return request.then((response) => response.data);
};

/* Exportataan funktiot oliona. Eli { getAll: getAll, createNew: createNew }. */
export default { getAll, createNew, deleteEntry, changeNumber };
