import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import CreateReportScreen from "../screens/CreateReportScreen";
import UserScreen from "../screens/UserScreen";
import ReportScreen from "../screens/ReportScreen";
import SpeciesScreen  from "../screens/SpeciesScreen";

const Stack = createStackNavigator();

const MainStackNavigator = ({ openFirst }) => {
  return (
    <Stack.Navigator initialRouteName={openFirst}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="CreateReport" component={CreateReportScreen} />
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="Species" component={SpeciesScreen} />
    </Stack.Navigator>
  );
};

export { MainStackNavigator };
