// import React, { useState } from 'react';
// import { TextField, Button, Container, Typography, Card, CardContent } from '@mui/material';
// import { runQuery } from '../../services/sparqlService';
// import Header from '../Header/Header';
// import Footer from '../Footer/Footer';

// const Search = () => {
//   const [name, setName] = useState('');
//   const [results, setResults] = useState([]);

//   const searchPerson = async () => {
//     const query = `
//       PREFIX dbo: <http://dbpedia.org/ontology/>
//       SELECT ?name ?birth ?death ?interest WHERE {
//         ?person rdfs:label "${name}" .
//         ?person dbo:birthDate ?birth .
//         ?person dbo:deathDate ?death .
//         ?person dbo:interest ?interest .
//         ?person rdfs:label ?name .
//       }
//     `;
//     const data = await runQuery(query);
//     setResults(data);
//   };

//   return (
//     <>
//       <Header />
//       <Container style={{ marginTop: '30px' }}>
//         <Card style={{ backgroundColor: '#222', color: 'white' }}>
//           <CardContent>
//             <Typography variant="h5" style={{ color: '#D1C72E' }}>Search Individual</Typography>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Enter Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               InputProps={{ style: { color: 'white' } }}
//               InputLabelProps={{ style: { color: '#D1C72E' } }}
//             />
//             <Button variant="outlined" style={{ color: '#D1C72E', borderColor: '#D1C72E' }} onClick={searchPerson}>Search</Button>
//             {results.length > 0 && (
//               <ul>
//                 {results.map((person, index) => (
//                   <li key={index}>
//                     {person.name.value} - {person.birth.value} to {person.death.value} - {person.interest.value}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </CardContent>
//         </Card>
//       </Container>
//       <Footer />
//     </>
//   );
// };

// export default Search;