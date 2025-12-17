import { SimpleGrid, Box, Input, Select, VStack } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard";
import Layout from "../components/dashboardLayout/Index";


export default function Venues() {
const [venues, setVenues] = useState([]);
const [location, setLocation] = useState("");


useEffect(() => {
async function fetchVenues() {
const snap = await getDocs(collection(db, "venues"));
setVenues(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}
fetchVenues();
}, []);


const filtered = venues.filter(v =>
location ? v.location.toLowerCase().includes(location.toLowerCase()) : true
);


return (
  <Layout>
<Box maxW="1200px" mx="auto" p={6}>
<VStack mb={6} align="stretch">
<Input placeholder="Search by location" onChange={e => setLocation(e.target.value)} />
</VStack>


<SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
{filtered.map(v => <VenueCard key={v.id} venue={v} />)}
</SimpleGrid>
</Box>
</Layout>
);
}