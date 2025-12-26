import {  Routes, Route } from "react-router-dom";
import { Box, Heading, Text } from "@chakra-ui/react";

import Home from "./pages/Home";
import Venues from "./pages/Venues";
import VenueDetails from "./pages/VenueDetails";
import Signup from "./pages/Signup";

import Dashboard from "./pages/admin/Dashboard";
import CreateVenue from "./pages/admin/AddVenue";
import AddVenue from "./pages/AddVenue";
import MyVenues from "./pages/admin/myVenues";

function App() {
  

  return (
        <Box>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/login" element={<Signup />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/add-venue" element={<AddVenue />} />
            <Route path="/admin/my-venues" element={<MyVenues />} />

            <Route
              path="*"
              element={
                <Box p={10}>
                  <Heading>404</Heading>
                  <Text>Page not found.</Text>
                </Box>
              }
            />
          </Routes>
        </Box>
  );
}

export default App;
