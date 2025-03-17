import React, { useState, useEffect } from "react";

const API_BASE_URL = "http://backend:11002";  //  backend est le nom du service Kubernetes
 //  Remplace 11002 par le bon port

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Charger la liste des utilisateurs
  useEffect(() => {
    fetch(`${API_BASE_URL}/Users`)
      .then((res) => {
        console.log(" Réponse reçue de l'API:", res);
        return res.json();
      })
      .then((data) => {
        console.log(" Utilisateurs reçus:", data);
        setUsers(data);
      })
      .catch((err) => console.error(" Erreur chargement utilisateurs:", err));
  }, []);
  
  // Fonction pour ajouter un utilisateur
  const addUser = async () => {
    if (!name || !email) {
      alert("Merci de remplir tous les champs !");
      return;
    }
  
    const newUser = { name, email };
    console.log(" Envoi des données:", newUser);
  
    const response = await fetch(`${API_BASE_URL}/Users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
  
    console.log(" Réponse reçue:", response);
  
    if (response.ok) {
      alert(" Utilisateur ajouté !");
      setUsers([...users, newUser]);
    } else {
      alert(" Erreur lors de l'ajout !");
    }
  };
  
  

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2> Liste des utilisateurs</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.name} - {user.email}</li>
        ))}
      </ul>

      <h2> Ajouter un utilisateur</h2>
      <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={addUser}>Ajouter</button>
    </div>
  );
}

export default App;
